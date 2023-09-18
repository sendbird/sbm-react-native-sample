# Sendbird Notifications React Native Sample

This sample application is a demo of the Sendbird Notifications product.
Built in React Native using the core JavaScript SDK.

## Prerequisite

- [Node](https://nodejs.org/en/)
- [NPM](https://www.npmjs.com/)
- [Cocoapods](https://cocoapods.org/)
- [XCode](https://developer.apple.com/xcode)
- [XCode Command Line Tools](https://facebook.github.io/react-native/docs/getting-started.html#xcode)
- [Android Studio](https://developer.android.com/studio/) (+Android SDK/Google API)

## Installation

Step 1: Install dependencies

```
npm install
```

Step 2: Fill in the necessary information in the following in formation in `src/constants/sendbird.js`

```
const APP_ID = '' // Sendbird application ID
const USER_ID = '' // Desired Sendbird sser
const TOKEN = '' // SessionToken for desired user
const FEED_CHANNEL_URL = '' // The channel URL of the feed channel
```

Step 3 (iOS Only): Pod install

```
cd ios
pod install
pod update
```

## Usage

Start the metro bundler by running:

```
npm start
```

Follow the on screen instructions to launch on Android or iOS
