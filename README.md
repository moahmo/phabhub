# PhabHub

### About
PhabHub is a service for publishing Phabricator tasks to GitHub issues.


### Preconditions
- Phabricator Herald rule which, based on certain task-related conditions, triggers the Phabricator Webhook;
- Phabricator Webhook which, on trigger, sends a POST request to PhabHub service with task event information;
- You have to have the service deployed somewhere. POST route is `${baseServiceUrl}/issues`.

### Deployment

A configuration file is necessary, in this format:
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
      "endpoint": "https://phabricator.example.com/api",
      "apiToken": "${phabricatorApiToken}",
      "hmacKey": "${phabricatorWebhookHmacKey}"
    }
  }
}
```

Using this file, you can also override default server settings (e.g. port).

Run the application with:
```
npm run start
```

### Local environment

After cloning the repo and `npm install`, run:


```
npm run dev
```

This will run the application with lint check and live reload.
