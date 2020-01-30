+++
title = "Creating a demo page for your npm module"
date = "2015-12-17T07:12:02+00:00"
comments = true
categories = [
  "nodejs",
  "npm",
  "javascript"
]
description = "So, you've created a super-awesome npm module, and you want to share it with the world. How do you create a demo page?"
+++

So, you've created a super-awesome [npm](https://npmjs.org) module, and you want to share it with the world. You've seen other modules include handy demo sites, where you can play around with the functionality directly in your browser, before even downloading the module yourself. So, just how do you create a demo page?

In the past, if you created server-side code, you'd need to run a server so that a demo could be created. However, since we are just writing JavaScript, provided your module is not using any node-specific APIs, we can use a few friends to package up your npm module for consumption by a static web page. This is really nice, as it means you can publish your demo page to a static host, such as Github Pages.

In this post, I'll walk through how to setup an automatic build toolchain to create and publish a static demo page for your super-awesome module.

<!-- more -->

Here are the steps we'll take to publish your demo page.

1. Install grunt and all of the dependencies needed to build the page.
2. Create a demo folder, which includes the static HTML, CSS and JavaScript that will be published.
3. Implement your HTML demo page and associated JavaScript, making use of the browserified module.
4. Setup a `Gruntfile` to browserify your module and make it available for your demo page.
5. Use `grunt` to build and deploy your demo site to GitHub Pages.

The tutorial assumes that you have:

- Created a module in `lib/index.js`
- A valid `package.json` file
- Checked in your code to a repository on GitHub.

Your folder structure should resemble the following:

```
├── lib/
|   └── index.js
├── package.json

```

## 1. Install dependencies

We'll be using [grunt](https://gruntjs.com) to automate the building and deploying of the demo page. Install grunt and all the needed plugins with these commands:

```
npm install -g grunt-cli
npm install --save-dev grunt grunt-browserify grunt-build-control grunt-contrib-clean grunt-contrib-connect grunt-contrib-copy grunt-contrib-uglify grunt-contrib-watch jit-grunt
```

## 2. Create a demo folder

The next step is to create a demo folder. Populate it with three files as shown below:

```
├── demo/
|   ├── index.css
|   ├── index.html
|   └── index.js
├── lib/
|   └── index.js
├── package.json

```

## 3. Implement your demo site

### 3.1 `index.js`

This is where your JavaScript magic will live.

In this `index.js` file, we'll pull in our super-awesome module with a `require` call, and use it directly. `require` is part of [CommonJS](http://www.commonjs.org/), and while this isn't supported by vanilla JavaScript in the browser, we'll use a tool called [browserify](http://browserify.org/) to package up the modules and make them available for consumption by the browser.

The rest of `index.js` will likely be concerned with accessing the DOM and manipulating the HTML view.

Here's an example:

``` js
// index.js

'use strict';

var superAwesome = require('super-awesome');

var input = document.getElementById('input');
var result = document.getElementById('result');

input.addEventListener('input', function() {
  result.value = superAwesome(input.value);
});

```

Here, we are listening for any changes to the `input` and updating the `result` using the `superAwesome` library.

### 3.2 `index.html`

This is the part where you create your demo page. Open up the `index.html` page and create your masterpiece.

In your HTML page, we need to include our script file too, so make sure you include a reference to it. It's a good idea to put the script below your DOM elements so that we know that the DOM is fully initialised before we add the event handler.

``` html
<html>
  <body>
    <input id="input" type="text">
    <pre id="result"></pre>
    <script src="index.js"></script>
  </body>
</html>
```

We are now done with the implementation of the demo page. If we try to access the file at `demo/index.html` in a browser, however, things will fail, because the browser doesn't know what to do with the `require` call in `index.js`.

To solve this, we need to use browserify to build a bundle which can then be used in the browser.

## 4. Setup a `Gruntfile` to browserify your module

The next step is to include a Gruntfile to package up your module as something that the browser understands. We'll use `grunt-broswerify` and some common grunt utility plugins to create a folder `build` which we can then serve using a static web server, and hence can be deployed to GitHub Pages.

Here is the Gruntfile in full:

``` js
'use strict';

module.exports = function (grunt) {

  // Load grunt tasks automatically, when needed
  require('jit-grunt')(grunt, {
    buildcontrol: 'grunt-build-control'
  });

  grunt.initConfig({
    clean: {
      demo: ['build']
    },
    copy: {
      demo: {
        files: {
          'build/index.html': ['demo/index.html']
        }
      }
    },

    browserify: {
      options: {
        alias: {
          'diffex': './lib/index.js'
        }
      },
      demo: {
        files: {
          'build/index.js': ['demo/index.js']
        },
        options: {
          watch: true
        }
      }
    },

    buildcontrol: {
      options: {
        dir: 'build',
        commit: true,
        push: true,
        connectCommits: false,
        message: 'Built live demo from commit %sourceCommit%'
      },
      demo: {
        options: {
          // Update the remote to point to your github repo
          remote: 'git@github.com:fiznool/super-awesome.git',
          branch: 'gh-pages',
        }
      }
    },

    connect: {
      dev: {
        options: {
          base: 'build',
          hostname: 'localhost',
          port: 3000,
          livereload: true
        }
      }
    },

    watch: {
      dev: {
        files: 'build/index.js',
        options: {
          livereload: true
        }
      }
    }
  });

  grunt.registerTask('build', ['clean', 'copy', 'browserify']);
  grunt.registerTask('serve', ['build', 'connect', 'watch']);
  grunt.registerTask('deploy', ['build', 'buildcontrol']);
  grunt.registerTask('default', ['serve']);
};
```

Here is a rundown of the tasks, and what occurs at each stage.

### `build`

 - Cleans the `build` folder, removing atrifacts from a previous build.
 - Copies over the `demo/index.html` file to the `build` folder.
 - Uses browserify to package up the source in `demo/index.js` and anything that is `require`d into a single bundle, and writes it out to the `build` folder.

### `serve`

 - Builds the demo page as above.
 - Begins a web server on port `3000` where you can preview the demo page.
 - Watches for changes to the JavaScript source, and automatically re-browserifies the bundle, and reloads the browser.

### `deploy`

- Builds the demo page as above.
- Pushes the contents of the `build` folder to a branch called `gh-pages`. This automatically creates a new GitHub Pages page at the URL `https://<user>.github.io/<project>`.

## 5. Use `grunt` to build and deploy the site

This is the fun part! Once you are happy with your demo page, run

```
grunt deploy
```

This will build your demo site and deploy it to GitHub Pages, where you can see it in all its glory!

## Summary

Creating a simple demo page for your super awesome npm module is easy with a little help from grunt and friends. We can use the power of GitHub Pages to create a nice demo site, and host it for free.

I'd love to hear feedback on this method, in particular if there is anything I've missed, or could be done better. If you have anything to add, please let me know in the comments below or via [my Twitter](https://twitter.com/fiznool). Thanks for reading!
