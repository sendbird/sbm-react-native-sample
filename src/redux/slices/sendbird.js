import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import SendbirdChat, {CollectionEventSource, DeviceOsPlatform, SessionHandler} from '@sendbird/chat';
import {FeedChannelModule} from '@sendbird/chat/feedChannel';
import {MessageCollectionInitPolicy, MessageFilter} from '@sendbird/chat/groupChannel';
import {Platform} from 'react-native';
import {getManufacturer} from 'react-native-device-info';
import {checkNotifications} from 'react-native-permissions';

export let sb;

const initialState = {
  isAuthenticated: false, // Used to force user to login page
  feedChannel: {},
  user: {},
  currentChannelUrl: '',
  notifications: [],
  globalSettings: {},
  templates: {},
  collection: null,
  activeFilter: '*', // Default value for "All" filter
  unreadCount: 0,
  initialLoadComplete: false,
  hasNewNotifications: false,
  isChannelLoading: true,
  isNotificationsLoading: true,
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    addNotifications(state, action) {
      state.notifications = [...action.payload, ...state.notifications];
    },
    addNotificationsByAPI(state, action) {
      state.notifications = action.payload;
      state.isNotificationsLoading = false;
    },
    addNotificationsByCache(state, action) {
      state.notifications = action.payload;
    },
    updateNotifications(state, action) {
      state.notifications = state.notifications.map(notification => {
        const updatedNotification = action.payload[notification.notificationId];
        return updatedNotification ? updatedNotification : notification;
      });
    },
    updateNotificationsLoading(state, action) {
      state.isNotificationsLoading = action.payload;
    },
    updateChannel(state, action) {
      state.feedChannel = action.payload;
    },
    updateHasNewNotifications(state, action) {
      state.hasNewNotifications = action.payload;
    },
    updateUnreadCount(state, action) {
      state.unreadCount = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(initSendbird.fulfilled, (state, action) => {
      const {globalSettings, currentChannelUrl, templates, user} = action.payload;
      state.user = user;
      state.globalSettings = globalSettings;
      state.templates = templates;
      state.currentChannelUrl = currentChannelUrl;
      state.isAuthenticated = true;
    });
    builder.addCase(initCollection.fulfilled, (state, action) => {
      const {feedChannel, collection, activeFilter} = action.payload;
      state.feedChannel = feedChannel;
      state.collection = collection;
      state.activeFilter = activeFilter;
      state.unreadCount = feedChannel.unreadMessageCount;
      state.isChannelLoading = false;
      if (state.initialLoadComplete === false) {
        state.initialLoadComplete = true;
      }
    });
    builder.addCase(handleSignOut.fulfilled, () => initialState);
    builder.addCase(loadPrev.fulfilled, (state, action) => {
      state.notifications = [...state.notifications, ...action.payload.notifications];
      state.collection = action.payload.collection;
    });
    builder.addCase(loadNext.fulfilled, (state, action) => {
      state.notifications = [...action.payload.notifications, ...state.notifications];
      state.collection = action.payload.collection;
    });
    builder.addCase(refreshCollection.fulfilled, (state, action) => {
      state.hasNewNotifications = false;
    });
    builder.addCase(refreshTemplateList.fulfilled, (state, action) => {
      state.templates = action.payload;
    });
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  addNotifications,
  addNotificationsByAPI,
  addNotificationsByCache,
  updateNotifications,
  updateNotificationsLoading,
  updateHasNewNotifications,
  updateChannel,
  updateUnreadCount,
} = slice.actions;

async function registerCollectionHandlers(dispatch, getState, collection) {
  const handler = {
    onMessagesAdded: (context, channel, messages) => {
      let shouldRefreshTemplates = false;
      const currentNotifications = getState().sendbird.notifications;
      const newNotifications = messages.filter(
        message => !currentNotifications.some(notification => notification.notificationId === message.notificationId),
      );
      newNotifications.forEach(message => {
        if (!getState().sendbird.templates[message.template]) {
          shouldRefreshTemplates = true;
        }
      });
      shouldRefreshTemplates && dispatch(refreshTemplateList());
      dispatch(addNotifications(newNotifications));
    },
    onMessagesUpdated: (context, channel, messages) => {},
    onMessagesDeleted: (context, channel, messages) => {},
    onChannelUpdated: (context, channel) => {
      if (
        [CollectionEventSource.EVENT_CHANNEL_READ, CollectionEventSource.SYNC_CHANNEL_CHANGELOGS].includes(
          context.source,
        )
      ) {
        dispatch(updateUnreadCount(channel.unreadMessageCount));
      }
      dispatch(updateChannel(channel));
    },
    // Notification Channels can not currently be deleted
    onChannelDeleted: (context, channel) => {},
    // Dispose of the collection if the gap is too large
    onHugeGapDeteched: () => {
      dispatch(disposeCollection());
    },
  };
  collection.setMessageCollectionHandler(handler);
}

async function issueSessionToken(userId, appId) {
  // This is just a simple lambda function that generates a token for the user
  // This should be a more secure URL in your backend service
  const response = await fetch('https://7kqiu6yti6627q27743ymy5wam0nmdti.lambda-url.us-east-1.on.aws/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      app_id: appId,
    }),
  });

  const {token} = await response.json();
  return token;
}

