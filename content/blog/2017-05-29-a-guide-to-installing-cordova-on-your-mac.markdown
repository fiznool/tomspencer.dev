+++
title = "A guide to installing Cordova on your Mac"
date = "2017-05-29T09:40:59+01:00"
comments = true
categories = [
  "mobile",
  "cordova"
]
description = "Cordova is a popular framework for building hybrid mobile applications. This post provides a complete guide on how to install it on a Mac running OS X or macOS, so you can deploy a Cordova-based app to your iOS or Android device."
+++

[Cordova](https://cordova.apache.org/) is a popular framework for building hybrid mobile applications. This post provides a complete guide on how to install it on a Mac running OS X or macOS, so you can deploy a Cordova-based app to your iOS or Android device.

Since Cordova is the technology that underpins other frameworks such as [Ionic](https://ionicframework.com/), this post also acts as an installation guide for these projects.

<!-- more -->

_This guide was last updated on 29th May 2017. If any of the steps below are out of date, please let me know via the comments section below._

## Prerequisites

To follow through this guide you'll need:

- A Mac running OS X (Mavericks or above) or macOS.
- An iOS or Android device, plus a USB cable to connect it to your Mac.

In addition to the above, the following software is recommended (but not essential):

- [iTerm2](http://iterm2.com) - a terminal replacement app.

_Running Windows? You can still install Cordova and deploy to an Android device, the instructions can be found [in this post]({{< relref "2017-05-30-a-guide-to-installing-cordova-on-windows-10.markdown" >}})._

## Steps

Briefly, these are steps you need to take:

1. Ensure you have a valid Apple ID.
2. Install and configure Xcode
3. Install and configure the Android SDK
4. Install the Cordova CLI and create a sample app
5. Deploy to the emulators
6. Deploy to your device

### 1) Apple ID

You need an Apple ID to deploy to iOS devices.

- If you don't have an Apple ID, you can [get one here](https://id.apple.com).
- If you have one but you've forgotten the password, you can [reset it here](https://iforgot.apple.com/password/verify/appleid).

_Tip: Even if you already have an Apple ID, consider using a separate Apple ID for development purposes. It will help to separate work and personal life._

### 2) Xcode

Xcode is the IDE used on a Mac to create and publish iOS apps. It also comes with a set of command-line tools which are essential for deploying Cordova apps.

#### Install

The easiest way to download Xcode is through the Mac App Store:

- Open the Mac App Store.
- Search for `Xcode`.
- Install.

Xcode is a hefty download, weighing in at over 4GB, so you might want to skip to the next section (installing the Android SDK) while it is downloading, and come back here later.

#### Command Line Tools

Once Xcode has installed itself, you should open a Terminal window. Type the following:

``` bash
xcode-select --install
```

If the command line tools are already installed, a message will be shown in the terminal: `xcode-select: error: command line tools are already installed`. Otherwise, a pop-up window will appear asking if you want to install the command line tools, click `Yes` and wait for these to download and install.

#### Configure

Open Xcode. You should see the _Welcome to Xcode_ screen.

In the top menu, press `Xcode -> Preferences`.

<img src="/img/2017-05-29-a-guide-to-installing-cordova-on-your-mac/xcode-welcome.png" alt="Xcode Welcome screen" />

In the _Accounts_ tab, press `+ -> Add Apple ID`.

<img src="/img/2017-05-29-a-guide-to-installing-cordova-on-your-mac/xcode-add-account.png" alt="Xcode Add Account screen" />

Sign in with your Apple ID. When complete, your account will appear in the list. You can now close the Preferences pane.

#### Next Step

We're done with iOS for the time being. In the next section, we'll set up the Android SDK.

### 3) Android SDK

The Android SDK is used to build Android apps. There are a few steps involved to get the Android SDK:

- Install Java
- Install the Android command line tools
- Install the Android SDK

We'll cover these steps now.

#### Installing Java

- Go to the [Java download page](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html).
- After accepting the license agreement, choose the _Mac OS X_ file under the _Java SE Development Kit_ section to begin the download.

<img src="/img/2017-05-29-a-guide-to-installing-cordova-on-your-mac/java-download-mac.png" alt="Java download page" style="max-width: 500px" />

- Once the `.dmg` file has downloaded, open it.
- Double click on the package installer icon. The Java installer should appear - click through to install Java.

To check that Java was installed correctly, open a terminal window and type `java -version`. You should see the Java version printed to the terminal.

#### Installing the Android command line tools

- Go to the [Android SDK Command Line tools installation page](https://developer.android.com/studio/index.html#command-tools).
- Click on the zip file for the Mac platform to download the tools to your Mac.

<img src="/img/2017-05-29-a-guide-to-installing-cordova-on-your-mac/android-sdktools-download-mac.png" alt="Android SDK tools download" />

- When it has finished downloading, open the zip file to extract the contents.
- Create a new folder in your home directory named `android`.
- Move the `tools` folder from the zip into the new `android` folder.

When you are done, you should have a new folder at `/Users/<username>/android/tools`.

#### Installing the SDK

We'll now use the Command Line tools to install the SDK and other necessary tools.

- Open a terminal window.
- Type the following commands:

``` bash
cd ~/android/tools/bin
./sdkmanager "build-tools;25.0.3" "emulator" "platforms;android-25" "platform-tools" "system-images;android-25;google_apis;x86" --verbose
./avdmanager -v create avd -n x86 -k "system-images;android-25;google_apis;x86" -g "google_apis"
```

Make sure to accept the license agreement. Once these commands have completed, your `android` folder should contain a whole bunch of new directories, including:

- `build-tools` - these are the tools used by Cordova to build your Android app.
- `emulator` - this is the Android emulator that will be used later to preview the app on your Mac.
- `platforms` - this is the Android SDK, separated by platform version. These correspond to the releases of Android: Nougat, Marshmallow, etc. The command above has downloaded the most recent platform version (25).
- `platform-tools` - more tools that are used to administer Android devices on the command line.
- `system-images` - these are images used by the emulator.

#### Installing Gradle

Gradle is a tool that is required by the Android SDK to build Android apps. It used to be included with the Android SDK, but now it must be downloaded and configured manually.

- Go to the [gradle releases page](https://gradle.org/releases).
- Find the `binary-only` version of the latest release and select it to begin the download.

<img src="/img/2017-05-29-a-guide-to-installing-cordova-on-your-mac/gradle-download.png" alt="Gradle download" />

- When the download has finished, unzip the file.
- Rename the resulting folder to just `gradle`.
- Move this `gradle` folder to the `android` folder that was created above.

#### Configuration

In order to make this dizzying array of tools available to Cordova, and to us when using the terminal, we need to set some environment variables. To do this:

- In a terminal window, type `nano ~/.bash_profile`.
- Add the following lines to the file:

```
export ANDROID_HOME=$HOME/android
export PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/gradle/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools/bin
```

- Type `Ctrl-X` and then `y` and `Enter` to save the file.
- Back in the terminal, type `source ~/.bash_profile` to setup the environment variables.

_Note:_ If you are using a different shell (such as zsh) you will need to add the environment variables above to the correct shell file. If you don't know what shell you are using, ignore this (you'll be using bash).

To test that all of this has worked, try typing the following into the terminal window:

```
adb version
gradle -v
```

After running each command, you should see the respective tool print its version number. If any of these commands results in a `command not found`, the environment has not yet been setup correctly. Please double check that the above steps have been carried out before continuing.

#### Next Step

If you have got this far, congratulations! We have now set up the iOS and Android SDKs. The next step is to install the Cordova CLI and create a sample app.

### 4) Install the Cordova CLI

#### Install node.js

The Cordova CLI requires node.js. If you have already installed node, you can skip to the next section.

Otherwise:

- Go to the [node.js download page](https://nodejs.org/en/download).
- Click on the 'Macintosh Installer' box to download the LTS version of node for Mac.
- When the file has downloaded, click on it to run the installer.

#### Set npm permissions

If you have already used npm, you might have found that you can't install packages without prefixing your command with `sudo`. To fix this, it's recommended to [follow these instructions](https://docs.npmjs.com/getting-started/fixing-npm-permissions).

#### Install Cordova

- In a terminal window, type `npm install -g cordova`.

When this finished, you should be able to run the command `cordova -v` which should print the cordova version to the terminal.

#### Install iOS deployment tools

To deploy to the iOS simulator and devices from the terminal, we should also install two more packages:

```
npm install -g ios-sim ios-deploy
```

We'll use these tools later.

#### Create a sample app

We'll now create a sample app which we can deploy to the simulator and device.

Open a terminal and change to a folder where you are happy for code to live. The commands below will generate a new cordova project in a subdirectory of whichever folder you are currently in.

For example, if you have code living in folders at `/Users/<username>/Code`, change to this directory before running the commands below.

Once you are in the correct directory, run the following:

``` bash
cordova create cordova-hello-world
cd cordova-hello-world
cordova platform add ios android
cordova build
```

These commands will create a new cordova project, add the iOS and Android platforms, and build the respective files for deployment to iOS and Android.

Before continuing, please ensure that the commands above all worked correctly, with no errors. If there were any errors, you'll need to go back and check that the iOS and Android SDKs were both installed correctly, and that you've set the environment variables correctly.

_Note_: if you see the following error: `xcode-select: error: tool 'xcodebuild' requires Xcode ...` then run the following commands to try again:

``` bash
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
cordova build
```

### 5) Deploy the sample app to the emulators

#### iOS Simulator

To deploy the app to the iOS simulator, type:

``` bash
cordova emulate ios
```

The iOS simulator should automatically launch. When it has finished initialising, the Cordova Hello World app should be displayed:

<img src="/img/2017-05-29-a-guide-to-installing-cordova-on-your-mac/iphone-simulator.png" alt="iPhone simulator running Cordova app" style="max-width: 500px" />

#### Android emulator

To deploy the app to the Android emulator, type:

``` bash
cordova emulate android
```

The emulator should launch and display the app:

<img src="/img/2017-05-29-a-guide-to-installing-cordova-on-your-mac/android-emulator.png" alt="Android emulator running Cordova app" style="max-width: 500px" />

_Note_: If you see an error in the terminal such as `Failed to sync vcpu reg` when the emulator is starting, this means that the emulator cannot start its virtual machine. To solve this problem, make sure you aren't running any other virtual machines on your Mac. This includes Virtualbox (or Vagrant), VMWare and Docker. Close all of these applications before trying again.

### 6) Deploy the sample app to your device

The final step in the process is to deploy the app to your device(s).

#### Change Bundle ID

Before the app is deployed, the _Bundle ID_ of the app needs to be changed to something unique. A _Bundle ID_ is used to uniquely identify an app. When building for an iOS device, Xcode will verify that the bundle ID has not been used by any other iOS app.

The convention for a Bundle ID is to use a reverse domain identifier, followed by the name of the app. For example, using a domain `tomspencer.dev` and an app name of `Hello Cordova`, the Bundle ID would be `dev.tomspencer.hellocordova`. If you own a domain, you can use the above convention, otherwise use a random string of alphanumeric characters.

Once you have chosen your Bundle ID, update it by editing the file `config.xml` in the project root directory. You are looking for the section that reads `widget id="io.cordova.hellocordova"` - change `io.cordova.hellocordova` to your new Bundle ID.

When you change the Bundle ID, you need to regenerate the platform files. Do this by running the following commands from the project root directory in the terminal:

``` bash
cordova platform rm ios android
cordova platform add ios android
```

#### iOS: first launch

If you have an iPhone or iPad running iOS 10+, you can deploy the app to your device. You'll need a lightning cable to connect your iOS device to your Mac.

Before starting with this section, ensure that your device is running the latest version of iOS. You can check this by using the _Settings_ app on the device. Choose _General_ -> _Software Update_ to check if there is an update available. If there is, install it before continuing.

The first time you deploy the app, you'll need to use Xcode. Carry out the following steps:

- Connect your iOS device to your Mac with a lightning cable. (iTunes might appear - you can safely close it.)
- If this is the first time you've connected your device to your Mac, you may see a message on your device, _Trust This Computer?_ Tap `Trust`.

<img src="/img/2017-05-29-a-guide-to-installing-cordova-on-your-mac/iphone-trust-this-computer.jpg" alt="iPhone: trust this computer alert" style="max-width: 300px" />

- Open a terminal window and change to your project's root directory.
- Type the following:

```
cordova build ios
open platforms/ios/HelloCordova.xcodeproj
```

- In the resulting Xcode window, ensure the Project navigator pane is displayed by clicking the folder icon in the top left hand corner.

<img src="/img/2017-05-29-a-guide-to-installing-cordova-on-your-mac/xcode-folder-icon.png" alt="Xcode project navigator button"  style="max-width: 250px"/>

- Click on the _HelloCordova_ project. The middle pane will reveal the Signing section. You should see a message `Signing for "HelloCordova" requires a development team`.

<img src="/img/2017-05-29-a-guide-to-installing-cordova-on-your-mac/xcode-project.png" alt="Xcode signing section" />

- In the _Signing_ section, from the _Team_ dropdown, choose the entry that resembles _{Your Name} (Personal Team)_. Xcode will 'repair' and 'provision' your app to allow it to be deployed to your device.

You should now see the text `iPhone Developer` next to the _Signing Certificate_ entry.

_Note_: if you see the following error: `Failed to create provisioning profile. The app ID cannot be registered to your development team. Change your bundle identifier to a unique string to try again.` - this means that the Bundle ID that you set at the start of this section was not unique. Close Xcode, set a new Bundle ID and run through this section again.

Now that the app has been provisioned, it can be deployed to your device.

- Make sure your iOS device is unlocked.
- From the _active scheme_ menu (to the right of the 'play' button in the top left hand corner), change the scheme from _iPhone 7 Plus_ to your iOS device.
- Press the 'Play' button.

<img src="/img/2017-05-29-a-guide-to-installing-cordova-on-your-mac/xcode-select-device.png" alt="Xcode select device" />

_Note_: before the app can be deployed, you may need to wait for the iOS device to 'finish processing symbol files'. This can take a few minutes.

Xcode will now attempt to build and deploy the app to your device, but it will fail. You'll see a message in Xcode: _Verify the Developer App certificate for your account is trusted on your device_. Follow the instructions provided by Xcode to complete this task. Once your account is trusted, you won't need to perform this step again.

_Note:_ the process of trusting your account requires an Internet connection, so make sure your iOS device is online whilst performing the step above.

Now, return to Xcode and press 'Play' again. This time, the app should launch on your device.

#### iOS: subsequent launches

Now that Xcode and your iOS device are configured, you can deploy the app from the terminal as follows:

- Ensure your device is connected to your Mac and is unlocked.
- Open a terminal window and navigate to the project root directory.
- Run the command:

``` bash
cordova run ios
```

#### Android

If you have an Android phone or tablet running Android 4.4+, you can deploy the app to your device. You'll need a USB cable to connect your device to your Mac.

To begin, you need to configure your device to accept deployments from your Mac:

- Open the Settings app on your device.
- Scroll to the bottom of the list and tap _About phone_ or _About tablet_.
- Scroll to the bottom of the list and find the _Build number_ item.
- Tap on the _Build number_ item seven times. This will enable a new menu item _Developer Options_ in the main Settings app.
- Go back to the Settings app and tap on the new _Developer Options_ item. You should see a screen resembling the following:

<img src="/img/2017-05-29-a-guide-to-installing-cordova-on-your-mac/android-developer-options.png" alt="Android developer options screen" style="max-width: 350px" />

- If not enabled, tap the toggle switch to enable 'Developer Mode'.
- Scroll down and find the item 'USB Debugging' and tap the toggle switch to enable USB Debugging.

Your device can now accept app deployments from your Mac.

To continue:

- Ensure your device is unlocked.
- Connect your device to your Mac with the USB cable.
- You should see a message to 'Allow USB Debugging'. Check the 'Always allow from this computer' checkbox and tap 'OK'.

<img src="/img/2017-05-29-a-guide-to-installing-cordova-on-your-mac/android-usb-debugging.png" alt="Android allow USB debugging alert" style="max-width: 350px" />

- Open a terminal window and type `adb devices`. You should see your device listed as attached in the terminal.

You can now deploy the app to your device:

- In the terminal, type:

```
cordova run android
```

After a short while, the app will be deployed and automatically opened on your device.

## Next Steps

You've now got Cordova installed, configured and running on your Mac, and you are able to deploy apps to the simulators and devices. You're in good shape!

I'd recommend taking a look at the [Ionic Framework](https://ionicframework.com), which builds on Cordova by providing a set of platform-specific UI components and additional build tools to help you build an awesome hybrid mobile app.
