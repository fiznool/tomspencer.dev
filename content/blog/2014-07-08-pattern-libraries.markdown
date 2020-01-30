+++
title = "Pattern Libraries"
date = "2014-07-08T19:53:24+01:00"
comments = true
categories = [
  "front-end",
  "html",
  "css"
]
description = "I've recently been working on a web app from the ground up. Bootstrap 3 was a good choice to get started - it is super easy to get a site up and running without having to worry too much about styling. In essence, it allowed me to build out some of the requirements with a wireframe-y front-end."

+++

I've recently been working on a web app from the ground up. Bootstrap 3 was a good choice to get started - it is super easy to get a site up and running without having to worry too much about styling. In essence, it allowed me to build out some of the requirements with a wireframe-y front-end.

After a while, the designs for the app were ready and it was time to apply the styles to make the app look good. Before diving in, I chose to create a pattern library first - this article explains why.

<!-- more -->

What is a pattern library? Paul Boag [describes it as](http://boagworld.com/design/pattern-library/) _a collection of user interface design patterns_.

This is a nice, succinct description, but is also open to interpretation. At this point, I started to do some digging and look at other people's pattern libraries, to see what the common focus is.

- [MailChimp's pattern library](https://ux.mailchimp.com/patterns) is a comprehensive example showcasing the components of the MailChimp UI.
- [A List Apart](http://patterns.alistapart.com/) also has a very comprehensive, single-page pattern library.
- [Code for America](http://style.codeforamerica.org/) have a _Website Style Guide_ which is a pattern library in all but name. Again, this is very comprehensive and all on a single page.

It seems that a common problem that a pattern library solves is to unify the design and act as a reference point for a development team. Could a pattern library still be useful for a one-man band, on a relatively smaller project?

It turns out, yes, it is very useful indeed.

In my particular case, I am building an app for a client remotely. I am based in Bristol and the client is in the North of England, and so we do not have the luxury of being in the same room to thrash out design ideas. Instead, we take to [Trello](http://trello.com) and communicate backwards and forwards until things are right.

A pattern library is super useful for this:

- Each component is styled up and published to the pattern library by me.
- The client reviews the library and makes notes in Trello for changes.
- I follow through these changes, and when all sorted, move onto the next UI component.

This agile method of working helps us to iterate quickly on the look and feel of the app before the styles are properly applied. It is a quick way to get feedback and it is quicker at this stage to just change static HTML and CSS than to change JavaScript templates or other logic.

I decided on creating a simple, single-page pattern library that sits alongside my Single Page Application (SPA) as a completely different HTML file. Here is an example of how it looks:

![Screenshot of pattern library showing form components](/img/2014-07-08-pattern-libraries/pattern-library-screenshot.png)

There is another big advantage I have found during the creation of the pattern library. Building each component separately and in isolation from one another helps to promote loose coupling of components within the stylesheet. Using a CSS preprocessor has further helped - by splitting out each section of the pattern library into _modules_, this forces me to create corresponding [LESS](http://lesscss.org) modules. The result is cleaner, more maintainable styles.

Importantly, there isn't much JavaScript involved at this stage - the pattern library is almost exclusively HTML and CSS, with JS only used where necessary (for example, to toggle a menu dropdown).

If you are creating a new website or web application, I'd highly recommend creating a pattern library before applying the final styles to your app, regardless of the size of the project. It helps to reinforce modularity and provides a single place to view all styles, which is very useful as a reference point for later on when applying styles to the app itself.

Further reading:

- An [excellent post from A List Apart](http://alistapart.com/blog/post/getting-started-with-pattern-libraries).
- Good write-up on [Atomic Design](http://bradfrostweb.com/blog/post/atomic-web-design/) by Brad Frost.