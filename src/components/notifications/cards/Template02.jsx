import {useCallback} from 'react';
import {StyleSheet, Text, View, useColorScheme} from 'react-native';
import {useSelector} from 'react-redux';
import {COLORS} from '../../../constants';
import {parseThemeColor} from '../../../utils';
import NotificationButton from './common/NotificationButton';

// Text only with 2 buttons

export default function Template02({variables}) {
  const selectedTheme = useColorScheme();
  const globalSettings = useSelector(state => state.sendbird.globalSettings.themes[0]);

  const handleButtonClick = useCallback(
    async side => {
      try {
        const type = variables[`${side}_button_action.type`];
        const data = variables[`${side}_button_action.data`];

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
    },
    [variables],
  );

  return (
    <View style={styles.wrapper(globalSettings.notification, selectedTheme)}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText(selectedTheme)}>{variables.header}</Text>
      </View>
      <View style={styles.bodyContainer}>
        <Text style={styles.bodyText(selectedTheme)}>{variables.content}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <NotificationButton onPress={() => handleButtonClick('left')} text={variables.left_button_text} />
        <NotificationButton
          onPress={() => handleButtonClick('right')}
          text={variables.right_button_text}
          style={styles.rightButton}
        />
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
    flexDirection: 'row',
  },
  rightButton: {
    marginLeft: 8,
  },
});
