+++
title = "An Alternative to npm Private Modules"
date = "2015-05-20T18:11:23+01:00"
comments = true
categories = [
  "javascript",
  "node"
]
description = "In this article, I'm going to show you how you can replicate npm private hosting using GitHub or Bitbucket, and access these modules from your deployment server and/or Heroku."
+++

_Note: this article was written in May 2015. Much has changed since then, so the below may no longer be relevant. I will look to publish a revised post soon._

npm has recently unleashed [private modules](https://www.npmjs.com/private-modules) to world. This allows you to publish a node module to your own private registry, and install it via `npm install` as normal. I think this is a good move from npm, and with a price of only $7/user/month, it doesn't break the bank.

If you are already using GitHub to host your private module's source code, you might however be wondering whether paying for another service is worth it. In some situations, using a private npm registry is the correct choice, such as if you need strict semver adherence, or need to separate your source code hosting from your production module hosting. In many cases, however, you can get away without using npm for hosting your private modules.

In this article, I'm going to show you how you can replicate npm private hosting using GitHub or Bitbucket, and access these modules from your deployment server and/or Heroku.

<!-- more -->

The basic idea is as follows:

1. Host your module's source code on GitHub/Bitbucket, in a private repo.
2. Define a dependency on this module in your project's `package.json`, pointing to the private module with an SSH url.
3. Setup a deploy keypair to access your private module via SSH, and upload the public key to GitHub/Bitbucket.
4. Add a `preinstall` and `postinstall` script to your project's package.json, to setup and teardown SSH configuration, in order to access the private module during `npm install`.
5. Encode the private key and set as an environment variable during deployment.

The code for an example project based on the below can be [found on GitHub](https://github.com/fiznool/poirot).

## 1. Hosting your module

There are two major choices here: [GitHub](https://github.com) and [Bitbucket](https://bitbucket.org). They both do the same job - host your source code via git, and offer pull requests, issue trackers and wikis.

The major difference between the two is their pricing structure. GitHub requires you to pay for any private repos, whereas Bitbucket allows you to host private repos for free. Many people prefer GitHub to Bitbucket, but the latter is still an excellent choice, and is seriously worth considering.

You can choose either service to host your module - both work just fine with this technique. If you don't know which one to pick, start with Bitbucket - it's free.

_Note: If you pick GitHub, try to ensure you sign up as an organization. This is so that you can create a machine user and add it to the repo as a read-only collaborator. If you use a personal plan, you'll be stuck with a deploy key with read/write permissions, which is less than ideal - a deployment should only ever need read-only access to the private module._

## 2. Depending on your module

Modules are marked as dependencies with `npm` in `package.json`, under `dependencies`.

Let's assume you have a project which needs to access code from a private module, `private-parts`, which is hosted on Bitbucket under the user `bigbluebananas`. Setup your package.json file to resemble the following:

``` json
{
  ...
  "dependencies": {
    "private-parts": "git@bitbucket.org:bigbluebananas/private-parts.git"
  },
  ...
}
```

Since this repo is private, when we try to run `npm install`, we'll be greeted with an error. To access it, we'll need to setup a deploy key.

## 3. Setup a deploy key

Create a new SSH key:

```
ssh-keygen -t rsa -b 4096 -C "deploy@example.com"
```

- Replace the email address with something real. Or not, it doesn't really matter.
- When prompted with a location to save the generated keys, **don't overwrite your existing SSH key!! Save your key to somewhere else, e.g. your desktop.**
- Don't add a passphrase to the key.

You should now have a private/public keypair. You'll use the private key on your deploy server, and upload your public key to GitHub/Bitbucket - thus providing deploy-time access to your private module.

The next step is to upload the public key.

### GitHub

You've got two options with GitHub.

If you have a personal account, or you aren't fussed about your deploy key having read/write privileges, use a [GitHub Deploy Key](https://developer.github.com/guides/managing-deploy-keys/#deploy-keys). They are easier to setup than machine users.

If you have a organization account, and want to limit your deploy key to read-only access, setup a [GitHub Machine User](https://developer.github.com/guides/managing-deploy-keys/#machine-users) and add it as a collaborator to your repo.

### Bitbucket

Deploy keys in Bitbucket provide read-only access to the repo. [Check out this guide](https://confluence.atlassian.com/display/BITBUCKET/Use+deployment+keys) for details on how to add a deploy key.

## 4. Add pre/postinstall scripts

To access the private module, you need to let npm know that you've got a private key, and that it should use this private key for SSH connections to your host.

Unfortunately, there isn't an explicit hook into npm to achieve this. Instead, we are going to setup a temporary SSH configuration before npm installs the module, and tear it down afterwards. We achieve this using `preinstall` and `postinstall` hooks.

Firstly, grab the scripts from [this gist](https://gist.github.com/fiznool/88442338db96a898f1dc). Copy these into your project's root folder.

Make sure the scripts are executable:

``` bash
chmod +x setup-ssh.sh cleanup-ssh.sh
```

Next, add the following entries to your `package.json`:

``` json
{
  ...
  "scripts": {
    "preinstall": "bash setup-ssh.sh",
    "postinstall": "bash cleanup-ssh.sh"
  },
  ...
}
```

The preinstall script sets up an SSH config file, containing the correct config to connect to GitHub/Bitbucket, with the private key harvested from an environment variable.

The postinstall script undoes this action, and clears out the environment variable.

This way, when `npm install` runs, and it encounters the SSH urls in the `dependencies` section of `package.json`, it will automatically use the temporary SSH config, authenticating with the private key and pulling down the private module.

## 5. Adding private key to environment

The last thing to do is to set the private key in the environment.

The key should be base64 encoded. At the terminal, use

``` bash
base64 -w 0 < deploy_key
```

replacing `deploy_key` with the name of your key.

This should produce a long string of characters. Set this as the environment variable `GIT_SSH_KEY` on your deployment server, and then try running `npm install`. Your private module should be pulled down correctly.

## Bonus: Heroku integration

This technique was built to work with Heroku. Simply set the `GIT_SSH_KEY` environment variable on your Heroku app and push your project's code to Heroku. The container should use the private key from the environment variable to pull down your private module.

## Bonus 2: Rudimentary versioning

You can use git tags to achieve basic package versioning. Simply tag your private module and depend on this in your `package.json`:

``` json
{
  ...
  "dependencies": {
    "private-parts": "git@bitbucket.org:bigbluebananas/private-parts.git#v1.0.0"
  },
  ...
}
```

You don't get semver niceness like you do with npm packages, but for basic versioning, git tags might be all you need.

## Summary

You don't need to go through the extra cost and hassle associated with npm private registries to deploy private modules. This technique shows you a way to host and deploy private modules, which works especially nicely when using Heroku.

## Credits

Credit goes to [this Stack Overflow answer](http://stackoverflow.com/a/22826291/1171775) from Michael Lang, which inspired this technique.
