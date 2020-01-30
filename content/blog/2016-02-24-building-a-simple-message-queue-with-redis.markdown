+++
title = "Building a simple message queue with Redis"
date = "2016-02-24T08:41:25+00:00"
comments = true
categories = [
  "redis",
  "nodejs"
]
description = "This post explores how a simple message queue can be built to support delayed messages, using Redis."
+++

There are lots of options when it comes to choosing a message queue for your application. The guys at [queues.io](http://queues.io) have a very comprehensive summary of the options.

There are some times, however, where you don't need something as heavyweight as RabbitMQ or Amazon SQS. A popular alternative is to build a queue using Redis. A simple implementation will use `LPUSH` to push messages onto the queue, and `BRPOP` pull them off, respectively. Whilst this is useful for a basic FIFO queue, it does not support delayed messages - pushing a message to be pulled from the queue at a later date.

This post explores how a simple message queue can be built to support delayed messages, using Redis.

<!-- more -->

We'll be using the following Redis data structures for our queue:

- A _hash_ to store the message with a unique message ID.
- A _sorted set_ to store the message ID with a timestamp, or message due date.

## Adding a message

To add a message, we first need to generate a unique ID for the message. You'll likely already know how to generate an ID in your programming language of choice - for example, if you are using node.js, you could use [node-uuid](https://www.npmjs.com/package/node-uuid) or [bson-objectid](https://www.npmjs.com/package/bson-objectid).

Once you have this unique ID, store it with your (stringified) message in the hash with `HSET`.

``` sh
redis> HSET messages <id> <message>
```

We should then insert the message ID with the message due date timestamp into the sorted set:

``` sh
redis> ZADD due <due_timestamp> <id>
```

## Receiving messages

Now that we have our messages being produced, we need a consumer.

To receive a message, we need to poll the sorted set to see if any messages are past their due date. We do this with a periodic `ZRANGEBYSCORE` call, along with the current timestamp.

``` sh
redis> ZRANGEBYSCORE due -inf <current_timestamp> LIMIT 0 1
```

If this returns a message ID, we know that this message is ready for consumption. We lookup the message from the hash:

``` sh
redis> HGET messages <message_id>
```

And finally, we remove the message from the sorted set and the hash, to ensure it won't be received again.

``` sh
redis> ZREM due <message_id>
redis> HDEL messages <message_id>
```

## Going further

Note that this is a very simple queue implementation, and is sufficient for basic purposes. For a production application, however, it's likely that you'll need a way to retry messages if a consumer crashes before the message has been processed, and perhaps some way of determining the total number of messages in the queue.

If you are using node.js, I would recommend taking a look at [Redis Simple Message Queue](https://www.npmjs.com/package/rsmq). This implements the basic algorithm described above, and adds extra features such as message retrying.
