+++
title = "No REST for the whippet"
date = "2014-09-16T08:37:11+01:00"
comments = true
categories = [
  "talks",
  "apis"
]
description = "Over the past few days I have had the pleasure of standing up and talking about RESTful APIs."
+++

Over the past few days I have had the pleasure of standing up and talking about RESTful APIs.

On Saturday I opened CodeHub's JavaScript workshop with a quick introduction to developing a RESTful API with [Mongoose](http://mongoosejs.com/), [Node](http://nodejs.org/) and [Express](http://expressjs.com/). It was my first attempt at live coding in front of an audience, I apologise to anybody who attended and thought I was going too fast. It's amazing how quickly the time can fly by!

I followed this up with a similar talk on Monday as part of our latest [SWmobile](http://www.meetup.com/swmobile/) meetup, __All About APIs__ in Bath. This time there was no coding - instead I discussed the design of a RESTful API and gave some examples.

[The slides for both talks are available here](http://slides.com/fiznool/no-rest-for-the-whippet), and the [coding tutorial is available on GitHub](https://github.com/fiznool/no-rest-for-the-whippet). For those that enquired, the coding tutorial is split into [git tags](http://git-scm.com/book/en/Git-Basics-Tagging). Each tag represents a stage of the tutorial, and tags come in twos: a `fail` tag and a `pass` tag. The idea is to check out each `fail` tag as you go, which will checkout a set of (failing) test specs, which you run with `npm test`. Have a go at implementing the API and hence ensuring the specs pass (keep running the test suite with `npm test` to check your progress). If you get stuck, checkout the corresponding `pass` tag to see the answer.

So, for example:

``` bash
git clone https://github.com/fiznool/no-rest-for-the-whippet.git
git checkout 01a-retrieve-all-fail
npm test
<failing specs>

... code, code, code ...
npm test
<passing specs>

git checkout 01b-retrieve-all-pass
<check answer>

git checkout 02-retrieve-by-id-fail

etc.
```
It was great to open the discussion about API design and chat to others after the talks about their experiences designing and building APIs. It became apparent that more and more people are thinking about APIs - pragmatic RESTful principles will certainly help, so I was glad to share some of my own experiences in this area.

I'm looking forward to speaking again soon!
