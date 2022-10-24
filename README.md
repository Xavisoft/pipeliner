
# pipeliner

This package helps you to create a CI/CD workflow using GitHub webhook events. You can provide scripts that will be executed when certain events happen, or add event listeners to respond to the events right in the your app. Unlike GitHub actions where you're limited to ```2000 CI/CD minutes per month```, webhooks are not limited. This package can also be extended if the events available are not adequate for your workflow.

## Installation
```
npm i @xavisoft/pipeliner
```

## Usage
### Using event listeners
```javascript
const Pipeliner = require('@xavisoft/pipeliner');
const child_process = require('child_process');

const options = {
   port: 8080,
   endpoint: 'webhook',
   hmacSecret: 'your_hmac_secret'
}

const pipeliner = new Pipeliner(options);

pipeliner.on('push', data) {

   const { repository } = data;

   const cmd = `
         cd ../${repository};
         git pull;
         npm install;
         pm2 restart ${repository}
   `;

   child_process.exec(cmd, (err) => {

      if (err) {
         console.error(err);
      }
   });
}
```

### Using scripts
You can write Bash or JS scripts that runs on specific events. A script saved at 
```path/to/scripts/git-organization/repository/eventName.js```  
OR  
```path/to/scripts/git-organization/repository/eventName.sh```  
will run when a certain event happens.
For example we can achieve the above by creating the bash script below:
```bash

# Saved at /path/to/project/pipeline_scripts/organization/repository/push.sh

git pull
npm install
pm2 restart {repository} # restaring the app

```

### Notifications
After every script runs, the results will be passed to ```pipeliner.notify()```. Override the function as below to send yourself notifications:
```javascript

class MyPipeliner extends Pipeliner {
   async notify(hasErred, err, output, stdout, stderr) {
      // your logic to notify yourself
   }
}

const pipeliner = new MyPipeliner(options);
pipeliner.init();
```

### Extensibility
The list of events emitted by the package may not be enough for your workflow. That's why we included the event ```webhook```. The event webhook is included to enable you to extend the list of events emitted by this package. It will emit all the headers and body of the request, so you can process the event as you see fit. This event is always emitted.

```javascript
pipeliner.on('webhook', payload => {
   const { headers, body } = payload;
   // do your thing
});
```

```javascript
const options = {
   port: 8080,
   endpoint: '/webhook',
   hmacSecret: 'your_hmac_secret',
   scriptsPath: __dirname + '/pipeliner_scripts'
}

const pipeliner = new Pipeliner(options);
```

### Adding your pipeliner an existing express app
If you pass ```port``` to the Pipeliner constructor, a new express is going to be created when you call ```pipeliner.init()```. If you have an already existing express app, you can mount pipeliner on the same app
```javascript

const expressApp = app;

const pipeliner = new Pipeliner({
   expressApp,
   endpoint: '/webhook',
   hmacSecret: 'your_hmac_secret',
   scriptsPath: __dirname + '/pipeliner_scripts'
});
```

<a name="Pipeliner"></a>

## Pipeliner
The Pipeliner class creates objects that listens to GitHub webhooks and emit events

