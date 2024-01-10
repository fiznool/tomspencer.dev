---
title: 'xplore POS'
summary: 'An app to allow businesses to accept payments with a pre-paid xplore card'
keyPoints:
  - Suite of apps to connect local businesses with customers, build using React Native
  - POS app to connect to dedicated card reader hardware
  - Upgraded app to modern standards including React hooks and TypeScript
startDate: 2021-09-01
endDate: 2023-07-31
faction: 'mobile-app'
---

The xplore suite of apps began life as _Pixie_, an app to connect independent businesses with customers. One part of the product allowed business to accept payments via a pre-payment _Pixie Card_ - customers using this card accumulated loyalty points, which could then be spent at any participating business.

To accept payments, a business needs to use a card reader. There were two options:

- An all-in-one card reader, comprising a touch screen and necessary hardware to scan a Pixie card
- A separate card reader, which connects to a smartphone to scan a Pixie card

The Pixie POS app was developed to accommodate both of these use cases. Built using React Native, it interfaces with the card reader via an SDK, and runs on either the card reader itself or a companion smartphone, depending on the card reader hardware that was used.

I was initially commissioned to improve the reliability and performance of the app, which was having issues when network connectivity was poor. A queuing system was built to alleviate these concerns and to improve the handling of events such as the card reader disconnecting, or payments being declined.

Later, I supported the work to rebrand the POS app to the new _xplore_ branding, and added a feature which supported payment via a QR code instead of a card.

The xplore POS app continues to be available on both the iOS and Android app stores, and is expanding to include more locations within the UK.
