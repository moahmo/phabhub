# PhabHub

### About
PhabHub is an integration service for publishing newly-created [Phabricator](https://github.com/phacility/phabricator) tasks as GitHub repository issues.

### Preconditions
- Phabricator Herald rule which, based on certain task-related conditions, triggers the Phabricator Webhook;
- Phabricator Webhook which, on trigger, sends a POST request to PhabHub service with task event information;
- You have to have the service deployed somewhere. POST route is `${baseServiceUrl}/issues`. 

_Example deployment: serverless, as an AWS Lambda function with [Up](https://github.com/apex/up)._

### Configuration and Deployment
A configuration file called `config.json` is necessary inside root project directory, in this basic format:

```
{
  "settings": {
    "github": {
      "endpoint": "https://api.github.com",
      "apiToken": "${githubApiToken}",
      "apiUserName": "${githubApiUserName}",
      "repoUserName": "${githubRepoUserNameAlsoFallbackForApiUserName}",
      "repositoryName": "${githubRepoName}"
    },
    "phabricator": {
      "endpoint": "https://phabricator.example.com",
      "apiToken": "${phabricatorApiToken}",
      "hmacKey": "${phabricatorWebhookHmacKey}"
    }
  }
}
```

_Using this file, you can also override default server settings from `src/config.js` (e.g. port, or test mode)._

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

### Advanced configuration
You can add advanced rules for publishing issues to different repositories, and adding different issue labels.

Example from `config.json`:
```javascript
{
  "settings": {
    "github": {
      // ...
      "repositoryName": "phabhub", // Push issue to this repository if no rules defined or matched.
      "repositoryNameRules": [
        {
          "type": "startsWith", // Type of matching: in this case, if task title starts with the matching value.
          "match": ["[FEATURE] PhabHub - Create", "Bug] PhabHub - Create"], // Possible match definitions.
          "repositoryName": "phabhub-test" // If match exists, push issue to this repository.
        },
        {
          // Other rules. In case of rule conflict, order in this array sets rule precedence.
        }
      ],
      "labelNameRules": [
        {
          "type": "startsWith",
          "match": ["[FEATURE]"],
          "labelName": "enhancement" // If match exists, add this label to the issue.
        },
        {
          // Other rules. In case of multiple rules, it's possible to add multiple labels to issues.
        }
      ]
    },
    // Other settings
  }
}
```
_Currently, these rules support matching information from task titles, with `startsWith` matching type._
