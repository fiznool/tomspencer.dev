+++
title = "A guide to installing Cordova on Windows 10"
date = "2017-05-30T21:18:23+01:00"
comments = true
categories = [
  "mobile",
  "cordova"
]
description = "This is the second part of a guide to installing the Cordova framework, and deals with installation on Windows 10."
+++

This is the second part of a guide to installing the [Cordova](https://cordova.apache.org/) framework, and deals with installation on Windows 10. If you own a Mac, see [part one]({{< relref "2017-05-29-a-guide-to-installing-cordova-on-your-mac.markdown" >}}) instead.

<!-- more -->

_This guide was last updated on 30th May 2017. If any of the steps below are out of date, please let me know via the comments section below._

## Prerequisites

To follow through this guide you'll need:

- A computer running Windows 10.
- An Android device, plus a USB cable to connect it to your compiuter.

## A few notes

### iOS

Unfortunately you need a Mac to build an app for an iOS device. This guide will therefore include instructions for Android only.

### 32-bit vs 64-bit Windows

This guide assumes you are running 64-bit Windows. If you don't know what version you are running, it will almost certainly be 64-bit.

If you think you might be running a 32-bit install, then you should use the 32-bit installation files below. Wherever you see `64 bit`, substitute this for `32 bit`.

If you are in any doubt, or want to double check, follow these instructions:

- Select the Search box in the bottom left hand corner of the screen.
- Type _system_ then select the _System_ item.

<img src="/img/2017-05-30-a-guide-to-installing-cordova-on-windows-10/win-search-system.png" alt="Search for Windows System application" style="max-width: 300px" />

The _System type_ field will show the version of Windows you are running.

<img src="/img/2017-05-30-a-guide-to-installing-cordova-on-windows-10/win-system.png" alt="Windows System application screenshot" style="max-width: 600px" />

## Steps

Briefly, these are steps you need to take:

1. Install the Git for Windows terminal application
2. Install and configure the Android SDK
3. Install the Cordova CLI and create a sample app
4. Deploy to the Android emulator
5. Deploy to your device

### 1) Git for Windows

The [Git for Windows terminal](https://git-for-windows.github.io/) is a superior alternative to the built-in Windows console application. We'll be using it to run terminal commands.

To install:

- Browse to the [Git for Windows homepage](https://git-for-windows.github.io/).
- Select the big _Download_ button.

The appropriate file should be downloaded. Once it has, double click to open and follow through with the installer, using all of the default options.

### 2) Android SDK

The Android SDK is used to build Android apps. There are a few steps involved to get the Android SDK:

- Install Java
- Install the Android command line tools
- Install the Android SDK

We'll cover these steps now.

#### Installing Java

- Go to the [Java download page](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html).
- After accepting the license agreement, choose the _Windows x64_ file under the _Java SE Development Kit_ section to begin the download.

<img src="/img/2017-05-30-a-guide-to-installing-cordova-on-windows-10/java-download-windows.png" alt="Java download page" style="max-width: 500px" />

- Once the `.exe` file has downloaded, open it.
- Double click on the package installer icon. The Java installer should appear - click through to install Java.

To check that Java was installed correctly, open a terminal window and type `java -version`. You should see the Java version printed to the terminal.

#### Installing the Android command line tools

- Go to the [Android SDK Command Line tools installation page](https://developer.android.com/studio/index.html#command-tools).
- Click on the zip file for the Windows platform to download the tools to your computer.

<img src="/img/2017-05-30-a-guide-to-installing-cordova-on-windows-10/android-sdktools-download-windows.png" alt="Android SDK tools download page" />

- When it has finished downloading, open the Windows File Explorer.
- Navigate to the `C:\` drive folder. You should see a few folders here, including `Program Files`.
- Create a new folder in the `C:\` drive names `android`.
- Unzip the downloaded file to this new folder. This will take a few minutes.

When you are done, you should have a new folder at `C:\android\tools`.

#### Installing the SDK

We'll now use the Command Line tools to install the SDK and other necessary tools.

- Open the Git Bash app.
- Type the following commands:

``` bash
cd C:/android/tools/bin
./sdkmanager.bat "build-tools;25.0.3" "emulator" "extras;intel;Hardware_Accelerated_Execution_Manager" "platforms;android-25" "platform-tools" "system-images;android-25;google_apis;x86" --verbose
./avdmanager.bat -v create avd -n x86 -k "system-images;android-25;google_apis;x86" -g "google_apis"
```

Make sure to accept the license agreement. Once these commands have completed, your `android` folder should contain a whole bunch of new directories, including:

- `build-tools` - these are the tools used by Cordova to build your Android app.
- `emulator` - this is the Android emulator that will be used later to preview the app on your computer.
- `platforms` - this is the Android SDK, separated by platform version. These correspond to the releases of Android: Nougat, Marshmallow, etc. The command above has downloaded the most recent platform version (25).
- `platform-tools` - more tools that are used to administer Android devices on the command line.
- `system-images` - these are images used by the emulator.

#### Installing Gradle

Gradle is a tool that is required by the Android SDK to build Android apps. It used to be included with the Android SDK, but now it must be downloaded and configured manually.

- Go to the [gradle releases page](https://gradle.org/releases).
- Find the `binary-only` version of the latest release and select it to begin the download.

<img src="/img/2017-05-30-a-guide-to-installing-cordova-on-windows-10/gradle-download.png" alt="Gradle download" />

- When the download has finished, unzip the file.
- Rename the resulting folder to just `gradle`.
- Move this `gradle` folder to the `android` folder that was created above.

#### Configuration

In order to make this dizzying array of tools available to Cordova, and to us when using Git Bash, we need to set some environment variables. To do this:

- Select the Search box in the bottom left hand corner of the screen.
- Type _environment_ then select _Edit the system environment variables_.

<img src="/img/2017-05-30-a-guide-to-installing-cordova-on-windows-10/win-search-environment.png" alt="Windows search environment variables" style="max-width: 300px" />

- The _System Properties_ pane will appear. Select the _Environment Variables..._ button.

We need to set three environment variables in total.

##### 1) `JAVA_HOME`

- Under the _System variables_ section, click the _New..._ button.

<img src="/img/2017-05-30-a-guide-to-installing-cordova-on-windows-10/win-env-var-new.png" alt="Windows new environment variable" style="max-width: 500px" />

- In the _Variable Name_ box, type `JAVA_HOME`.
- Select the _Browse Directory_ button. In the resulting folder browser pane, expand _This PC_ -> _WINDOWS (C:)_ -> _Program Files_ -> _Java_ and choose the folder beginning with `jdk`. Select OK.
- Your new environment variable should resemble the following:

<img src="/img/2017-05-30-a-guide-to-installing-cordova-on-windows-10/win-env-var-java.png" alt="Windows Java environment variable" style="max-width: 500px" />

- Select _OK_ to create the environment variable.

##### 2) `ANDROID_HOME`

- Under the _System variables_ section, click the _New..._ button.
- In the _Variable Name_ box, type `ANDROID_HOME`.
- In the _Variable Value_ box, type `C:\android`.
- Select _OK_ to create the environment variable.

##### 3) `Path`

- Select the `Path` item under the _System variables_ section and click the _Edit..._ button. You should see a pane named _Edit environment variable_.
- Using the _New_ button, add the following four items to the list:

```
%ANDROID_HOME%\emulator
%ANDROID_HOME%\gradle\bin
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools\bin
```

<img src="/img/2017-05-30-a-guide-to-installing-cordova-on-windows-10/win-env-var-path.png" alt="Windows Path environment variable" style="max-width: 500px" />

- Click _OK_ and then _OK_ again to close the panes.

To test that all of this has worked, try typing the following into the terminal window:

```
adb version
gradle -v
```

After running each command, you should see the respective tool print its version number. If any of these commands results in a `command not found`, the environment has not yet been setup correctly. Please double check that the above steps have been carried out before continuing.

#### Next Step

If you have got this far, congratulations! We have now set up the Android SDK. The next step is to install the Cordova CLI and create a sample app.

### 4) Install the Cordova CLI

#### Install node.js

The Cordova CLI requires node.js. If you have already installed node, you can skip to the next section.

Otherwise:

- Go to the [node.js download page](https://nodejs.org/en/download).
- Click on the 'Windows Installer' box to download the LTS version of node for Windows.
- When the file has downloaded, click on it to run the installer.
- When it has finished, **close and re-open Git Bash** and type `node -v`. Node should print out its version number.

#### Install Cordova

- In a Git Bash window, type `npm install -g cordova`. This command may take a few minutes to complete. There may be nothing printed to the window for a short while - be patient, it is working!

When this finished, you should be able to run the command `cordova -v` which should print the cordova version to the terminal.

#### Create a sample app

We'll now create a sample app which we can deploy to the emulator and device.

Open Git Bash and change to a folder where you are happy for code to live. The commands below will generate a new cordova project in a subdirectory of whichever folder you are currently in.

For example, if you have code living in folders at `C:\Users\<username>\Code`, change to this directory before running the commands below.

Once you are in the correct directory, run the following:

``` bash
cordova create cordova-hello-world
cd cordova-hello-world
cordova platform add android
cordova build
```

These commands will create a new cordova project, add the Android platform, and build the respective files for deployment to Android. It might take a while!

_Note_: you may need to click through to allow various programs access to restricted parts of the system, such as the firewall.

Before continuing, please ensure that the commands above all worked correctly, with no errors. If there were any errors, you'll need to go back and check that the Android SDK was installed correctly, and that you've set the environment variables correctly.

### 5) Deploy the sample app to the emulator

Before deploying to the emulator, there's more stuff to install.

- Open the File Explorer.
- Browse to the folder `C:\android\extras\intel\Hardware_Accelerated_Execution_Manager`.
- Double click on the file `intelhaxm-android.exe` and run through the installer.

Now we can deploy the app to the Android emulator. In the Git Bash window, type:

``` bash
cordova emulate android
```

If all is well, the emulator should launch and display the app:

<img src="/img/2017-05-30-a-guide-to-installing-cordova-on-windows-10/android-emulator-windows.png" alt="Android emulator running Cordova app" style="max-width: 300px" />

_Note_: If you see an error in the terminal such as `Intel virtualization technology (vt,vt-x) is not enabled` when the emulator is starting, this means that your computer may not support the Android emulator. If you know how to access your computer's BIOS, you can try to enable Hardware Virtualization. Otherwise, don't worry about it - we'll deploy to a real device instead.

### 6) Deploy the sample app to your device

If you have an Android phone or tablet running Android 4.4+, you can deploy the app to your device. You'll need a USB cable to connect your device to your computer.

To begin, you need to configure your device to accept deployments from your computer:

- Open the Settings app on your device.
- Scroll to the bottom of the list and tap _About phone_ or _About tablet_.
- Scroll to the bottom of the list and find the _Build number_ item.
- Tap on the _Build number_ item seven times. This will enable a new menu item _Developer Options_ in the main Settings app.
- Go back to the Settings app and tap on the new _Developer Options_ item. You should see a screen resembling the following:

<img src="/img/2017-05-30-a-guide-to-installing-cordova-on-windows-10/android-developer-options.png" alt="Android developer options screen" style="max-width: 350px" />

- If not enabled, tap the toggle switch to enable 'Developer Mode'.
- Scroll down and find the item 'USB Debugging' and tap the toggle switch to enable USB Debugging.

Your device can now accept app deployments from your computer.

To continue:

- Ensure your device is unlocked.
- Connect your device to your computer with the USB cable.
- You should see a message to 'Allow USB Debugging'. Check the 'Always allow from this computer' checkbox and tap 'OK'.

<img src="/img/2017-05-30-a-guide-to-installing-cordova-on-windows-10/android-usb-debugging.png" alt="Android allow USB debugging alert" style="max-width: 350px" />

- Open a Git Bash window and type `adb devices`. You should see your device listed as attached in the terminal.

You can now deploy the app to your device:

- In the terminal, type:

```
cordova run android
```

After a short while, the app will be deployed and automatically opened on your device.

## Next Steps

You've now got Cordova installed, configured and running on your computer, and you are able to deploy apps to the simulators and devices. You're in good shape!

I'd recommend taking a look at the [Ionic Framework](https://ionicframework.com), which builds on Cordova by providing a set of platform-specific UI components and additional build tools to help you build an awesome hybrid mobile app.