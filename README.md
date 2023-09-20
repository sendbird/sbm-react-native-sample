# Sendbird Notifications React Native Sample

This sample application is a demo of the Sendbird Notifications product.
Built in React Native using the core JavaScript SDK.

## Prerequisite

### Sendbird Dashboard Setup

In order to successfully utilize this sample application, you must create the following templates in your application.

- [Text with one button](./docs//template-01/TEMPLATE-01.md)
- [Text with two buttons](./docs//template-02/TEMPLATE-02.md)
- [Image & Text with two buttons](./docs//template-03/TEMPLATE-03.md)
- [Text only](./docs//template-04/TEMPLATE-04.md)

_Please note that any template sent that does not match one of these four, will not be rendered or may render incorrectly._

### Enviornment Setup

- [Node](https://nodejs.org/en/)
- [NPM](https://www.npmjs.com/)
- [Cocoapods](https://cocoapods.org/)
- [XCode](https://developer.apple.com/xcode)
- [XCode Command Line Tools](https://facebook.github.io/react-native/docs/getting-started.html#xcode)
- [Android Studio](https://developer.android.com/studio/) (+Android SDK/Google API)

## Application Setup

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
