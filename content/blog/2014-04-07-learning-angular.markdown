+++
title = "Learning Angular"
date = "2014-04-07T17:32:52+01:00"
comments = true
categories = ["angularjs", "javascript", "front-end"]
description = "The last week has been an intense period of training. I've taken up the offer of a project to be built using AngularJS, and so my head has been down in tutorials, books and online docs. Here are some of the resources I found useful."
+++

The last week has been an intense period of training. I've taken up the offer of a project to be built using AngularJS, and so my head has been down in tutorials, books and online docs.

## JavaScript

Before you start learning Angular, you need to know JavaScript, and know it well. Get started with JavaScript with [Eloquent JavaScript](http://eloquentjavascript.net/) and buy [The Good Parts](http://shop.oreilly.com/product/9780596517748.do).

## Thinkster

Entitled [A Better Way to Learn AngularJS](http://www.thinkster.io/angularjs/GtaQ0oMGIl/a-better-way-to-learn-angularjs), the Thinkster course is excellent. It takes you through a series of videos, articles and documentation links to give you a very good, broad overview of Angular.

The course recommends that you purchase the [O'Reilly AngularJS book](http://shop.oreilly.com/product/0636920028055.do). You should definitely do this, as it is an excellent introduction to Angular, written by a member of the AngularJS team. But, unless you really like the smell of new books, I'd recommend you buy [the eBook](http://www.amazon.co.uk/AngularJS-Brad-Green-ebook/dp/B00C9MYA7G/ref=tmm_kin_title_0). As a rule, I like buying print books for reference (I refer to [The Good Parts](http://shop.oreilly.com/product/9780596517748.do) on an almost daily basis) but since Angular is moving so fast, the book is in danger of becoming obsolete soon. I'd save your money, and buy the eBook instead.

## AngularJS Developer Guide

Once you have taken the Thinkster course, and read the AngularJS book, read the [AngularJS documentation](https://docs.angularjs.org/guide). It isn't perfect, but it will help to understand and solidify some concepts.

## Testing

A _big_ advantage of using Angular is built-in support for [unit testing](http://en.wikipedia.org/wiki/Unit_testing) and [integration/end to end testing](http://en.wikipedia.org/wiki/Integration_testing). At a basic level:

- Unit testing tests your controllers in isolation from each other. Controller dependencies are mocked.
- Integration (_End to End_ in Angular-speak) testing runs the web app and automates the use of the GUI. You write tests to interact with the DOM, which are then run with [protractor](https://github.com/angular/protractor).

If you are a beginner to unit testing, read [this Smashing Magazine article](http://www.smashingmagazine.com/2012/06/27/introduction-to-javascript-unit-testing/).

The Thinkster guide above is a little out of date, and doesn't include much information on protractor, or unit testing in general. I recommend the following resources instead:

- [Jasmine](http://jasmine.github.io/2.0/introduction.html) is the testing framework used by Angular.
- Official Angular docs on [unit testing](https://docs.angularjs.org/guide/unit-testing) and [E2E testing](https://docs.angularjs.org/guide/e2e-testing).

## PhoneCat Tutorial

Once you have read the things above, complete the [PhoneCat tutorial](https://github.com/angular/angular-phonecat). It puts all of the concepts above into practice. __It's really important you take this tutorial!!__ It is the icing on the cake, the stage that takes it from swimming around in your head, into your text editor and onto your browser. Don't miss this stage out, it will take a few hours but it is worth it.

## Extra Resources

By now, you should know enough to get started on building your app. The following resources may also help:

- [Advanced Testing and Debugging in AngularJS](http://www.yearofmoo.com/2013/09/advanced-testing-and-debugging-in-angularjs.html).
- [AngularUI toolkit](http://angular-ui.github.io/) - contains extra goodies that you will find useful.
- [Recipes with AngularJS](http://fdietz.github.io/recipes-with-angular-js/) - a set of common problems and how to solve them in Angular.
- [Angular Modules](http://ngmodules.org/) - a directory of commonly used Angular plugins and modules.
- [ng-newsletter](http://www.ng-newsletter.com/) - a weekly newsletter delivered to your inbox with lots of new Angular-based articles.

## Good Luck!

It took me about a week to follow through the tutorials listed above, and by the end of the week I felt confident that I could make a start on my first Angular app. Good luck!