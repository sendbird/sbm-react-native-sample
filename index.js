/**
 * @format
 */

import {AppRegistry, Platform, UIManager} from 'react-native';
import {Provider as ReduxProvider} from 'react-redux';

import App from './App';
import {name as appName} from './app.json';
import {store} from './src/redux/store';
import {notificationHandler} from './src/utils';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

notificationHandler.startOnBackground();

const ReduxApp = () => (
  <ReduxProvider store={store}>
    <App />
  </ReduxProvider>
);

AppRegistry.registerComponent(appName, () => ReduxApp);
