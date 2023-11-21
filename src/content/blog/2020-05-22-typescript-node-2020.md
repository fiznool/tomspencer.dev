---
categories:
- nodejs
- javascript
- typescript
pubDate: "2020-05-22T19:41:44+01:00"
description: 'It''s 2020. You want to build a node.js app, and you''ve heard great
  things about TypeScript. Let this post act as your guide through the forest of compilers
  and specifications as you navigate to the promised land: a strongly-typed node.js
  codebase.'
title: 'It''s 2020: let''s build a node.js app with TypeScript'
---

It's 2020. You want to build a node.js app, and you've heard great things about TypeScript. You want to build it the _right way_ this time, starting with good intentions.

As with most things JavaScript, there are a myriad of posts, Stack Overflow answers and repositories you could use to get set up. Sadly many of these are out of date. The aim of this post is to help you set up a TypeScript project for building a node.js app, using the state of the art in 2020.

Before we get started, if you want to skip the tutorial there is a concise summary [available at the end of the post]({{< relref "#summary">}}).

Otherwise, let's dive in!

---

## Prerequisites

You need node.js installed - if you don't, the easiest way is to [head over to the node.js downloads page and choose the latest 'LTS' release](https://nodejs.org/en/download/).

You also need a code editor: I prefer [VSCode](https://code.visualstudio.com/) due to it's first class support for TypeScript. It's free, too.

> I'll refer to VSCode in the rest of the post, but feel free to switch this out for the editor of your choice.

---

## Project

### Init

Let's start by scaffolding out a new project. We'll use `npm` to do this.

Firstly, create a new folder - this is where the project files will live. I'll call mine `node-typescript-2020`.

Next, open a terminal in this folder and run:

``` sh
npm init
```

Follow the instructions. Once finished, you will have a brand new `package.json` file. Amongst other things, this is where dependencies will be listed, and our scripts will be defined.

### TypeScript

Next, install the latest version of TypeScript:

``` sh
npm install -D typescript
```

This will install TypeScript as a `devDependency`.

> Why? Node.js cannot run TypeScript code: it must first be _compiled_ into JavaScript. Later, we'll write a script which does this for us. We therefore only need TypeScript at _compile-time_ - node.js will run the compiled JavaScript files.

### app.ts

We'll now create the entrypoint for our app.

- Open VSCode in your project.
  - You should see the `package.json` file in the File Explorer, alongside a `package-lock.json` file and a `node_modules` folder. These all work in tandem to define and hold your project's dependencies.
- Create a new folder `src/`. Inside it, create a new file and name it `app.ts`.
- Open the file in VSCode and add the following contents:

``` ts
const writeMessage = (message: string) => {
  console.log(message);
}

writeMessage('Hello, World!');
```

Hopefully this should make sense - we are defining a function using arrow syntax, and calling it with a message. The `message: string` argument demonstrates the usage of a type - this defines the `message` parameter as a string.

You should now have a file `src/app.ts`. Next, we'll set up the project to run this file with node.js.

### Compile

As mentioned above, node.js cannot natively run TypeScript, it needs to be compiled down to JavaScript.

To do this, we will use TypeScript in _compile mode_. Later, we'll relegate TypeScript to perform type-checking only, and choose a better tool to perform compilation.

In the terminal, run

```
node_modules/.bin/tsc src/app.ts --outDir dist/
```

You should see a new folder `dist/` created, containing a file `app.js`. This is the file that TypeScript has compiled.

### Run

Now that we have a `.js` file, we can run it with node. In the terminal run:

```
node dist/app.js
```

If all went well, you should see `Hello, World!` printed to the terminal.

### Compiled file

If you open the compiled file `dist/app.js` in VSCode you will notice a few differences to the source file:

``` js
"use strict";
var writeMessage = function (message) {
    console.log(message);
};
writeMessage('Hello, World!');
```

- There is a `"use strict"` declaration at the top of the file.
- The `const` has been replaced with a `var`.
- The arrow function is replaced with a traditional `function`.

TypeScript has compiled this into ES5-compatible JavaScript, which is the default output mode. Out of the box, node.js is aware of both `const` and arrow functions, so later we will tweak the compilation process to output more modern code that is still compatible with node.js.

---

## Refinement

We've now achieved our goal: using TypeScript with node.js. Time to put up our feet and relax...?

Not quite - we can do better. Let's refine this process, starting with the command to run the TypeScript compiler.

### tsconfig.json

As demonstrated above, TypeScript can be run entirely from the command line using flags, but it can be tedious to do so. Instead, the majority of TypeScript projects use a configuration file, `tsconfig.json`.

Creating a new config file is straightforward. Run the following:

``` sh
node_modules/.bin/tsc --init
```

A new `tsconfig.json` file should now be present in the root of your project.

If you open this file, you will find that most of the configuration options are commented out. We need to make two changes:

1. Uncomment the `"outDir"` property, and set it to `./dist`.
2. Below the `"compilerOptions"` property, add a new property: `"include": ["./src/**/*"]`

Your `tsconfig.json` file should now resemble the following:

``` json
{
  "compilerOptions": {
    ...
    "outDir": "./dist",
    ...
   },
  "include": ["./src/**/*"]
}
```

Now, we can compile the TypeScript code with the following command:

``` sh
node_modules/.bin/tsc
```

The `tsc` executable will automatically pick up the configuration and compile the code into the `dist/` folder, as before.

### npm run script

Up to now, we've been running the `tsc` executable directly, from the `node_modules` folder. We can clean this up through the use of an __npm run script__.

Run scripts are added to the `package.json` file under the `scripts` property. Scripts automatically place anything in the `node_modules/.bin` folder into the path, meaning you don't need to write out `node_modules/.bin` every time you need to run an executable from that folder.

Let's create a run script for compiling the code. In `package.json`, find the `scripts` property and change to the following:

``` json
{
  "scripts": {
    "compile": "tsc"
  }
}
```

Now, run

``` sh
npm run compile
```

You should see the same result as before.

This is where many tutorials end, but we are going to take things one step further, and introduce Babel.

---

## Babel

JavaScript is not a fixed entity - it is constantly evolving, with new language features being added all the time. Each year, the governing body known as [TC39](https://www.ecma-international.org/memento/tc39-rf-tg.htm) ratifies a new set of features and APIs for the language, which are added to the main ECMAScript specification.

In 2020 we saw [optional chaining](https://github.com/tc39/proposal-optional-chaining), [nullish coalescing](https://github.com/tc39/proposal-nullish-coalescing),  [dynamic imports](https://github.com/tc39/proposal-dynamic-import), [BigInt](https://github.com/tc39/proposal-bigint) and many more features introduced. 2020 was a great year for the language!

Once the specification is released, it takes time for the various JavaScript engines to implement these features. At any one time, there are also numerous other proposed features at various stages, which may or may not be released in a future specification.

As a result, we end up in a situation where we would like to write modern code, but have to ensure it will run in a certain JavaScript environment.

Enter: [Babel](https://babeljs.io/), the 'next generation compiler for JavaScript'. It takes cutting-edge JavaScript and converts it into code that will run in any given engine. It has quickly become the industry standard for JavaScript-JavaScript compilation, meaning we can write future proof code and be confident it will run in any supported environment.

Notice something? This is similar to what TypeScript is doing too, compiling from a higher level language into something that the engine can understand (in our case, the engine is [v8](https://v8.dev/), which powers node.js).

So, it seems that we have two competing compilers, both offering similar things. Luckily, the Babel and TypeScript teams noticed this too, and they collaborated to release a new version of Babel which _radically changes the value proposition of TypeScript_.

In a nutshell, when combining TypeScript with Babel, they leave each other to do what they do best:

- TypeScript is used to check types.
- Babel is used to compile TypeScript code into JavaScript.

But, how does Babel know what to do with TypeScript? Short answer: it doesn't. Since it doesn't concern itself with checking the types (that's the job of TypeScript itself), it simply takes the TypeScript code and _erases the type annotations_. The result is next-generation JavaScript code, which is then transformed into the end result that can run in the target environment. It's a neat trick, and allows us to reap the benefits of both TypeScript and Babel.

Hopefully I've convinced you of the merits of using Babel and TypeScript together. I firmly believe this is the future for these tools, and I encourage you to read on to learn how to pair them together.

## Checking types with TypeScript

Since Babel does not check types, the TypeScript compiler still has a role to play. We will ask TypeScript to check the types, but without emitting any compiled files.

Make the following changes to the `compilerOptions` property in `tsconfig.json`:

``` json
{
  "target": "ESNext",
  "lib": ["ESNext"],
  "noEmit": true
}
```

The `"target"` and `"lib"` options specify that we want to preserve the syntax that we have written, essentially switching off the compilation phase. The `"noEmit"` option then informs TypeScript that we do not want it to produce compiled files, instead it will simply check the types, and tell us if there are any errors.

### Lib types

If you open the file `src/app.ts`, you will now see an error:

`Cannot find name 'console'. Do you need to change your target library? Try changing the ``lib`` compiler option to include 'dom'.`

Up to now, TypeScript has assumed that the code we are writing is intended for the browser. Since we have changed the `"lib"` compiler option, we have opted-out of this arrangement, and so TypeScript is notifying us that the global `console` is no longer available.

We know that `console` is a valid global for our target environment, but we need to tell TypeScript about it. To do this, we need to install the typings for the standard node APIs.

To do this, run:

``` sh
npm install -D @types/node
```

Briefly, an entire repository of types exists under the `@types/` namespace on npm. This allows you to work with your favourite JavaScript-authored libraries in TypeScript, providing the type declarations that TypeScript needs in order to provide code completion and type safety.

Now that this is installed, verify that the error has vanished by opening the `src/app.ts` file once more.

## Installing Babel

Let's run our compile command once more. Delete the `dist/` folder and then run:

```
npm run compile
```

Notice something? Or the absence of something? The `dist/` folder has not reappeared - this is because we told TypeScript not to emit any files. Step in, Babel!

We should now install Babel and make it TypeScript-aware. Install the following modules:

``` sh
npm install -D @babel/core @babel/cli @babel/preset-typescript @babel/preset-env
```

Here is a rundown of these modules:

- `@babel/core`: the 'core' utilities and functions used to transform code.
- `@babel/cli`: exposes the Babel core functions for use on the command line.
- `@babel/preset-typescript`: Babel core does nothing by itself, it requires one or more _plugins_ to perform the actual code transformation. A _preset_ is a collection of plugins relating to a specific set of behaviour. This preset contains the necessary plugins for working with TypeScript code.
- `@babel/preset-env`: a preset to smartly manage the set of plugins needed to transform code for a particular target environment. In our case, we will use it to output code that can be run by node.js.

### babel.config.json

Similar to TypeScript, Babel uses a configuration file to declare how it should operate.

Create a file `babel.config.json` in the project root. Add the following contents:

``` json
{
  "presets": [
    ["@babel/preset-typescript"],
    ["@babel/preset-env", {
      "targets": {
        "node": "current"
      }
    }]
  ]
}
```

Here, we are telling Babel to use the two presets we have installed, and to target the currently installed node.js runtime as the environment.

## Revisiting the compile script

Since the `tsc` command is now relegated to type checking, we need to include Babel in the compilation stage.

Replace the existing compile script in `package.json` with the following:

``` json
"tsc && babel src --out-dir dist --extensions .ts"
```

The babel CLI command should be self explanatory. We need the `--extensions` flag as Babel by default only looks for `.js` files.

Running the compile script:

```
npm run compile
```

We should now see our file `dist/app.js` reappear.

### Babel-compiled file

If you open `dist/app.js`, you should notice that:

- The `"use strict"` has been added by Babel.
- The `const` keyword and arrow function have been preserved, as node.js natively understands this syntax.

## Running the file

As before, we can now run

``` sh
node dist/app.js
```

You should see the message `Hello, World` printed once again to your console.

## A note about `@babel/node`

An alternative to the above is to use another package `@babel/node` to run the src files. This combines the process of building and running the TypeScript files, and removes the need for the `dist/` folder.

We haven't explored this option, since `@babel/node` is [not recommended for production use](https://babeljs.io/docs/en/babel-node#not-meant-for-production-use). We strive to mirror the production environment wherever possible during development to reduce the likelihood of 'production-only' issues, and so we prefer to use the separate compile-run stages as demonstrated above.

---

## Summary

Here is a brief summary of the steps needed to get TypeScript and Babel working together in a node.js project. A full example can be found at [the companion repository on GitHub](https://github.com/studiozeffa/nodejs-typescript-2020).

- Install TypeScript, Babel and the node.js types:

``` sh
npm install -D typescript @types/node @babel/core @babel/cli @babel/preset-typescript @babel/preset-env
```

- Create a `tsconfig.json` file with the following contents:

``` json
{
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["ESNext"],
    "module": "commonjs",
    "outDir": "./dist",
    "noEmit": true,
    "esModuleInterop": true,
  },
  "include": ["./src/**/*"]
}
```

- Create a `babel.config.json` file with the following contents:

``` json
{
  "presets": [
    ["@babel/preset-typescript"],
    ["@babel/preset-env", {
      "targets": {
        "node": "current"
      }
    }]
  ]
}
```

- Add the following npm run script to `package.json`:

``` json
{
  "scripts": {
    "compile": "tsc && babel src --out-dir dist --extensions .ts"
  }
}
```

Now, running the command `npm run compile` will compile any TypeScript-authored files in the `src/` folder to `dist/`. These files can then be run using `node dist/<file>.js`.

---

## Further Reading

- [TypeScript handbook](https://www.typescriptlang.org/docs/handbook/basic-types.html)
- [Introduction to Babel](https://babeljs.io/docs/en/index.html)
- [Example Babel Node server](https://github.com/babel/example-node-server)

---

Thanks for reading! Stay tuned for more articles on using TypeScript with node.js.

Was this helpful? Is there anything I missed? Please let me know in the comments below!
