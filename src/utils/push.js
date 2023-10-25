import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';
import {isSendbirdNotification, parseSendbirdNotification} from '@sendbird/uikit-utils';
import {Platform} from 'react-native';
import {requestNotifications} from 'react-native-permissions';
import {navigationRef} from '../../App';
import {refreshCollection, updateHasNewNotifications} from '../redux/slices/sendbird';
import {dispatch, store} from '../redux/store';

const ANDROID_NOTIFICATION_CHANNEL_ID = 'default';

class NotificationHandler {
  constructor() {
    notifee.createChannel({
      id: ANDROID_NOTIFICATION_CHANNEL_ID,
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });
  }

  startOnForeground() {
    const unsubscribes = [];

    if (Platform.OS === 'android') {
      messaging().onMessage(async remoteMessage => {
        if (isSendbirdNotification(remoteMessage.data)) {
          const sendbird = parseSendbirdNotification(remoteMessage.data);
          const currentScreen = navigationRef.current?.getCurrentRoute()?.name;

          if (
            currentScreen === 'Notifications' &&
            sendbird.channel.channel_url === store.getState().sendbird.feedChannel._url
          ) {
            dispatch(updateHasNewNotifications(true));
          } else {
            dispatch(refreshCollection());
            await this.displayNotification(remoteMessage, sendbird);
          }
        }
      });
      unsubscribes.push(
        // Specifies the action to take when the user presses the notification in the foreground.
        notifee.onForegroundEvent(async ({type, detail}) => {
          if (type === EventType.PRESS && detail.notification && isSendbirdNotification(detail.notification.data)) {
            const payload = parseSendbirdNotification(detail.notification.data);
          }
        }),
      );
    }

    if (Platform.OS === 'ios') {
      PushNotificationIOS.addEventListener('notification', async notification => {
        const data = notification.getData();
        if (isSendbirdNotification(data)) {
          const sendbird = parseSendbirdNotification(data);
          const currentScreen = navigationRef.current?.getCurrentRoute()?.name;
          if (
            currentScreen === 'Notifications' &&
            sendbird.channel.channel_url === store.getState().sendbird.feedChannel._url
          ) {
            dispatch(updateHasNewNotifications(true));
          } else {
            dispatch(refreshCollection());
            this.displayNotification(notification, sendbird);
          }
          // Specifies the action to take when the user presses the notification in the foreground.
          if (data.userInteraction === 1) {
          }
        }
      });
      unsubscribes.push(() => PushNotificationIOS.removeEventListener('notification'));
    }

    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe());
    };
  }

  startOnBackground() {
    if (Platform.OS === 'android') {
      // Specifies the action to take when the user presses the notification in the background.
      notifee.onBackgroundEvent(async ({type, detail}) => {
        if (type === EventType.PRESS && detail.notification && isSendbirdNotification(detail.notification.data)) {
          console.log('Pressed Notification in Background');
        }
      });

      messaging().setBackgroundMessageHandler(async remoteMessage => {
        if (isSendbirdNotification(remoteMessage.data)) {
          await this.displayNotification(remoteMessage, parseSendbirdNotification(remoteMessage.data));
        }
      });
    }

    if (Platform.OS === 'ios') {
      /**
       * Sendbird does not supports "silent notification(data-only message)"
       * Notifications including alerts received in the background, automatically display as notification popups
       */
    }
  }

  displayNotification = async (remoteMessage, sendbird) => {
    await notifee.displayNotification({
      id: String(sendbird.message_id),
      title: `${sendbird.channel.name || sendbird.sender?.name || 'Message received'}`,
      body: sendbird.message,
      data: remoteMessage.data,
      android: {
        channelId: ANDROID_NOTIFICATION_CHANNEL_ID,
        importance: 4,
        largeIcon: sendbird.sender?.profile_url || sendbird.channel.channel_url,
        circularLargeIcon: true,
        pressAction: {id: 'default'},
        showTimestamp: true,
        timestamp: sendbird.created_at,
      },
    });
  };
}

export const requestPermissions = async () => {
  const result = await requestNotifications([]);
  return result.status === 'granted' || result.status === 'limited';
};

export const notificationHandler = new NotificationHandler();
