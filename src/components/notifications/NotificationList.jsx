import {useCallback, useState} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View, useColorScheme} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import NotificationBell from '../../assets/notification-bell.svg';
import {loadPrev, refreshCollection} from '../../redux/slices/sendbird';
import {parseThemeColor} from '../../utils';
import CategoryFilters from './CategoryFilters';
import Notification from './Notification';

export default function NotificationList() {
  const [refreshing, setRefreshing] = useState(false);
  const hasNewNotifications = useSelector(state => state.sendbird.hasNewNotifications);
  const dispatch = useDispatch();
  const selectedTheme = useColorScheme();
  const isNotificationsLoading = useSelector(state => state.sendbird.isNotificationsLoading);
  const isChannelLoading = useSelector(state => state.sendbird.isChannelLoading);
  const listSettings = useSelector(state => state.sendbird.globalSettings.themes[0].list);
  const isCategoryFilterEnabled = useSelector(state => state.sendbird.feedChannel.isCategoryFilterEnabled);
  const notifications = useSelector(state => state.sendbird.notifications);

  const NoNotifications = () => (
    <View style={styles.listEmpty}>
      <View>
        <NotificationBell height={60} width={60} style={styles.notificationBell(selectedTheme)} />
      </View>
      <Text style={styles.listEmptyText(selectedTheme)}>No Notifications</Text>
    </View>
  );

  const NewNotifications = () => (
    <TouchableOpacity style={styles.newNotificationsContainer} onPress={() => dispatch(refreshCollection())}>
      <Text style={styles.newNotificationsText}>New Notifications</Text>
    </TouchableOpacity>
  );

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      dispatch(refreshCollection())
        .unwrap()
        .then(() => {
          setRefreshing(false);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  if (isChannelLoading) {
    return (
      <View style={styles.activityIndicator}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isCategoryFilterEnabled && notifications.length === 0) {
    return <NoNotifications />;
  }

  return (
    <View style={styles.listContainer(listSettings, selectedTheme)}>
      <CategoryFilters />
      {isNotificationsLoading ? (
        <View style={styles.activityIndicator}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <View style={styles.listPadding} id="notification-list-pad">
          <FlatList
            contentContainerStyle={{paddingBottom: 40}}
            data={notifications}
            keyExtractor={item => item.messageId}
            ListEmptyComponent={<NoNotifications />}
            onEndReached={() => {
              if (!this.onEndReachedCalledDuringMomentum) {
                dispatch(loadPrev());
                this.onEndReachedCalledDuringMomentum = true;
              }
            }}
            onEndReachedThreshold={0.1}
            onMomentumScrollBegin={() => {
              this.onEndReachedCalledDuringMomentum = false;
            }}
            onRefresh={onRefresh}
            refreshing={refreshing}
            renderItem={({item}) => <Notification notification={item} />}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
      {hasNewNotifications && <NewNotifications />}
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: (listSettings, selectedTheme) => ({
    width: '100%',
    flex: 1,
    backgroundColor: parseThemeColor(listSettings.backgroundColor, selectedTheme),
  }),
  activityIndicator: {
    margin: 0,
    padding: 0,
    position: 'absolute',
    top: '50%',
    width: '100%',
  },
  listEmpty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 600,
  },
  listEmptyText: selectedTheme => ({
    width: 200,
    height: 20,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 19,
    textAlign: 'center',
    color: selectedTheme === 'light' ? '#000' : '#fff',
  }),
  listPadding: {
    paddingRight: 16,
    paddingLeft: 16,
    paddingBottom: 20,
    height: '100%',
  },
  notificationBell: selectedTheme => ({
    color: selectedTheme === 'light' ? '#000' : '#fff',
  }),
  newNotificationsContainer: {
    height: 38,
    width: 152,
    position: 'absolute',
    top: 45,
    alignSelf: 'center',
    flex: 1,
    zIndex: 1,
    borderRadius: 19,
    paddingTop: 11,
    paddingBottom: 11,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: '#742DDD',
  },
  newNotificationsText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 16,
    letterSpacing: 0.1,
  },
});