export const initSendbird = createAsyncThunk('sendbird/init', async (data, {dispatch, getState}) => {
  try {
    // Initialize the Sendbird application with the FeedModule
    sb = SendbirdChat.init({
      appId: data.appId,
      // customApiHost: 'https://api-preprod.sendbird.com',
      // customWebSocketHost: 'wss://ws-preprod.sendbird.com',
      modules: [new FeedChannelModule()],
      newInstance: sb?.appId !== data.appId,
    });

    // Register sessionHandlers to handle session token refresh and session closure
    sb.setSessionHandler(
      new SessionHandler({
        onSessionTokenRequired: (resolve, reject) => {
          issueSessionToken(data.userId, data.appId)
            .then(token => resolve(token))
            .catch(err => reject(err));
        },
        onSessionRefreshed: () => {
          // session is refreshed
        },
        onSessionError: err => {
          console.error('onSessionError', err);
          dispatch(handleSignOut());
          // session refresh failed
        },
        onSessionClosed: () => {
          dispatch(handleSignOut());
          // session is closed
        },
      }),
    );

    // Log in using only the API, not with Websocket to prevent unwanted MAU increases.
    const user = await sb.authenticateFeed(data.userId, data.token);

    // Storing the login information in AsyncStorage for later use
    await AsyncStorage.setItem(
      'loginInformation',
      JSON.stringify({
        appId: data.appId,
        userId: data.userId,
        token: data.token,
        channelUrl: data.channelUrl,
        isSignedIn: true,
      }),
    );

    // OPTIONAL: Fetch global theme settings.
    // You may not need these if you don't wish to determine theme via Sendbird Dashboard
    const globalSettings = JSON.parse((await sb.feedChannel.getGlobalNotificationChannelSetting()).jsonString);

    const templates = await getTemplates();

    // Request permission for push notifications
    const {status} = await checkNotifications();
    if (status === 'granted') {
      // Register push if permission is granted
      if (Platform.OS === 'ios') {
        const token = await messaging().getAPNSToken();
        await sb.registerAPNSPushTokenForCurrentUser(token, {
          deviceOS: {
            platform: DeviceOsPlatform.IOS,
            version: String(Platform.Version),
          },
          deviceManufacturer: await getManufacturer(),
          systemPushEnabled: true,
        });
      } else if (Platform.OS === 'android') {
        const token = await messaging().getToken();
        await sb.registerFCMPushTokenForCurrentUser(token, {
          deviceOS: {
            platform: DeviceOsPlatform.ANDROID,
            version: String(Platform.Version),
          },
          deviceManufacturer: await getManufacturer(),
          systemPushEnabled: true,
        });
      }
    }

    return {
      user: user,
      globalSettings: globalSettings,
      currentChannelUrl: data.channelUrl,
      templates: templates,
    };
  } catch (error) {
    console.error('initSendbird Error', error);
    throw error;
  }
});

export const initCollection = createAsyncThunk('sendbird/initCollection', async (data, {dispatch, getState}) => {
  try {
    // If the user is on the Notification list, we want to render an ActivityIndicator
    dispatch(updateNotificationsLoading(true));

    // Dipose of any existing collection in order to prevent duplicates
    const existingCollection = getState().sendbird.collection;
    if (existingCollection) {
      existingCollection.dispose();
    }

    // Check if we passed a new filter to the collection
    let selectedFilter = data?.selectedFilter || getState().sendbird.activeFilter;

    const channelUrl = getState().sendbird.currentChannelUrl;

    let channel;

    if (channelUrl && channelUrl !== '') {
      channel = await sb.feedChannel.getChannel(channelUrl);
    } else {
      const queryParams = {
        includeEmpty: true,
        limit: 1,
      };

      const channelQuery = sb.feedChannel.createMyFeedChannelListQuery(queryParams);
      const channels = await channelQuery.next();

      if (channels.length === 0) {
        throw new Error('No feed channel found');
      } else {
        channel = channels[0];
      }
    }

    const filter = new MessageFilter();
    if (data?.selectedFilter) {
      filter.customTypesFilter = [data.selectedFilter];
    }

    const params = {
      filter: filter,
      limit: 20,
      startingPoint: Date.now(),
      nextResultLimit: 10,
      prevResultLimit: 0,
    };

    // Create the collection
    const collection = channel.createNotificationCollection(params);
    // Register collectionHandlers for when refresh is triggered
    registerCollectionHandlers(dispatch, getState, collection);

    collection
      .initialize(MessageCollectionInitPolicy.CACHE_AND_REPLACE_BY_API)
      .onCacheResult((err, messages) => {
        dispatch(addNotificationsByCache(messages));
      })
      .onApiResult((err, messages) => {
        let shouldRefreshTemplates = false;
        messages.forEach(message => {
          if (!getState().sendbird.templates[message.template]) {
            shouldRefreshTemplates = true;
          }
        });
        dispatch(addNotificationsByAPI(messages));
        shouldRefreshTemplates && dispatch(refreshTemplateList());
      });

    return {
      feedChannel: channel,
      activeFilter: selectedFilter,
      collection: collection,
    };
  } catch (error) {
    console.error('collectionInit Error', error);
    throw error;
  }
});

