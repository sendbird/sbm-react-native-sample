import {NavigationContainer, createNavigationContainerRef} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useCallback, useEffect} from 'react';
import {AppState} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {useDispatch, useSelector} from 'react-redux';
import {refreshCollection, sb} from './src/redux/slices/sendbird';
import LoginScreen from './src/screens/LoginScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import {notificationHandler, requestPermissions} from './src/utils';

const Stack = createNativeStackNavigator();
export const navigationRef = createNavigationContainerRef();

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.sendbird.isAuthenticated);

  useEffect(() => {
    requestPermissions().then(permissionGranted => {
      if (permissionGranted) {
        notificationHandler.startOnAppOpened();
        return notificationHandler.startOnForeground();
      }
    });
  }, []);

  // Refresh collection when app comes back into foreground
  const handleAppStateChange = useCallback(nextAppState => {
    if (nextAppState === 'active' && !!sb?.currentUser) {
      // sb.setForegroundState();
      dispatch(refreshCollection());
    } else if (nextAppState === 'background') {
      // sb?.setBackgroundState();
    }
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
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
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} options={{animationTypeForReplace: 'pop'}} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
