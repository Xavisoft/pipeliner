

const EventEmitter = require('events');
const express = require('express');
const fs = require('fs').promises;
const Queue = require('./Queue');
const crypto = require('crypto');
const { processWebhookPayload } = require('./utils');
const child_process = require('child_process');


/**
 * @class
 * @classdesc The Pipeliner class creates objects that listens to GitHub webhooks and emit events
 * 
 * @fires Pipeliner#push
 * @fires Pipeliner#pull_request
 * @fires Pipeliner#merge
 * @fires Pipeliner#release
 * @fires Pipeliner#new_branch
 * @fires Pipeliner#new_tag
 * @fires Pipeliner#unauthorized_webhook
 */
class Pipeliner extends EventEmitter {

   _isSignatureValid(signature, body) {
      const json = JSON.stringify(body);
      const expectedSignature = crypto.createHmac('sha256', this._hmacSecret).update(json).digest('hex');
      return expectedSignature == signature;
   }

   async _doesPathExists(path) {
      try {
         await fs.stat(path);
         return true;
      } catch {
         return false;
      }
   }

   _runCommand(cmd, args=[]) {
      return new Promise(resolve => {

         let output = '';
         let stderr = '';
         let stdout = '';
         
         const spawned = child_process.spawn(cmd, args);

         spawned.stdout.setEncoding("utf-8");
         spawned.stderr.setEncoding("utf-8");

         spawned.stderr.on("data", (data) => {
            stderr += data;
            output += data;
         });

         spawned.stdout.on('data', (data) => {
            stdout += data;
            output += data;
         });

         let err = null;
         let hasErred = false;

         spawned.on("error", (error) => {
            err = error;
            hasErred = true
         });


         spawned.on('close', () => {
            resolve({
               hasErred,
               err,
               output,
               stdout,
               stderr,
            });
         });

         
      })
   }

   _processWebhook = async (payload) => {

      const result = processWebhookPayload(payload);

      const {
         event,
         organization,
         repository,
      } = result;


      // emit events
      if (event) {
         /**
          * 
          * Emmitted when a new tag is created on a repository
          * 
          * @event Pipeliner#new_tag
          * @type {object}
          * @property {string} organization GitHub organization name
          * @property {string} repository GitHub repository name
          * @property {object} originalPayload Original data send by GitHub
          * @property {object} data 
          * @property {string} data.tag Name of the tag created
          * @property {string} data.branch The branch on which the tag was created
          */

         /**
          * 
          * Emmitted when a new branch is created on a repository
          * 
          * @event Pipeliner#new_branch
          * @type {object}
          * @property {string} organization GitHub organization name
          * @property {string} repository GitHub repository name
          * @property {object} originalPayload Original data send by GitHub
          * @property {object} data 
          * @property {string} data.branch Name of branch that was created
          */

         /**
          * 
          * Emmitted when a new release is created on a repository
          * 
          * @event Pipeliner#release
          * @type {object}
          * @property {string} organization GitHub organization name
          * @property {string} repository GitHub repository name
          * @property {object} originalPayload Original data send by GitHub
          * @property {object} data 
          * @property {string} data.branch Name of branch the realease was created from
          * @property {string} data.tag Name of tag the release was created from
          */

         /**
          * 
          * Emmitted when changes are pushed to a repository
          * 
          * @event Pipeliner#push
          * @type {object}
          * @property {string} organization GitHub organization name
          * @property {string} repository GitHub repository name
          * @property {object} originalPayload Original data send by GitHub
          * @property {object} data 
          * @property {string} data.branch Name of the branch the changes were pushed to
          */

         /**
          * 
          * Emmitted when a pull request is made
          * 
          * @event Pipeliner#pull_request
          * @type {object}
          * @property {string} organization GitHub organization name
          * @property {string} repository GitHub repository name
          * @property {object} originalPayload Original data send by GitHub
          * @property {object} data 
          * @property {string} data.branch Name of branch requesting to be merged
          * @property {string} data.base_branch Name of branch the changes are supposed to be merged to
          */

         /**
          * 
          * Emmitted when two branches are merged
          * 
          * @event Pipeliner#merge
          * @type {object}
          * @property {string} organization GitHub organization name
          * @property {string} repository GitHub repository name
          * @property {object} originalPayload Original data send by GitHub
          * @property {object} data 
          * @property {string} data.branch Name of branch that was requested to be merged
          * @property {string} data.base_branch Base branch
          */

         this.emit(event, result);
      }

      
      /**
       * This events has all the headers and body from GitHub. You can extend the capabilities using this package by listening to this event
       *
       * @event Pipeliner#webhook
       * @type {object}
       * @property {object} headers - Headers sent by GitHub
       * @property {object} body - The body of the request send by GitHub
       */
      this.emit('webhook', payload);

      // run scripts if available
      const repoPath = `${this._scriptsPath}/${organization}/${repository}`;

      const nodeScriptPath = `${repoPath}/${event}.js`;
      const bashScriptPath = `${repoPath}/${event}.sh`;

      const bashScriptExists = await this._doesPathExists(bashScriptPath);
      const nodeScriptExists = await this._doesPathExists(nodeScriptPath);

      if (bashScriptExists) {

         const response = await this._runCommand(bashScriptPath);
         const { hasErred, err, output, stdout, stderr } = response;

         try {
            await this.notify(hasErred, err, output, stdout, stderr);
         } catch {};
      }

      if (nodeScriptExists) {

         const response = await this._runCommand('node', [ nodeScriptPath ]);
         const { hasErred, err, output, stdout, stderr } = response;
         
         try {
            await this.notify(hasErred, err, output, stdout, stderr);
         } catch {};
      }

   }

