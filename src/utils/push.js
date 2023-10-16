import notifee, {EventType} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {AppState, PermissionsAndroid, Platform} from 'react-native';
import {navigationRef} from '../../App';
import {refreshCollection, updateHasNewNotifications} from '../redux/slices/sendbird';
import {store} from '../redux/store';

export const requestNotificationsPermission = async () => {
  switch (Platform.OS) {
    case 'ios': {
      const authStatus = await messaging().requestPermission();
      return (
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
      );
    }
    case 'android': {
      const authStatus = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      return authStatus === 'granted';
    }
    default: {
      return true;
    }
  }
};

export const onRemoteMessage = async remoteMessage => {
  const currentScreen = navigationRef.current?.getCurrentRoute()?.name;
  const isSendbirdNotification = Boolean(remoteMessage.data.sendbird);
  if (!isSendbirdNotification) return;

  const channelId = await notifee.createChannel({
    id: 'SendbirdNotificationChannel',
    name: 'Sendbird RN Notification Sample',
  });

  if (remoteMessage && remoteMessage.data) {
    let pushActionId = 'SendbirdNotification-';
    const sendbirdData = JSON.parse(remoteMessage.data.sendbird);
    const channelUrl = store.getState().sendbird.feedChannel._url;
    if (
      currentScreen === 'Notifications' &&
      sendbirdData.channel.channel_url === channelUrl &&
      AppState.currentState === 'active'
    ) {
      store.dispatch(updateHasNewNotifications(true));
    } else {
      console.log('there');
      if (sendbirdData.channel.channel_url === channelUrl) {
        store.dispatch(refreshCollection());
      }
      await notifee.displayNotification({
        title: 'Sendbird RN Sample',
        body: remoteMessage.data.message,
        android: {
          channelId,
          pressAction: {
            id: pushActionId,
            launchActivity: 'default',
          },
        },
      });
    }
  }
};

export const onNotificationiOS = notification => {
  const data = notification?.getData();
  if (data && data.userInteraction === 1 && Boolean(data.sendbird)) {
  }
};

export const onNotificationAndroid = async event => {
  if (event.type === EventType.PRESS && Boolean(event.detail.notification?.data?.sendbird)) {
    onRemoteMessage(event.detail.notification);
  }
};