**Kind**: global class  
**Emits**: [<code>push</code>](#Pipeliner+event_push), [<code>pull\_request</code>](#Pipeliner+event_pull_request), [<code>merge</code>](#Pipeliner+event_merge), [<code>release</code>](#Pipeliner+event_release), [<code>new\_branch</code>](#Pipeliner+event_new_branch), [<code>new\_tag</code>](#Pipeliner+event_new_tag), [<code>unauthorized\_webhook</code>](#Pipeliner+event_unauthorized_webhook)  

* [Pipeliner](#Pipeliner)
    * [new Pipeliner(options)](#new_Pipeliner_new)
    * [.notify(hasErred, err, output, stdout, stderr)](#Pipeliner+notify)
    * [.init()](#Pipeliner+init) ⇒ <code>Promise</code>
    * [.stop()](#Pipeliner+stop) ⇒ <code>Promise</code>
    * ["new_tag"](#Pipeliner+event_new_tag)
    * ["new_branch"](#Pipeliner+event_new_branch)
    * ["release"](#Pipeliner+event_release)
    * ["push"](#Pipeliner+event_push)
    * ["pull_request"](#Pipeliner+event_pull_request)
    * ["merge"](#Pipeliner+event_merge)
    * ["webhook"](#Pipeliner+event_webhook)
    * ["unauthorized_webhook"](#Pipeliner+event_unauthorized_webhook)

<a name="new_Pipeliner_new"></a>

### new Pipeliner(options)

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> |  |
| options.expressApp | <code>object</code> | an express application (created by require('express)()) |
| options.port | <code>object</code> | The port to make the express application listen to. Only used when options.expressApp was not passed |
| options.endpointPath | <code>object</code> | The path the webhook events will be posted by GitHub |
| options.scriptsPath | <code>object</code> | The path where scripts that response to events are stored |
| options.hmacSecret | <code>object</code> | The secret used to verify if GitHub really sent the webhook events, not some ill-intended party |

<a name="Pipeliner+notify"></a>

### pipeliner.notify(hasErred, err, output, stdout, stderr)
To be overidden. It will be called when a script is finished with the output from the script

**Kind**: instance method of [<code>Pipeliner</code>](#Pipeliner)  

| Param | Type | Description |
| --- | --- | --- |
| hasErred | <code>boolean</code> | indicates whether the command  ran successfully |
| err | <code>Error</code> | The error that occured. null if hasErred is false |
| output | <code>string</code> | both stdout and stderr logs |
| stdout | <code>string</code> | stdout log |
| stderr | <code>string</code> | stderr log |

<a name="Pipeliner+init"></a>

### pipeliner.init() ⇒ <code>Promise</code>
This method initialize the pipeliner to start listening for webhook events

**Kind**: instance method of [<code>Pipeliner</code>](#Pipeliner)  
<a name="Pipeliner+stop"></a>

### pipeliner.stop() ⇒ <code>Promise</code>
This method stops the Pipeliner instance from listening to webhook events

**Kind**: instance method of [<code>Pipeliner</code>](#Pipeliner)  
<a name="Pipeliner+event_new_tag"></a>

### "new_tag"
Emmitted when a new tag is created on a repository

**Kind**: event emitted by [<code>Pipeliner</code>](#Pipeliner)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| organization | <code>string</code> | GitHub organization name |
| repository | <code>string</code> | GitHub repository name |
| originalPayload | <code>object</code> | Original data send by GitHub |
| data | <code>object</code> |  |
| data.tag | <code>string</code> | Name of the tag created |
| data.branch | <code>string</code> | The branch on which the tag was created |

<a name="Pipeliner+event_new_branch"></a>

### "new_branch"
Emmitted when a new branch is created on a repository

**Kind**: event emitted by [<code>Pipeliner</code>](#Pipeliner)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| organization | <code>string</code> | GitHub organization name |
| repository | <code>string</code> | GitHub repository name |
| originalPayload | <code>object</code> | Original data send by GitHub |
| data | <code>object</code> |  |
| data.branch | <code>string</code> | Name of branch that was created |

<a name="Pipeliner+event_release"></a>

### "release"
Emmitted when a new release is created on a repository

**Kind**: event emitted by [<code>Pipeliner</code>](#Pipeliner)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| organization | <code>string</code> | GitHub organization name |
| repository | <code>string</code> | GitHub repository name |
| originalPayload | <code>object</code> | Original data send by GitHub |
| data | <code>object</code> |  |
| data.branch | <code>string</code> | Name of branch the realease was created from |
| data.tag | <code>string</code> | Name of tag the release was created from |

<a name="Pipeliner+event_push"></a>

### "push"
Emmitted when changes are pushed to a repository

**Kind**: event emitted by [<code>Pipeliner</code>](#Pipeliner)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| organization | <code>string</code> | GitHub organization name |
| repository | <code>string</code> | GitHub repository name |
| originalPayload | <code>object</code> | Original data send by GitHub |
| data | <code>object</code> |  |
| data.branch | <code>string</code> | Name of the branch the changes were pushed to |

<a name="Pipeliner+event_pull_request"></a>

### "pull_request"
Emmitted when a pull request is made

**Kind**: event emitted by [<code>Pipeliner</code>](#Pipeliner)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| organization | <code>string</code> | GitHub organization name |
| repository | <code>string</code> | GitHub repository name |
| originalPayload | <code>object</code> | Original data send by GitHub |
| data | <code>object</code> |  |
| data.branch | <code>string</code> | Name of branch requesting to be merged |
| data.base_branch | <code>string</code> | Name of branch the changes are supposed to be merged to |

<a name="Pipeliner+event_merge"></a>

### "merge"
Emmitted when two branches are merged

**Kind**: event emitted by [<code>Pipeliner</code>](#Pipeliner)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| organization | <code>string</code> | GitHub organization name |
| repository | <code>string</code> | GitHub repository name |
| originalPayload | <code>object</code> | Original data send by GitHub |
| data | <code>object</code> |  |
| data.branch | <code>string</code> | Name of branch that was requested to be merged |
| data.base_branch | <code>string</code> | Base branch |

<a name="Pipeliner+event_webhook"></a>

### "webhook"
This events has all the headers and body from GitHub. You can extend the capabilities using this package by listening to this event

**Kind**: event emitted by [<code>Pipeliner</code>](#Pipeliner)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| headers | <code>object</code> | Headers sent by GitHub |
| body | <code>object</code> | The body of the request send by GitHub |

<a name="Pipeliner+event_unauthorized_webhook"></a>

### "unauthorized_webhook"
This event is emitted an unauthroized client tries to send a webhook event

**Kind**: event emitted by [<code>Pipeliner</code>](#Pipeliner)