   _endpointHandler = async (req, res) => {

      // send response immediately
      res.sendStatus(200);

      // validate signature
      const { body, headers } = req;
      let signature = headers['x-hub-signature-256'];
      let valid; 

      if (!signature) {
         valid = false;
      } else {

         valid = this._isSignatureValid(signature, body);
         
         if (signature.indexOf('sha256=') === 0) {
            signature = signature.substring("sha256=".length);
         }
      }
      
      if (!valid) {
         /**
          * 
          * This event is emitted an unauthroized client tries to send a webhook event
          * 
          * @event Pipeliner#unauthorized_webhook
          * @type {object} Headers from the request
          */
         this.emit('unauthorized_webhook', headers);
         return;
      }

      // add to queue
      this._queue.add(() => this._processWebhook({ headers, body }));

   }

   /**
    * 
    * To be overidden. It will be called when a script is finished with the output from the script
    * 
    * @param {boolean} hasErred indicates whether the command was run successfully
    * @param {Error} err The error that occured. null if hasErred is false
    * @param {string} output both stdout and stderr logs
    * @param {string} stdout stdout log
    * @param {string} stderr stderr log
    */
   async notify(hasErred, err, output, stdout, stderr) {
      
   }


   /**
    * This method initialize the pipeliner to start listening for webhook events
    * @returns {Promise}
    */
   async init() {
      
      if (!this._expressApp) {

         // create an express app and listen on the provided port
         this._expressApp = express();
         this._expressApp.use(express.json());
         
         await (() => {
            return new Promise(resolve => {  
               this._httpServer = this._expressApp.listen(this._port, resolve);
            });
         })();

         this._usingExpernalExpressApp = false;

      } else {
         this._usingExpernalExpressApp = true;
      }

      // attach enndpoint handler to the route
      this._expressApp.post(this._endpointPath, this._endpointHandler);

      this._initialized = true;

   }

   /**
    * This method stops the Pipeliner instance from listening to webhook events
    * @returns {Promise}
    */
   stop() {

      if (!this._initialized)
         return;
      
      if (this._usingExpernalExpressApp)
         throw new Error('The server express app was not created inside Pipeliner');

      return new Promise(resolve => {

         this._httpServer.close(() => {

            this._expressApp = null;
            this._httpServer = null;
            this._initialized = false;

            resolve();

         })
      });
   }

   /**
    * 
    * @param {object} options 
    * @param {object} options.expressApp   an express application (created by require('express)())
    * @param {object} options.port         The port to make the express application listen to. Only used when options.expressApp was not passed
    * @param {object} options.endpointPath The path the webhook events will be posted by GitHub
    * @param {object} options.scriptsPath  The path where scripts that response to events are stored
    * @param {object} options.hmacSecret   The secret used to verify if GitHub really sent the webhook events, not some ill-intended party
    */
   constructor(options) {

      const {
         expressApp,
         port=process.env.PORT,
         endpointPath='/github-webhook',
         scriptsPath=process.env.PWD,
         hmacSecret,
      } = options;

      super();

      // validate
      if (!port && !expressApp) {
         throw new Error('Provide either "port" or "expressApp"');
      }

      if (!hmacSecret) {
         throw new Error('"hmacSecret" is required');
      }

      if (typeof hmacSecret !== 'string') {
         throw new Error('"hmacSecret" value should be a string');
      }

      this._port = port;
      this._expressApp = expressApp;
      this._endpointPath = endpointPath;
      this._scriptsPath = scriptsPath;
      this._hmacSecret = hmacSecret;
      this._queue = new Queue();
      
   }
}


module.exports = Pipeliner;