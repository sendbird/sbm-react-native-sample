import {useCallback} from 'react';
import {Linking, StyleSheet, Text, View, useColorScheme} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS} from '../../../constants';
import {markButtonAsClicked} from '../../../redux/slices/sendbird';
import {parseThemeColor} from '../../../utils';
import NotificationButton from './common/NotificationButton';

// Text only with one button

export default function Template01({notification}) {
  const selectedTheme = useColorScheme();
  const dispatch = useDispatch();
  const globalSettings = useSelector(state => state.sendbird.globalSettings.themes[0]);
  const variables = notification.notificationData.templateVariables;

  const handleButtonClick = useCallback(async () => {
    try {
      const type = variables['button_action.type'];
      const data = variables['button_action.data'];
      dispatch(markButtonAsClicked(notification));

      if (type === 'web') {
        const supported = await Linking.canOpenURL(data);
        if (supported) {
          await Linking.openURL(data);
        }
      }

      if (type === 'custom') {
        // do something custom
      }
    } catch (error) {
      console.log('Error opening link');
      console.log(error);
    }
  }, [variables]);

  return (
    <View style={styles.wrapper(globalSettings.notification, selectedTheme)}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText(selectedTheme)}>{variables.header}</Text>
      </View>
      <View style={styles.bodyContainer}>
        <Text style={styles.bodyText(selectedTheme)}>{variables.content}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <NotificationButton onPress={handleButtonClick} text={variables.button_text} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: (theme, selectedTheme) => ({
    width: '100%',
    backgroundColor: parseThemeColor(theme.backgroundColor, selectedTheme),
    padding: 12,
    borderRadius: 8,
  }),
  headerContainer: {
    paddingBottom: 6,
  },
  headerText: selectedTheme => ({
    fontSize: 16,
    fontWeight: '700',
    color: COLORS[selectedTheme].text,
  }),
  bodyContainer: {
    paddingBottom: 16,
  },
  bodyText: selectedTheme => ({
    fontSize: 14,
    fontWeight: '400',
    color: COLORS[selectedTheme].text,
  }),
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});
