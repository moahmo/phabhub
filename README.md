# PhabHub

### About
PhabHub is a service for publishing [Phabricator](https://github.com/phacility/phabricator) tasks as GitHub issues.


### Preconditions
- Phabricator Herald rule which, based on certain task-related conditions, triggers the Phabricator Webhook;
- Phabricator Webhook which, on trigger, sends a POST request to PhabHub service with task event information;
- You have to have the service deployed somewhere. POST route is `${baseServiceUrl}/issues`. 

_Example deployment: deploying it servelessly as an AWS Lambda function with [Up](https://github.com/apex/up)._

### Deployment
A configuration file called `config.json` is necessary inside root project directory, in this format:

```
{
  "settings": {
    "github": {
      "endpoint": "https://api.github.com",
      "apiToken": "${githubApiToken}",
      "user": "${githubUserName}",
      "repo": "${githubRepoName}"
    },
    "phabricator": {
      "endpoint": "https://phabricator.example.com",
      "apiToken": "${phabricatorApiToken}",
      "hmacKey": "${phabricatorWebhookHmacKey}"
    }
  }
}
```

_Using this file, you can also override default server settings from `src/config.js` (e.g. port)._

Once you have everthing properly configured, run the application with:

```
npm run start
```

### Local environment
After cloning the repo and `npm install`, run:

```
npm run dev
```

This will run the application with lint check and live reload.
