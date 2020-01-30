+++
title = "Using Mongoose"
date = "2014-04-21T14:18:01+01:00"
comments = true
categories = [
  "mongoose",
  "mongodb",
  "databases",
  "back-end"
]
description = "I've been learning about MongoDB recently, and here are a few thoughts on my findings."
+++

One of the things I really like about [MongoDB](http://mongodb.org) is its flexibility. Data is _schemaless_, and so you can insert pretty much any JSON object you like into a MongoDB collection. Having not spent too much time with so-called _NoSQL_ databases, this takes a little bit of getting used to.

One area which can cause problems, however, is if your application relies on data being structured in a certain way. For many apps, this is the case - for example, you may wish to loop through an array of items, displaying them in a list, expecting each item to have certain fields to be rendered in the same layout. For these situations, [Mongoose](http://mongoosejs.com) is a big help. Mongoose adds (amongst other things) [Schemas](http://mongoosejs.com/docs/guide.html) for your server models, which makes it easy to enforce data consistency.

But, wait a minute? Isn't the benefit of a NoSQL database the flexibility of schemaless data models, which Mongoose has just introduced? Aren't we now moving to a SQL-like rigid structure? Sort of. Mongoose is quite flexible, and you don't _have_ to use schemas if you don't want to. So, you can mix and match - use schemas where you want to enforce data consistency and validation, and use a [Mixed SchemaType](http://mongoosejs.com/docs/schematypes.html#mixed) when you don't want or care.

I've been using Mongoose for the past few days, and I am enjoying it. The SQL part of my brain is thankful for schemas but by using the Mixed Schema type I also get the flexibility of a document store. So far, so good.