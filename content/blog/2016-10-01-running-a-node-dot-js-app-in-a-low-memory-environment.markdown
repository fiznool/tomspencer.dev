+++
title = "Running a node.js app in a low-memory environment"
slug = "running-a-node-dot-js-app-in-a-low-memory-environment"
date = "2016-10-01T11:33:02+01:00"
comments = true
categories = [
  "nodejs",
  "javascript",
  "heroku"
]
description = "Running a node.js app in a low-memory environment requires some additional work to ensure that the v8 garbage collector is aware of the memory ceiling. This post outlines an approach to achieve this."
+++

Running a node.js app in a low-memory environment requires some additional work to ensure that the v8 garbage collector is aware of the memory ceiling. This post outlines an approach to achieve this.

<!-- more -->

## Background

Out of the box, a 64-bit installation of node.js assumes a memory ceiling of [1.5GB per node process](https://github.com/nodejs/node/wiki/Frequently-Asked-Questions). If you are running your node app in a memory constrained environment, e.g. a low-cost VPS server or PaaS instance, it's necessary to inform the v8 runtime that you have a reduced memory ceiling.

In order to achieve this, we must first understand the basics of v8's memory allocation and garbage collector.

## Memory Allocation Basics

In v8, the running application is held in the _Resident Set_. The total amount of memory that the application is consuming is known as the _Resident Set Size_, or _RSS_ for short.

The _Resident Set_ is comprised of three areas:

- The application code
- The stack: which contains primitive types (e.g. numbers, booleans) and references to objects in the heap
- The heap: which contains _reference types_ such as objects, strings, functions and closures.

During the lifetime of your application, it is the _heap_ which will likely consume the most memory, since this is the place where your largest data types are held. It's therefore necessary to concentrate on the heap when targeting memory usage.

### The Heap

The heap contains two main areas:

- New Space: all newly allocated objects are created here first. The new space is often small (typically 1-8 MB), and it is fast to collect garbage here.
- Old Space: any objects which are not garbage collected from New Space eventually end up here. The vast majority of your heap will be consumed by Old Space. Garbage collection is slower here, as the size of Old Space is much larger than New Space, and a different mechanism is employed to actually perform the collection. For this reason, garbage collection is only performed when there is not much room left in Old Space.

You can therefore see that it makes sense to concentrate on the heap's _Old Space_ when targeting memory usage.

### Garbage Collection

v8 collects garbage when an object is no longer reachable from the _root node_. The _root node_ is classed as any global or active local variables.

For example, the following code shows objects which are candidates for garbage collection:

``` js
function dumbCalculator() {
  // This is a local variable.
  // When this function is executed,
  // this object is allocated some memory.
  // After the function has completed,
  // the object is no longer reachable,
  // and so will be garbage collected
  // at some point in the future.
  const variables = {
    first: 1,
    second: 2
  };

  return variables.first + variables.second;
}

// dumbCalculator is a global variable,
// and so for the lifetime of this application,
// it will not be garbage collected.
console.log(dumbCalculator());
```

Garbage collection in v8 is an expensive process, as it is employed via a _stop the world_ mechanism. This literally pauses execution of your application whilst the collector is run. For this reason, v8 tries not to run garbage collection unless it is running out of space.

### More Information

If this has piqued your interest, you can read more about v8's memory management process [here](https://strongloop.com/strongblog/node-js-performance-garbage-collection/).

## Configuration

Armed with this knowledge, we can now begin to play with v8's CLI flags in order to tune memory allocation, and thus alter the limits at which the garbage collector will attempt to free memory. The particular flag we'll be looking at is `max_old_space_size`, which controls the size of the _Old Space_ in the heap, and therefore controls when the garbage collector should kick in to free up memory for the vast majority of the application.

Without further ado, here is a startup script (`startup.sh`) which I use to bootstrap my node apps.

``` sh
#!/bin/bash
#
# This script supports the following environment vars:
#  - WEB_MEMORY: the amount of memory each
#    process is expected to consume, in MB.
#  - NODEJS_V8_ARGS: any additional args to
#    pass to the v8 runtime.

# Replace this with the path to your main startup file.
# The `--color` flag ensures that any log output is
# correctly colorised in all environments, even those
# which inaccurately report as not supporting color.
node_args="app/index.js --color"

if [[ -n "$WEB_MEMORY" ]]; then
  # The WEB_MEMORY environment variable is set.
  # Set the `mem_old_space_size` flag
  # to 4/5 of the available memory.
  # 4/5 has been determined via trial and error
  # to be the optimum value, to try and ensure
  # that v8 uses all of the available memory.
  # It's not an exact science however, and so
  # you may need to play around with this ratio.
  mem_node_old_space=$((($WEB_MEMORY*4)/5))
  node_args="--max_old_space_size=$mem_node_old_space $node_args"
fi

if [[ -n "$NODEJS_V8_ARGS" ]]; then
  # Pass any additional arguments to v8.
  node_args="$NODEJS_V8_ARGS $node_args"
fi

echo "Starting app:"
echo "> node $node_args"

# Start the process using `exec`.
# This ensures that when node exits,
# the exit code is passed up to the
# caller of this script.
exec node $node_args
```

So, if we were running in an environment with 512MB of RAM available, we would run the script as follows:

``` sh
WEB_MEMORY=512 bash startup.sh
```

## Cluster mode

The script above also allows us to support running a node app with [cluster](https://nodejs.org/api/cluster.html). You simply adjust the `WEB_MEMORY` parameter according to the number of clustered processes you expect.

Say for example, you want to run 4 processes in a cluster on your 512MB instance. Run your script with:

``` sh
WEB_MEMORY=128 bash startup.sh
```

Each cluster process will use 1/4 of the system RAM available.

## Heroku

The variable name `WEB_MEMORY` was chosen as this is set automatically for us when running on Heroku, which is my preferred choice for running node apps in production.

`WEB_MEMORY` is created automatically by Heroku according to the following:

- The memory available for the instance (dyno)
- The value of the `WEB_CONCURRENCY` env var (defaults to 1)

We can therefore support clustering by setting the `WEB_CONCURRENCY` variable to a number higher than 1 (e.g. 4). `WEB_MEMORY` will automatically report the correct per-process memory ceiling in this case (e.g. 128 for a `WEB_CONCURRENCY` of 4), and our script will take care of tuning v8 to take advantage of this new memory ceiling.

For example:

``` sh
heroku config:set WEB_CONCURRENCY=4
```

Then, in your `app/index.js`:

``` js
const cluster = require('cluster');
if(cluster.isMaster) {
  // Master process: fork our child processes.
  const numWorkers = process.env.WEB_CONCURRENCY || 1;
  for (var i = 0; i < numWorkers; i += 1) {
    console.log('** Booting new worker **');
    cluster.fork();
  }

  // Respawn any child processes that die
  cluster.on('exit', function(worker, code, signal) {
    console.log('process %s died (%s). restarting...', worker.id, signal || code);
    cluster.fork();
  });

} else {
  // Child process: start app normally.
  // Add your code here!
}
```

## Caveats

The process outlined above is merely a way of informing v8 of your memory requirements, but it's also possible that your application may not be able to run at a small memory footprint. If you use this technique, be aware that if the garbage collector cannot free up any memory when your application reaches the memory ceiling, it will crash with an Out Of Memory error. In this case, you need to evaluate whether you have a _memory leak_, or you simply need a higher memory footprint to run your application.

For more information on hunting down memory leaks, check out [this article](https://blog.risingstack.com/finding-a-memory-leak-in-node-js/).

## Conclusion

Using the `max_old_space_size` v8 flag is a good way of tuning the memory ceiling for your node.js apps. The script above will automatically calculate the optimum value based on the setting of a `WEB_MEMORY` environment variable, which is generated for you on Heroku.