export const handleSignOut = createAsyncThunk('sendbird/handleSignOut', async data => {
  try {
    // If a user explicitly signs out we should remove their tokens.
    // Alternatively instead of removing all tokens, you could remove just this device's token.
    // Using sb.unregister{APNS/FCM}PushTokenForCurrentUser(token)
    if (Platform.OS === 'ios') {
      await sb.unregisterAPNSPushTokenAllForCurrentUser();
    } else {
      await sb.unregisterFCMPushTokenAllForCurrentUser();
    }
    await sb.disconnect();
    AsyncStorage.mergeItem('loginInformation', JSON.stringify({isSignedIn: false}));
    return;
  } catch (error) {
    console.error('handleSignOut Error', error);
    throw error;
  }
});

export const markMessagesAsRead = createAsyncThunk(
  'sendbird/markMessagesAsRead',
  async (data, {dispatch, getState}) => {
    try {
      const channel = getState().sendbird.feedChannel;
      await channel.markAsRead(data);
      return;
    } catch (error) {
      console.error('markMessagesAsRead Error', error);
      throw error;
    }
  },
);

export const markButtonAsClicked = createAsyncThunk(
  'sendbird/markButtonAsClicked',
  async (data, {dispatch, getState}) => {
    try {
      const channel = getState().sendbird.feedChannel;
      await channel.logClicked([data]);
      return;
    } catch (error) {
      console.error('markButtonAsClicked Error', error);
      throw error;
    }
  },
);

export const logImpression = createAsyncThunk('sendbird/logViewed', async (data, {dispatch, getState}) => {
  try {
    const channel = getState().sendbird.feedChannel;
    await channel.logViewed(data);
    return;
  } catch (error) {
    console.error('logViewed Error', error);
    throw error;
  }
});

export const refreshCollection = createAsyncThunk('sendbird/refreshCollection', async (data, {getState}) => {
  try {
    // Refreshes the collection. Channel + Notifications
    sb.feedChannel.refreshNotificationCollections();
    // We don't actually need to return anything since updating will happen via the handlers
    return {};
  } catch (error) {
    console.error('refreshCollection Error', error);
    throw error;
  }
});

export const refreshTemplateList = createAsyncThunk('sendbird/refreshTemplateList', async (data, {dispatch}) => {
  return await getTemplates();
});

export const disposeCollection = createAsyncThunk('sendbird/disposeCollection', async (data, {dispatch, getState}) => {
  try {
    // Dispose of the collection to resolve huge gap
    getState().sendbird.collection.dispose();
    dispatch(initCollection());
    return;
  } catch (error) {
    console.error('disposeCollection Error', error);
    throw error;
  }
});

export const loadNext = createAsyncThunk('sendbird/loadNext', async data => {
  try {
    const collection = getState().sendbird.collection;

    // Only process this thunk if the collection hasNext
    if (collection.haxNext) {
      const notifications = await collection.loadNext();
      return {
        notifications: notifications,
        collection: collection,
      };
    } else {
      abort();
    }
  } catch (error) {
    console.error('loadNext Error', error);
    throw error;
  }
});

export const loadPrev = createAsyncThunk('sendbird/loadPrev', async (data, {getState, abort}) => {
  try {
    const collection = getState().sendbird.collection;

    // Only process this thunk if the collection hasPrevious
    if (collection.hasPrevious) {
      const notifications = await collection.loadPrevious();
      return {
        notifications: notifications,
        collection: collection,
      };
    } else {
      abort();
    }
  } catch (error) {
    console.error('loadPrev Error', error);
    throw error;
  }
});

export const markPushNotificationAsDelivered = createAsyncThunk(
  'sendbird/markPushNotificationAsDelivered',
  async (data, {getState}) => {},
);

async function getTemplates(token = '') {
  let hasMore = true;
  let templates = {};
  while (hasMore) {
    const response = await sb.feedChannel.getNotificationTemplateListByToken(token);
    const data = JSON.parse(response.notificationTemplateList.jsonString);
    data.templates.forEach(template => {
      !template['color_variables'] && (template['color_variables'] = {});
      templates[template.key] = template;
    });
    token = response.token;
    hasMore = response.hasMore;
  }

  return templates;
}
