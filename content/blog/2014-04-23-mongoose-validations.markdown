+++
title = "Mongoose Validations"
date = "2014-04-23T10:03:06+01:00"
comments = true
categories = [
  "mongoose",
  "mongodb",
  "databases",
  "back-end",
  "javascript"
]
description = "Some thoughts on validating data according to a Mongoose Schema."
+++

A few years ago, I was involved in building a product using [Hibernate](http://hibernate.org/orm/). This was the first exposure I had to auto-validation of data models according to their schemas, and I soon learned how powerful and time-saving this was.

One of the great advantages of using [Mongoose](http://mongoosejs.com) over plain MongoDB is its built-in support for data schemas, and hence automatic validation of data when it is persisted. I've jotted down some notes here on how to configure validators in the latest version of Mongoose (3.8).

Mongoose's validators are easy to configure. When defining your schema, you can add extra options to the property that you want to be validated.

``` js
var UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    lowercase: true,
    required: true
  },
  role: {
    type: String,
    enum: ['user',  'admin'],
    default: 'user'
  },
  password: {
    type: String,
    min: 64,
    max: 64
  }
});
```
Notice how we use the object form `{}` of defining a schema property when we want to define validation rules. In the example above, we are asking Mongoose to set up the following rules:

 - `name` field must be a non-empty String.
 - `email` field must be a non-empty lowercase String.
 - `role` field must be one of `user` or `admin`, and defaults to `user` if none is specified.
 - `password` field must be a 64-character long String (e.g. a SHA-256 hash).

The full set of built-in validators can be found in the [Mongoose docs](http://mongoosejs.com/docs/validation.html).

Unlike some other ORMs, Mongoose does not have out-of-the-box support for more complicated validations, such as email addresses. For this, we can perform a [custom validation](http://mongoosejs.com/docs/api.html#schematype_SchemaType-validate) by using the `validate` property. Let's improve the validation on the `email` field above:

``` js
var UserSchema = new Schema({
  email: {
    type: String,
    validate: function(email) {
      return /^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)
    }
  }
});
```

The validate function should return `false` if the field is invalid, or `true` otherwise. The matcher above uses the [HTML5 email validation regex](http://www.w3.org/TR/html-markup/input.email.html) to validate that the input field is a valid email address.

An alternative way to validate the `email` field is as follows:

```
UserSchema.path('email').validate = function(email) {
  return /^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)
};
```

Finally, if you'd like to perform a custom validation involving multple fields, you can hook into the schema's middelware functions, which are run before and after certain actions such as `save` and `remove`. This can be useful if you need to perform conditional validation.

```
UserSchema.pre('save', function() {
  if(this.role === 'admin' && !/@mycompany.com$/.test(this.email)) {
    next(new Error('Admin email is invalid'));
    return;
  }

  next();
});
```

In this case, we hook into the pre-`save` event and check if the user is an admin, they have ended their email address in `@mycompany.com`. If this check fails, `next()` is called with an `Error` object, which informs Mongoose to abort the save. Otherwise, `next()` is called with no arguments, and the save can proceed.

Mongoose makes it really easy to validate your data structures before they are persisted to the database, bringing a sense of order to the otherwise chaotic world of NoSQL. In particular, the built-in validations are a real time-saver, and if you need more customised validations, Mongoose gives you the tools to do so.