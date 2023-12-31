---
categories:
  - react-native
  - mobile-app
comments: true
description: After using Expo for the latter part of 2023, my impression of the project has changed for the better.
pubDate: '2024-01-01T08:13:41.854Z'
title: 'Thoughts on Expo'
---

I've been working with React Native professionally since 2018. During this time, I've watched Expo grow from a simple framework extension to a cornerstone in the React Native ecosystem. This article delves into how Expo has transformed the landscape of mobile app development with React Native, and outlines the reasons why I would recommend building a React Native app with Expo in 2024.

## Speed of getting started

One of the standout features of Expo is the speed and ease with which developers can start a new project. The tooling provided by Expo simplifies the process of scaffolding a project, allowing developers to focus more on building their application rather than setup and configuration. The provision for quickly adding essential elements like app icons and splash screens further streamlines the development process, making Expo a go-to choice for rapid development. It's the perfect tool for building and iterating quickly.

## First-class citizen in the React Native world

Expo's integration and recognition within the React Native community have grown substantially. It is frequently mentioned in the official React Native documentation, underscoring its importance and reliability. This recognition not only highlights Expo's capabilities but also assures developers of its compatibility and support within the broader React Native framework.

## A rich ecosystem of third-party packages

The ecosystem surrounding Expo is both rich and robust, offering a plethora of packages that extend the functionality of a standard React Native app. From geolocation and camera access to secure storage solutions, Expo's packages enable developers to incorporate advanced features with minimal hassle. Furthermore, these packages are developed by the core Expo team, so you are safe in the knowledge that they are well supported, unlike a number of other popular third-party React Native packages.

## Revolutionizing native code management and code signing

One of the most innovative aspects of Expo in recent years is its approach to handling native code. Unlike traditional methods where native code is a permanent part of the source control, Expo adopts a more ephemeral approach. Native code configurations are dynamically generated, which substantially eases the upgrade process and reduces compatibility issues. Moreover, the ability to perform builds and manage code signing in the cloud (using EAS Build) further enhances developer convenience, negating the need for complex local environment setups.

## Instant App updates

Expo provides a service to push updates directly to users' devices, bypassing the traditional App Store update process. Ideal for minor tweaks and urgent fixes, EAS Update ensures that users always have the latest version of the app without the delays typically associated with app store approvals. While major updates should still adhere to app store guidelines, this service is a boon for rapid, continuous deployment, enhancing both the development cycle and the user experience.

## Minimal vendor lock-in

The core Expo packages are open source and can be used independently of the EAS cloud offering, meaning that an app built with Expo is not locked-in to the Expo ecosystem. This alleviates any concerns with the ongoing maintenance of long-running app development.

## Conclusion

If I was starting a new React Native project today, I wouldn't hesitate to build it with Expo. It's evident that it has grown from a mere framework extension to an indispensable tool in the React Native ecosystem. Its ease of use, comprehensive package ecosystem, and innovative approach to native code management make it a compelling choice for developers.
