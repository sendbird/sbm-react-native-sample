import {StyleSheet, Text, View, useColorScheme} from 'react-native';
import {useSelector} from 'react-redux';
import {formatDate, parseThemeColor} from '../../../utils';

export default function NotificationLayout({label, isUnread, createdAt, children}) {
  const selectedTheme = useColorScheme();
  const notificationSettings = useSelector(state => state.sendbird.globalSettings.themes[0].notification);

  return (
    <View style={styles.wrapper}>
      <View style={styles.innerContainer}>
        <View style={styles.upperInnerContainer}>
          <Text style={styles.label(notificationSettings.label, selectedTheme)}>{label}</Text>
          <View style={styles.unreadContainer}>
            {isUnread && (
              <View style={styles.unreadIndicator(notificationSettings.unreadIndicatorColor, selectedTheme)} />
            )}

            <Text style={styles.sentAt(notificationSettings.sentAt, selectedTheme)}>{formatDate(createdAt)}</Text>
          </View>
        </View>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    paddingBottom: 16,
  },
  innerContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  upperInnerContainer: {
    marginBottom: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    lineHeight: 0,
    flexDirection: 'row',
  },
  unreadContainer: {
    flexDirection: 'row',
    alignItems:'center'
  },
  label: (theme, selectedTheme) => ({
    fontSize: theme.textSize,
    fontWeight: '700',
    color: parseThemeColor(theme.textColor, selectedTheme),
  }),
  sentAt: (theme, selectedTheme) => ({
    marginLeft: 'auto',
    fontSize: theme.textSize,
    color: parseThemeColor(theme.textColor, selectedTheme),
  }),
  unreadIndicator: (color, selectedTheme) => ({
    borderRadius: 9999,
    width: 4,
    height: 4,
    marginRight: 6,
    backgroundColor: parseThemeColor(color, selectedTheme),
  }),
});
