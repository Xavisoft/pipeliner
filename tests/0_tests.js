

require('dotenv').config();
console.clear();

const { v4: uuid } = require('uuid');
const Pipeliner = require('..');
const chai = require('chai');
const { assert } = require('chai');
const chaiHttp = require('chai-http');
const { generateWebhookPayload, generateXHubSignature } = require('./utils');
const fs = require('fs').promises;
const freePorts = require('find-free-ports');
const express = require('express');

chai.use(chaiHttp);
 

function setHeadersToRequest(req, headers={}) {

   delete headers.host;
   
   for (let header in headers)
      req.set(header, headers[header]);
   
   return req;
}

async function deleteFile(path) {
   try {
      await fs.unlink(path);
   } catch {};
}

async function pathExists(path) {
   try {
      await fs.stat(path);
      return true;
   } catch (err) {
      return false;
   }
}


function delay(millis) {
   return new Promise(resolve => setTimeout(resolve, millis))
}


suite("Tests", function() {

   const hmacSecret = '58a09d85-2313-486b-953f-91493c686f8f';
   const port = process.env.PORT || 8080;

   const options = {
      hmacSecret,
      scriptsPath: `${__dirname}/assets/pipeliner_scripts`,
      endpointPath: '/webhook',
      port
   }


   const pipeliner = new Pipeliner(options);

   let requester, httpServer;

   this.beforeAll(async() => {
      await pipeliner.init();
      requester = chai.request(`http://localhost:${port}`).keepOpen();
      requester.get('/').send()
   });

   test("A webhook should make pipeliner object emit an event", async () => {

      const { headers, body } = generateWebhookPayload('tag');
      headers['X-Hub-Signature-256'] = generateXHubSignature(hmacSecret, body);

      let eventTriggered = false;

      pipeliner.once('new_tag', () => {
         eventTriggered = true;
      })

      const req = requester.post('/webhook');
      const res = await setHeadersToRequest(req, headers)
         .send(body);
      
      assert.equal(res.status, 200);
      assert.equal(eventTriggered, true);
                           
   });

   test("A webhook should run a provided script", async () => {

      const { headers, body } = generateWebhookPayload('tag');
      headers['X-Hub-Signature-256'] = generateXHubSignature(hmacSecret, body);

      const resultFilePath = `${__dirname}/assets/pipeliner_scripts/Xavisoft/temp/text.txt`;
      await deleteFile(resultFilePath);

      const req = requester.post('/webhook');
      const res = await setHeadersToRequest(req, headers)
         .send(body);
      
      assert.equal(res.status, 200);

      await delay(500); // waiting for the file to be written

      const fileExists = await pathExists(resultFilePath);
      assert.equal(fileExists, true);
      
   });

   test("A webhook event should not do anything if the signature is invalid", async () => {

      const { headers, body } = generateWebhookPayload('tag');
      headers['X-Hub-Signature-256'] = generateXHubSignature(uuid(), body);

      let eventTriggered = false;

      pipeliner.on('new_tag', () => {
         eventTriggered = true;
      })

      const req = requester.post('/webhook');
      const res = await setHeadersToRequest(req, headers)
         .send(body);
      
      assert.equal(res.status, 200);
      assert.equal(eventTriggered, false);

   });


   test('Pipeliner should also work with a passed express app', async () => {

      const [ port ] = await freePorts.findFreePorts(1);
      const endpointPath = '/webhook';

      const expressApp = express();
      let httpServer;

      await (() => {
         return new Promise(resolve => {
            httpServer = expressApp.listen(port, resolve);
         })
      })();

      const pipeliner = new Pipeliner({
         expressApp,
         endpointPath,
      });

      await pipeliner.init();

      const { headers, body } = generateWebhookPayload('tag');

      let req = chai
         .request(`http://localhost:${port}`)
         .post(endpointPath);
      
      req = setHeadersToRequest(req, headers);
      const res = await req.send(body);

      await (() => {
         return new Promise(resolve => httpServer.close(resolve));
      })()

      assert.equal(res.status, 200);


   });



   this.afterAll(async () => {
      await pipeliner.stop();
   })
});