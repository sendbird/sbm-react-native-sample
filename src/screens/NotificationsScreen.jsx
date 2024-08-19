import {ActivityIndicator, SafeAreaView, StyleSheet, View, useColorScheme} from 'react-native';
import {useSelector} from 'react-redux';
import NotificationList from '../components/notifications/NotificationList';
import NotificationListHeader from '../components/notifications/NotificationListHeader';
import {parseThemeColor} from '../utils';

export default function NotificationsScreen() {
  const selectedTheme = useColorScheme();
  const initialLoadComplete = useSelector(state => state.sendbird.initialLoadComplete);
  const headerSettings = useSelector(state => state.sendbird.globalSettings.themes[0].header);
  const listSettings = useSelector(state => state.sendbird.globalSettings.themes[0].list);

  return (
    <>
      <SafeAreaView style={styles.upperSafeView(headerSettings, selectedTheme)} />
      <SafeAreaView style={styles.lowerSafeView(listSettings, selectedTheme)}>
        <View style={styles.container}>
          <NotificationListHeader />
          {initialLoadComplete ? (
            <NotificationList />
          ) : (
            <View style={styles.activityIndicator}>
              <ActivityIndicator size="large" />
            </View>
          )}
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  upperSafeView: (headerSettings, selectedTheme) => ({
    flex: 0,
    backgroundColor: parseThemeColor(headerSettings.backgroundColor, selectedTheme),
  }),
  lowerSafeView: (listSettings, selectedTheme) => ({
    backgroundColor: parseThemeColor(listSettings.backgroundColor, selectedTheme),
    flex: 1,
  }),
  container: {
    height: '100%',
    alignItems: 'center',
  },
  activityIndicator: {
    margin: 0,
    padding: 0,
    position: 'absolute',
    top: '50%',
    width: '100%',
  },
});
