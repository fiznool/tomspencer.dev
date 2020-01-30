---
title: "Adding click-to-copy buttons to a Hugo powered blog"
date: 2018-09-14T13:12:32+01:00
categories: [
  "javascript"
]
description: "Writing code snippets in Hugo is simple and elegant, using a combination of markdown code fences and Hugo's support for syntax highlighting. Recently I've been looking to add a button to automatically copy a code snippet to the clipboard, and I've documented my solution in this post."
---

In [a previous post]({{< relref "2018-08-03-hugo-netlify-syntax-highlighting.md" >}}) I described the process of adding nicely highlighted code snippets to a Hugo-powered blog.

Some of the code snippets added to my own blog are fairly long, and selecting the code manually to copy and paste it into a text editor was proving annoying and error-prone. Inspired by other sites, I wanted to add a 'Copy' button to every snippet - when clicked, the button would take the code and copy it to the user's clipboard. This could then be pasted into a text editor for reuse elsewhere.

After searching the Hugo documentation, it became apparent that there was no built-in feature to support this, so I set out building my own.

## Approach

As described in the previous post, code snippets are authored with markdown code fences. For example:

    ``` jsx
    import React from 'react';
    ```
The above is compiled to the following HTML output by Hugo:

``` html
<div class="highlight">
  <pre style="background-color:#f0f0f0;tab-size:4"><code class="language-jsx" data-lang="jsx"><span style="color:#007020;font-weight:bold">import</span> React from <span style="color:#4070a0">'react'</span>;</code></pre>
</div>
```

To add a copy button to each highlighted code block, we are going to use [progressive enhancement](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement) to perform the following with JavaScript:

- Check whether the browser supports the copy operation
- Search for all highlighted code blocks (specifically, all div elements with the class `highlight`)
- Create a button element and add it beneath the `<pre>` block
- Bind to the button's click event, and when clicked, copy the text inside the code block to the clipboard.

## Code

We're going to add the Copy button using the built-in DOM APIs, without using any external libraries. The final JavaScript code can be found at the bottom of this section.

> Note: since I'm targeting browsers which don't natively support ES2015 and beyond (e.g. IE10), I'll be writing ES5 compliant code: in particular, I'll be using `var` instead of `const` and `function()` instead of `() => `. If you don't care about this (or are using Babel) please feel free to update this code to use the newer syntax.

### Checking for copy support

In the spirit of progressive enhancement, we only want to add a Copy button if the browser supports copying the text from JavaScript.

The actual copy is performed by calling `document.execCommand('copy')`. Thankfully browsers provide a method which allows us to check whether this command is available. So we use this command to perform the check, and end early if it isn't possible:

``` js
if(!document.queryCommandSupported('copy')) {
  return;
}
```

### Selecting the highlighted code blocks

