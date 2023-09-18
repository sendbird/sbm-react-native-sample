/**
 * @format
 */

import messaging from '@react-native-firebase/messaging';
import {AppRegistry, Platform} from 'react-native';
import {Provider as ReduxProvider} from 'react-redux';

import App from './App';
import {name as appName} from './app.json';
import {store} from './src/redux/store';
import {onRemoteMessage} from './src/utils';

if (Platform.OS !== 'ios') {
  messaging().setBackgroundMessageHandler(onRemoteMessage);
  messaging().onMessage(onRemoteMessage);
}

const ReduxApp = () => (
  <ReduxProvider store={store}>
    <App />
  </ReduxProvider>
);

AppRegistry.registerComponent(appName, () => ReduxApp);
