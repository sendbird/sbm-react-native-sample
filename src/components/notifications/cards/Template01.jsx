import {useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';
import {Linking, StyleSheet, Text, TouchableOpacity, View, useColorScheme} from 'react-native';
import {useSelector} from 'react-redux';
import {COLORS} from '../../../constants';
import {parseThemeColor} from '../../../utils';

// Text only with one button

export default function Template01({variables}) {
  const selectedTheme = useColorScheme();
  const navigation = useNavigation();
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
        <TouchableOpacity
          onPress={handleButtonClick}
          style={styles.button(globalSettings.components.textButton, selectedTheme)}>
          <Text style={styles.buttonText(globalSettings.components.textButton, selectedTheme)}>
            {variables.button_text}
          </Text>
        </TouchableOpacity>
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
  button: (theme, selectedTheme) => ({
    width: '100%',
    height: 48,
    backgroundColor: parseThemeColor(theme.backgroundColor, selectedTheme),
    borderRadius: theme.radius,
    justifyContent: 'center',
    alignItems: 'center',
  }),
  buttonText: (theme, selectedTheme) => ({
    color: parseThemeColor(theme.textColor, selectedTheme),
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
  }),
});