Next, we need to find the highlighted code blocks on the page. As already mentioned, a highlighted code block is contained inside a div with the class `highlight`. (As an aside, non-highlighted code blocks are marked up without the containing div, but I don't care about adding a Copy button to these).

Let's use a DOM API to find all of these containers:

``` js
var highlightBlocks = document.getElementsByClassName('highlight');
```

> Note: I'm using `getElementsByClassName` instead of `querySelectorAll` since we know that we are searching by class name, and the former performs better in [benchmarks](https://www.measurethat.net/Benchmarks/Show/4076).

We can now iterate over each highlighted code block and add our copy button.

Unfortunately, since `getElementsByClassName` returns an 'array-like' structure (an [HTMLCollection](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCollection)) rather than an actual array, the array iterator methods (such as `.forEach()`) aren't available to us here. Instead, we use a good ol' `for` loop to iterate over the elements returned from the DOM:

``` js
for (var i = 0; i < highlightBlocks.length; i++) {
  // highlightBlocks[i] is the `<div class="highlight">` element
}
```

> Note: if we were using ES2015 code, we could take advantage of `Array.from()` to turn the HTMLCollection into an array. We could then use the `forEach()` iterator method as normal.

### Adding the button

For each highlighted code block, we'd like to add an HTML 'Copy' button.

To do this, create a new function which will handle this logic on a particular element:

``` js
function addCopyButton(containerEl) {

}
```

We can then call this function inside our for loop:

``` js
for (var i = 0; i < highlightBlocks.length; i++) {
  addCopyButton(highlightBlocks[i]);
}
```

Let's implement the function. We'll create our button, and add it to the DOM:

``` js
function addCopyButton(containerEl) {
  var copyBtn = document.createElement("button");
  copyBtn.className = "highlight-copy-btn";
  copyBtn.textContent = "Copy";

  containerEl.appendChild(copyBtn);
}
```

When the page loads, each highlighted code block should now contain a button below the code.

### Styling

If you browse to your blog post, any highlighted code block will contain a 'Copy' button, but it doesn't look very nice - it will be rendered after the block, and will use the browser's default style. Let's fix this by adding the following styles to your stylesheet:

``` css
.highlight {
    position: relative;
}
.highlight pre {
    padding-right: 75px;
}
.highlight-copy-btn {
    position: absolute;
    bottom: 7px;
    right: 7px;
    border: 0;
    border-radius: 4px;
    padding: 1px;
    font-size: 0.7em;
    line-height: 1.8;
    color: #fff;
    background-color: #777;
    min-width: 55px;
    text-align: center;
}
.highlight-copy-btn:hover {
    background-color: #666;
}
```

This will produce a grey button with rounded corners, positioned in the bottom right hand side of the code block.

### Responding to the click

The final piece in the puzzle is to copy the code text to the clipboard when the button is clicked.

Add a click handler to the button:

``` js
copyBtn.addEventListener('click', function() {

});
```

When the button is clicked, we need to perform the following to copy the text inside the code block:

- Use the browser APIs to select the code block text
- Use `document.execCommand()` to copy the selected text to the clipboard
- Deselect the text so that the UI doesn't appear to have changed

To do this, we need to create another function, whose responsibility is to select all text inside a given HTML node:

``` js
function selectText(node) {
  var selection = window.getSelection();
  var range = document.createRange();
  range.selectNodeContents(node);
  selection.removeAllRanges();
  selection.addRange(range);
  return selection;
}
```

We can now call this function inside our click handler, passing in the node containing the code (this is the `<pre>` element, accessed from the container element via `.firstElementChild`). Once the text is selected, we copy it, then remove the selection.

``` js
var codeEl = containerEl.firstElementChild;
copyBtn.addEventListener('click', function() {
  var selection = selectText(codeEl);
  document.execCommand('copy');
  selection.removeAllRanges();
});
```

If we now access our blog post, clicking a 'Copy' button inside a highlighted code block should copy the code into your clipboard, allowing you to paste it anywhere else.

### Finishing touches

Whilst functionally complete, we don't currently provide any visual indication to the user that the copy has worked. In addition, we aren't handling any errors as a result of calling `document.execCommand`.

To improve this, we're going to add the following functionality:

- If the copy operation succeeded, change the button text to 'Copied!' for 1s.
- If the copy operation failed, change the button text to 'Failed :\'(' for 1s, and log the error to the console.

Since this is very similar logic, we are going to extract the functionality to _show a message for 1s_ into a separate function:

``` js
function flashCopyMessage(el, msg) {
  el.textContent = msg;
  setTimeout(function() {
    el.textContent = "Copy";
  }, 1000);
}
```

We then change our click handler to contain the following:

``` js
try {
  var selection = selectText(codeEl);
  document.execCommand('copy');
  selection.removeAllRanges();

  flashCopyMessage(copyBtn, 'Copied!')
} catch(e) {
  console && console.log(e);
  flashCopyMessage(copyBtn, 'Failed :\'(')
}
```

### Final code

``` js
(function() {
  'use strict';

  if(!document.queryCommandSupported('copy')) {
    return;
  }

  function flashCopyMessage(el, msg) {
    el.textContent = msg;
    setTimeout(function() {
      el.textContent = "Copy";
    }, 1000);
  }

  function selectText(node) {
    var selection = window.getSelection();
    var range = document.createRange();
    range.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(range);
    return selection;
  }

  function addCopyButton(containerEl) {
    var copyBtn = document.createElement("button");
    copyBtn.className = "highlight-copy-btn";
    copyBtn.textContent = "Copy";

    var codeEl = containerEl.firstElementChild;
    copyBtn.addEventListener('click', function() {
      try {
        var selection = selectText(codeEl);
        document.execCommand('copy');
        selection.removeAllRanges();

        flashCopyMessage(copyBtn, 'Copied!')
      } catch(e) {
        console && console.log(e);
        flashCopyMessage(copyBtn, 'Failed :\'(')
      }
    });

    containerEl.appendChild(copyBtn);
  }

  // Add copy button to code blocks
  var highlightBlocks = document.getElementsByClassName('highlight');
  Array.prototype.forEach.call(highlightBlocks, addCopyButton);
})();
```

## Summary

You don't need to pull in a JavaScript library or framework to add some basic functionality to your site. Instead, leverage the APIs built in to the browser and progressively enhance your site to add extra functionality and improve the user experience.