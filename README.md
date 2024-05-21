# Sendbird Business Messaging React Native Sample

This sample application is a demo of the Sendbird Business Messaging product.
Built in React Native using the core JavaScript SDK.

#### Useful links

- [Sendbird Docs](https://sendbird.com/docs/business-messaging/guide/v2/overview)
- [Sendbird Dashboard](https://dashboard.sendbird.com)
- [Sendbird Community](https://community.sendbird.com)

## Enviornment Setup

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

Step 2 (iOS Only): Pod install

```
npx pod-install ios
```

## Usage

Start the metro bundler by running:

```
npm start
```

Follow the on screen instructions to launch on Android or iOS

#### How is push handled?

|                                   | Android | iOS    |
| --------------------------------- | ------- | ------ |
| `markPushNotificationAsDelivered` | JS      | Native |
| `markPushNotificationAsClicked`   | JS      | JS     |
