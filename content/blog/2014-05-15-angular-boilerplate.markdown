+++
title = "Angular Boilerplate"
date = "2014-05-15T12:36:51+01:00"
comments = true
categories = [
  "tooling",
  "javascript"
]
description = "It's important in this era of web application development to have a strong toolset at your disposal. Growing complexity with 'fat' client apps can lead to a maintenance nightmare if not properly planned and thought out."

+++

It's important in this era of web application development to have a strong toolset at your disposal. Growing complexity with 'fat' client apps can lead to a maintenance nightmare if not properly planned and thought out.

Luckily there are a number of projects out there that can help. One such project is [Yeoman](http://yeoman.io/), which is 'The Web's Scaffolding Tool for Modern Webapps'. Yeoman essentially bundles together a few of the web's most important front-end tools:

- [Yo](https://github.com/yeoman/yo), a scaffolding tool to easily build out a new application and add components when required.
- [Grunt](http://gruntjs.com/), a build tool which runs tasks against your application. Typically used to preview, test and build your project.
- [Bower](http://bower.io/), a front-end dependency management system similar to npm or rubygems.

<!-- more -->

Yeoman encompasses these technologies and provides a solid base to build your apps from. A number of official and community generators are available to cover the different frameworks that are available today, such as Angular, Backbone, Bootstrap, Ember and others.

Recently I've taken the plunge and begun working with the MEAN stack: that's MongoDB, Express.js, Angular.js and Node.js. JavaScript everywhere! There are a few different Yeoman generators for the MEAN stack out there but after a bit of evaluation I settled with the most popular community generator, [angular-fullstack](https://github.com/DaftMonk/generator-angular-fullstack). This generator is a fork of the official angular generator, and so it provides you with all of the angular scaffolding, previewing, testing and building functionality, but it also includes Express.js and Mongoose.js for building a nice server-side API.

After using this particular generator for the last few weeks, I'm really happy with how it works. The author is very receptive to changes and has allowed me to help out with a few issues for the roadmapped 2.0 release, which already looks to be a big leap forward. Ironically, I find myself hardly using the Yo part of Yeoman, as I don't find it too difficult just to create my own files, and I don't really like the current naming conventions. However, I'm particularly happy with the comprehensive grunt tasks, taking care of building my Angular app, compiling and minifying it for deployment to Heroku. A speedy app is a good app and the compilation via Grunt is totally essential. Add in a bit of [LiveReload](http://livereload.com/), testing via [Karma](http://karma-runner.github.io/) (and soon [Protractor](https://github.com/angular/protractor) in 2.0) and nice dependency management with Bower, and I'm a happy app-camper.

The future is looking rosy, too. Here's to version 2.0 and [all it will bring](https://github.com/DaftMonk/generator-angular-fullstack/issues/192)!