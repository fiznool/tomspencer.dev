+++
title = "Setting up a Docker-based MEAN development environment"
date = "2015-07-25T15:15:38+01:00"
comments = true
categories = [
  "javascript",
  "node",
  "mongodb",
  "docker"
]
description = "A workflow for using Docker to separate your development environment for each project."
+++

A common problem for any developer is setting up your development environment for working on multiple projects. By nature, different projects will run different software stacks, and so each piece of the stack needs to be installed and managed. This can get messy when the number of projects increases, and especially when revisiting older projects that were coded against an older version of the stack.

For this reason, it's a good idea to try and segregate your dev environment for each project. In this post, I'm going to outline how I setup a [MEAN][1] development environment using [Docker](http://www.docker.com), completely segregated from my host OS.

  [1]: https://en.wikipedia.org/wiki/MEAN_(software_bundle)

<!-- more -->

## Docker

A good way to segregate dev environments is to spin up a virtual machine (VM) for each project, and install your stack there. When you need to work on the project, simply spin up the VM - no need to upgrade code, your environment will remain the same as how you left it. The excellent [Vagrant](https://www.vagrantup.com/) project makes this easy - Vagrant builds on [VirtualBox](https://www.virtualbox.org/) and automates the creation of a VM via a script file. It's a great solution as it allows you to install any OS inside the VM, and therefore any software stack. So, if you are (for example) a .NET dev, this is the best solution.

If, however, you are targeting Linux as your production environment, there is a better way - using [Docker](http://www.docker.com). The big downside of Vagrant is the requirement for a separate VM per dev environment, which consumes a lot of resources. Docker, however, uses lightweight containers which share the same kernel as the host OS. Thus, for a Linux host, you can create many lightweight containers using Docker, all which are segregated from each other. Just like Vagrant, but using less resources.

I'm primarily a node.js developer, working on an Ubuntu-based machine, targeting deployment to a Linux production environment. Hence, Docker makes a lot of sense to me.

## Installation

To get started, head over to the [Docker documentation pages](http://docs.docker.com) for instructions on how to install Docker on your OS.

The instructions differ depending on your OS:

- If you are rocking Linux already, in any flavour, you can install Docker 'natively'.
- If you are running OS X or Windows, you can't install Docker directly, since it requires a Linux host to create containers. Luckily the [Boot2Docker](http://boot2docker.io/) project was built to specifically fill this void. Boot2Docker is a lightweight (~27MB) VM which was built specifically to run Docker. You run the Boot2Docker VM, and then use Docker from within this VM.

A quick word on Boot2Docker - at first glance, it seems that running a VM negates one of the core benefits that Docker has over Vagrant. However, its important to note that this VM only needs to be run once, and all your projects are then 'containerised' using Docker within this VM. Hence, you only need one VM, compared to a VM per project for Vagrant.

## Dockerfile

A core concept of Docker containers is their configuration via a _Dockerfile_. Briefly, the Dockerfile contains a set of instructions which is used to build an _image_. You then create _containers_ from this image. Starting a container brings up a 'containerised' OS which you can use as your development environment.

Think of an image as a blueprint for a container. Containers are created from images, which can then be run in isolation from each other.

We'll be using a Dockerfile to create an image with the MEAN software stack installed, which we can then create a dev container from, which will allow us to run our project.

## Project source code

To follow along with this tutorial, download the source code from [this GitHub repository](https://github.com/fiznool/mean-docker-example). The code was scaffolded by the [angular-fullstack](https://github.com/DaftMonk/generator-angular-fullstack) generator, with a few small tweaks to be compatible with a Docker-based project.

The most interesting part of the source (for this tutorial) is the Dockerfile:

```
FROM node:0.12

# Install MongoDB
ENV MONGO_VERSION 3.0.4
RUN curl -SL "https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-$MONGO_VERSION.tgz" | tar -xz -C /usr/local --strip-components=1

# Setup DB data volume
VOLUME /data/db

# Install global npm dependencies
RUN npm install -g grunt-cli bower

# Create a new user
RUN useradd -ms /bin/bash dev

# Set the working dir
WORKDIR /home/dev/src

# Start MongoDB and a terminal session on startup
ENV MONGOD_START "mongod --fork --logpath /var/log/mongodb.log --logappend --smallfiles"
ENTRYPOINT ["/bin/sh", "-c", "$MONGOD_START && su dev && /bin/bash"]
```

Briefly, this Dockerfile will generate an image:

- Based on the core node.js 0.12 image
- With MongoDB and grunt installed
- With the `/home/dev/src` folder set as the working directory
- With a newly created non-root user, `dev`
- Which starts the mongod daemon and drops to a bash prompt under the `dev` user when a container created from this image is started.

The `mongod` daemon is started with the following options:

- `--fork`: ensures the daemon runs in the background
- `--logpath`: sets the log path to the correct file
- `--logappend`: ensures that the logfile is appended to on subsequent loading of the container
- `--smallfiles`: reduces the size of the generated MongoDB data files from 3GB to 512MB. This is a good trade-off since we'll only be using the database for development work, and hence saves drive space.

Note that we could wrap these options in a config file, or even install MongoDB via `apt-get`. I've chosen this method due to its simplicity.

The eagle-eyed reader will have noticed that we are using a single Docker image, bundling MongoDB and node together. While this is a good approach for development, so that the dev environment can be completely isolated, it is not recommended to combine your database and software runtime in a single image for _production_ use. Instead, in this case you should separate these out into different containers, and link them together. This is so that each can be individually scaled and monitored as necessary.

## Create and run docker container

Now we can build our image, and create a container which will run the app.

_Note: you may need to run the `docker` commands below with `sudo`._

1. Build the image:

``` sh
docker build -t fiznool/mean-docker-example .
```

This builds the image and tags it as `fiznool/mean-docker-example`.

2. Create the container from the image:

``` sh
docker run -it \
  --net="host" \
  -v `pwd`:/home/dev/src \
  --name mean-docker-example \
  fiznool/mean-docker-example
```

Here is a description of this command:

- `-it` starts the container with a terminal shell, so you can interact with it.
- `--net="host"` attaches the container's networking stack to the host machine, so you can easily access the ports used by the app and DB without needing to expose or map ports.
- ``-v `pwd`:/home/dev/src`` mounts the project's filesystem to the `/home/dev/src` directory in the container, meaning changes made in the host will be reflected automatically in the container.
- `--name mean-docker-example` names the container so it can be referenced later.
- `fiznool/mean-docker-example` creates the container from our built image.

If all has worked correctly, the docker container will have loaded, the `mongo` process will have started, and you'll be dropped to a command prompt within the container. Note that it can take a little while to start up, since MongoDB is initialising its journal on this first load of the container.

3. Inside the docker container, install the app's dependencies:

``` sh
bower install && npm install
```

4. Now you can start the web server:

``` sh
grunt serve
```

You should now be able to browse to `localhost:9000` in a web browser on your host OS to access the web app.

Take a moment to marvel at what we have achieved! The code is running inside a fully-isolated Docker container, with no need to install node.js or MongoDB on your host OS, yet you can access it in a web browser. It's like the code is running on a completely separate machine.

The killer blow comes when you realise that you can load the code in an editor on your host OS - since we have mounted the project's working directory in the container, any changes to the code we make on the host OS are instantly recognised inside the container.

Even better, since the generated project comes with [LiveReload](http://livereload.com/), changes to the source will propagate through to the opened browser, which will be automatically reloaded.

## Restarting the container

You can exit the container at any time by running `exit` at the container's command prompt.

Since we named the container in the `docker run` command above, subsequent loading of the container can be achieved with a more straightforward command:

``` sh
docker start -ia mean-docker-example
```

This once again drops you into the container's command prompt, but preserves any changes that have been made to the container since last boot. As a result, your database files should be persisted across container restarts.

## Summary

Using Docker we can create a fully-isolated development environment, complete with the correct versions of the software runtimes, without needing to install anything extra on the host OS. This stands you in good stead for managing the project in the future, without needing to go through painful upgrades due to software version incompatibility.
