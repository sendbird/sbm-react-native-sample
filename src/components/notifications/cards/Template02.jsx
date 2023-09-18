import {StyleSheet, Text, TouchableOpacity, View, useColorScheme} from 'react-native';
import {useCallback} from 'react';
import {useSelector} from 'react-redux';
import {COLORS} from '../../../constants';
import {parseThemeColor} from '../../../utils';

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
        <TouchableOpacity
          onPress={() => handleButtonClick('left')}
          style={styles.leftButton(globalSettings.components.textButton, selectedTheme)}>
          <Text style={styles.buttonText(globalSettings.components.textButton, selectedTheme)}>
            {variables.left_button_text}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleButtonClick('right')}
          style={styles.rightButton(globalSettings.components.textButton, selectedTheme)}>
          <Text style={styles.buttonText(globalSettings.components.textButton, selectedTheme)}>
            {variables.right_button_text}
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
    flexDirection: 'row',
  },
  leftButton: (theme, selectedTheme) => ({
    height: 48,
    flex: 1,
    backgroundColor: parseThemeColor(theme.backgroundColor, selectedTheme),
    borderRadius: theme.radius,
    justifyContent: 'center',
    alignItems: 'center',
  }),
  rightButton: (theme, selectedTheme) => ({
    height: 48,
    flex: 1,
    marginLeft: 8,
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
