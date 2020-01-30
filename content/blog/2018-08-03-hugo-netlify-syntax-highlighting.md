---
title: "Deploying a Hugo-powered site to Netlify with source code syntax highlighting"
date: 2018-08-03T13:12:32+01:00
categories: [
  "writing"
]
description: "Hugo makes it really easy to add syntax highlighting to your code snippets. In this post I'll discuss how to enable this feature, and how to configure Netlify to build your site with nicely highlighted code."
---

My hugo blog is based on the awesome [Goa](https://github.com/shenoybr/hugo-goa) theme, but the default syntax highlighting (powered by [HighlightJS](https://highlightjs.org)) was not working very well with JSX code. Since much of my work is with React these days, code snippets on this blog are likely to use JSX, and so this was becoming a bit of an issue. Added to this is the general overhead of the site requesting extra CSS and JavaScript files to support this feature.

After a bit of research I realised that Hugo natively supports [source code syntax highlighting](https://gohugo.io/content-management/syntax-highlighting/) via a tool known as _Chroma_. One of the biggest advantages with this approach is that the higlighting happens at compile-time: Hugo will turn your code fences into a tree of static HTML - essentially, a set of nested `<span>`s, each containing inline styles to beautify the code snippet. This is a very appealing approach, and fits in well with the concept of a static site generator, where the output is the HTML and CSS/styles that the end user will view.

Supporting Chroma is as simple as adding the following to your `config.toml` file:

``` toml
pygmentsCodeFences = true   # Enable triple backtick 'code fence' markdown
pygmentsUseClasses = false  # Add inline styles, no need to compile extra CSS
```

You can now add code using the triple backtick 'code fence' markdown syntax, as follows:

    ``` jsx
    import React from 'react';

    const App = () => (
      <div class="app"></div>
    );

    export default App;
    ```

The text after the triple backtick governs the code language, which is used to determine the keywords that should be highlighted. In this case, I'm using the `jsx` language to tell the syntax highlighter to treat the code as JavaScript with JSX - find all of the supported languages on the [hugo docs page](https://gohugo.io/content-management/syntax-highlighting/#list-of-chroma-highlighting-languages).

The markdown above will produce the following output:

``` jsx
import React from 'react';

const App = () => (
  <div class="app"></div>
);

export default App;
```

You can also customise the colour scheme used for highlighting the keywords by adding the following to your `config.toml`:

``` toml
pygmentsStyle = "friendly"  # Change this to the theme you want
```

A full list of supported themes can [be found here](https://xyproto.github.io/splash/docs/all.html).

## Deploying to Netlify

If you have set up your site to be automatically built and deployed to Netlify as [outlined on the Hugo site](https://gohugo.io/hosting-and-deployment/hosting-on-netlify/), you may find that your freshly deployed site has not correctly parsed code blocks into the necessary HTML, instead outputting the text as-is.

The reason for this is that Netlify (by default) uses a very old version of Hugo to compile your code (v0.17) which does not support these code blocks. To remedy:

- Log in to the Netlify dashboard and select your site
- Go to Settings > Build & deploy > Continuous Deployment > Build environment variables
- Add a build environment variable in the Netlify site settings - name it `HUGO_VERSION` and set it to the latest version of Hugo (at the time of writing, this is 0.49).

The next time you push a new commit, your site should be built and deployed correctly by Netlify.

## Summary

Hugo makes syntax highlighting your code snippets a breeze!