---
title: 'Candide POS'
summary: 'An app to accept in-person payments using a Stripe card reader.'
keyPoints:
  - Point of Sale app built using Expo and React Native
  - Built from supplied designs and content
  - Connects to dedicated card reader and printer hardware to process transactions
startDate: 2023-09-01
endDate: 2024-01-31
featured: true
cv: true
faction: 'mobile-app'
---

Candide POS is a native mobile app for accepting in-person ticket payments using a Stripe card reader. It also supports printing a receipt using a Star Micronics printer, which detailed the transaction. It was developed to work with Candide's garden admissions system, which allows individual day tickets to be purchased, as well as season-long memberships and guest passes.

Connecting to the respective pieces of hardware and responding to various events (payment accepted, device disconnected, printer out of paper, etc) was a particular challenge. The XState library was used to manage this complexity, allowing the app to handle a myriad of different states in a coherent manner.

The app was developed for both phone and tablet, with the UI responding accordingly to the different screen sizes.

The app was built as a native binary using the Expo framework. EAS Build was used to build the app for both iOS and Android, managing code signing, compilation and distribution to the relevant app stores.
