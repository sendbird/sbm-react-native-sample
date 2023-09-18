import notifee from '@notifee/react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {NavigationContainer, createNavigationContainerRef} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useCallback, useEffect} from 'react';
import {AppState, Platform} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {useDispatch, useSelector} from 'react-redux';
import {refreshCollection, sb} from './src/redux/slices/sendbird';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import {onNotificationAndroid, onNotificationiOS} from './src/utils';

const Stack = createNativeStackNavigator();
export const navigationRef = createNavigationContainerRef();

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.sendbird.isAuthenticated);

  // Refresh collection when app comes back into foreground
  const handleAppStateChange = useCallback(nextAppState => {
    if (nextAppState === 'active' && !!sb?.currentUser) {
      dispatch(refreshCollection());
    }
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.getInitialNotification().then(onNotificationiOS);
      PushNotificationIOS.addEventListener('localNotification', onNotificationiOS);
      return PushNotificationIOS.removeEventListener('localNotification');
    } else {
      const unsubscribe = notifee.onForegroundEvent(onNotificationAndroid);
      return unsubscribe;
    }
  }, []);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} options={{animationTypeForReplace: 'pop'}} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
