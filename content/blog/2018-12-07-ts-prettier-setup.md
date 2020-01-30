---
title: "VSCode + TypeScript + Prettier = Happy Developer"
date: 2018-12-07T13:12:32+01:00
categories: [
  "typescript",
  "tooling",
  "vscode",
  "nodejs"
]
description: "I've recently found myself becoming more dependant on TypeScript for type safety and autocompletion, and Prettier to format my code consistently. In this post I'll discuss how to set up prettier to work with a TypeScript codebase in VSCode."
---

Developing code in JavaScript is evolving at a rapid pace. Whereas once JavaScript was considered a little scripting language to make web pages a bit more dynamic, it is now (according to StackOverflow) the [most popular language in the world](https://insights.stackoverflow.com/survey/2018/#technology-programming-scripting-and-markup-languages), and is growing year-on-year in popularity.

This explosion in popularity has resulted in a wide ecosystem of tooling to make developing code with JavaScript easier and more efficient. In this post, we're going to be discussing four of these tools, and how to get them set up and working all together:

## The Tools

Here's the lineup:

1. [VSCode](https://code.visualstudio.com), an open source code editor with a focus on JavaScript development.
2. [TypeScript](https://www.typescriptlang.org), a typed superset of JavaScript which allows you to write JavaScript code with static types.
3. [TSLint](https://palantir.github.io/tslint/), a linting tool to ensure that your TypeScript code is written to best practices.
4. [Prettier](https://prettier.io), a formatting tool which automatically rewrites your code to meet a specific coding style.

## Codebase

Before we dive in, we'll set up our codebase. We'll be writing a node.js TypeScript based app, and we'll be taking advantage of the [npm](https://www.npmjs.com) package manager to install our dependencies.

> We'll be targeting node.js version 10 and above. If you don't have the correct version of node.js, use [homebrew](https://brew.sh) or head on over to the [node.js download page](https://nodejs.org/en/download/) to get it installed.

To follow along with this article, create a new npm based project as follows:

``` bash
mkdir ts-prettier-example
cd ts-prettier-example
npm init -y
```

You should now have a folder named `ts-prettier-example/` which contains a single file `package.json`.

Now that we have our codebase initialised, let's begin to explore these tools in more depth.

> Note: whilst this post assumes we'll be building a node.js app, you can also apply these concepts to work with a browser-based app too. With the recent enhancements in TypeScript, it's now possible (and preferred) to use TypeScript as a static type checker only, and output JavaScript which in turn is transpiled by Babel.

## VSCode

Much has been written about [VSCode](https://code.visualstudio.com), an open source code editor from Microsoft. A relative newcomer to the code editor scene, VSCode has exploded in popularity amongst web developers, providing a similar interface to other much-loved development environments (Sublime Text, Atom) with a focus on common use cases (such as working with source control) in an open source package.

If you are a web developer and you haven't yet tried VSCode, it's worth spending some time to evaluate whether it will fit your needs. The [official docs](https://code.visualstudio.com/docs) provide an excellent 'Getting Started' guide.

The instructions in the rest of this post assume that you are using VSCode as your editor.

## TypeScript

[TypeScript](https://www.typescriptlang.org) is a typed superset of JavaScript. It allows you to write JavaScript code with static types.

There are many benefits to this approach:

- catch bugs sooner (at compile-time, rather than when your code is run)
- provide hints to your editor, allowing for autocompletion of code as you type

TypeScript is a very useful language to author code, but it must be compiled to plain JavaScript before the code can be run in the browser or on the server. As a result, TypeScript must be compiled to JavaScript before code can be run.

VSCode supports TypeScript out of the box, with no further configuration needed. We will however be installing our own version of TypeScript, to ensure that the other tools in this post work correctly.

In the terminal, make sure you are inside the `ts-prettier-example` repository, and run the command:

``` sh
# Install TypeScript locally
npm install -D typescript

# Initialise a TypeScript config file
node_modules/.bin/tsc --init \
  --target es2018 \
  --module commonjs \
  --sourceMap \
  --rootDir src \
  --outDir lib \
  --strict \
  --esModuleInterop \
  --resolveJsonModule
```

After running these commands, you will have a new `tsconfig.json` file in your codebase, which is used by TypeScript when your code is compiled to plain JavaScript.

Here, we are setting the following configuration:

- `target`: this controls the version of JavaScript that is emitted. node v10 has [full support for ES2018](https://node.green/#ES2018) so we set this value to `es2018`.
- `module`: emits CommonJS modules, which are natively supported by node.
- `sourceMap`: emits source maps, which allows debuggers to map the resulting JavaScript file back to its TypeScript source counterpart.
- `rootDir`: defines the folder where the TypeScript source files will live.
- `outDir`: defines the folder where the resulting JavaScript files will be compiled to.
- `strict`: sets 'strict mode', ensuring that common gotchas with TypeScript are prevented.
- `esModuleInterop`: allows you to use standard ES6-style import/export in the code, which will be converted to CommonJS during compilation.
- `resolveJsonModule`: allows you to import json files as well as TypeScript ones.

For more details [see the official documentation](https://www.typescriptlang.org/docs/handbook/compiler-options.html).

### Testing our configuration

Let's test that the TypeScript config is working.

- Create a new folder `src/` and add a new file `src/index.ts`.
- Add the following code to `index.ts`:

``` ts
console.log("Hello, World");
```

- In the terminal, run the command:

``` sh
node_modules/.bin/tsc
```

You should see a new folder `lib/` generated, with two files: `index.js` and `index.js.map`.

Run the file with

``` sh
node lib/index.js
```

and you should see `Hello, World` printed to the terminal.

### Configuring VSCode to use local TypeScript

By default, VSCode will use the version of TypeScript that it ships with. We can tell it to use the workspace-local version of TypeScript that we've just installed:

- Create a new folder `.vscode/` and add a file `.vscode/settings.json`.
- Add the following to this JSON file:

``` json
{
  "typescript.tsdk": "./node_modules/typescript/lib"
}
```
- Open your `index.ts` file in VSCode. In the statusbar at the bottom of the screen, the TypeScript version number will be reported. Click on it, and ensure that the 'Use Workspace Version' option is checked ([see here](https://code.visualstudio.com/docs/languages/typescript#_using-the-workspace-version-of-typescript) for more details).

## TSLint

As TypeScript is a statically typed language, it is very good at catching errors in your code. There are some issues however that TypeScript itself cannot catch, such as ensuring your code conforms to best practices regarding readability and maintainability.

This is the gap that [TSLint](https://palantir.github.io/tslint/) attempts to fill. TSLint is a linting tool for TypeScript - it analyses your code as you type for common readability and maintainability issues, and suggests areas for improvement.

To install and configure TSLint:

- [Install the VSCode extension](https://marketplace.visualstudio.com/items?itemName=eg2.tslint)
- Install tslint locally by running the command:

``` sh
npm install -D tslint
```

- Create a new file `tslint.json` in the project root and add the following contents:

``` json
{
  "extends": [
    "tslint:recommended"
  ],
  "rules": {
    "quotemark": [true, "single"]
  }
}
```

The tslint configuration file will pick up any `rules` you set and use them to show potential issues in your code. [A full list of rules can be found here](https://palantir.github.io/tslint/rules/) - I like to enforce single quotes instead of double quotes, but if you prefer double quotes then you can safely remove the `quotemark` rule.

If you open up the file `src/index.ts` you should now see that VSCode is reporting three errors, all stemming from TSLint. These are:

1. The file does not have a new line at the end of it
2. The code uses `console.log()`
3. Quotes are using double quotemark `"` instead of single `'`

Let's fix the first error - add a newline to the end of the file.

For the second error, TSLint is complaining that we are using `console.log()`, but in this case it is a valid use of the function. We are going to inform TSLint that this is correct by disabling the rule via a [rule flag](https://palantir.github.io/tslint/usage/rule-flags/). In particular, we are going to use the `// tslint:disable-next-line:rule1` form to disable the warning. Update your code to the following (making sure to preserve the newline at the end of the file):

``` ts
// tslint:disable-next-line:no-console
console.log("Hello, World");

```

At this point, we should have one TSLint error, reporting the use of double quotes instead of single quotes. Instead of fixing this manually, we are going to delegate this to Prettier.

## Prettier

The next tool that we'll be setting up is [Prettier](https://prettier.io), a formatting tool which automatically rewrites your code to meet a specific coding style.

To install and configure Prettier:

- [Install the VSCode extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- Install prettier locally by running the command:

``` sh
npm install -D prettier
```

- Create a new file `.prettierrc.json` (note the leading `.`) in the root of your project and add the following contents:

``` json
{
  "singleQuote": true,
  "trailingComma": "es5"
}
```

- Configure VSCode to automatically format your code when you save:
  - Open the file `.vscode/settings.json`
  - Add the following entries:

``` json
{
  "editor.formatOnSave": true,
  "javascript.format.enable": false
}
```

To check that prettier is set up correctly, open the file `src/index.ts` and save the file. You should see that the double quote marks are converted to single quotes.

### Conflicts with tslint

Now that we have prettier formatting our code automatically, we need to make TSLint aware of prettier, otherwise changes made by prettier may conflict with the TSLint rules. It would also be nice if any prettier warnings were surfaced as TSLint errors, so we can see them in our editor.

We can achieve this by installing two new packages:

``` sh
npm install -D tslint-config-prettier   # Makes TSLint accept any rules that prettier enforces
npm install -D tslint-plugin-prettier   # Show prettier warnings as TSLint errors in the editor
```

Now that these packages are installed, make TSLint aware of them by changing the `tslint.json` configuration to the following:

``` json
{
  "extends": [
    "tslint:recommended",
    "tslint-config-prettier",
    "tslint-plugin-prettier"
  ],
  "rules": {
    "prettier": true,
    "quotemark": [true, "single"]
  }
}
```

These changes will ensure that prettier and TSLint play together nicely.

## Summary

We've set up our editor with the following tools:

- TypeScript, to add static typing and autocomplete to our code
- TSLint, to highlight issues with code readability and maintenance
- Prettier, to automatically format our code in a standard way on save

Enjoy the increased productivity and the feeling of automation that improves your daily life.