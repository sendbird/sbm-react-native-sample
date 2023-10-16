import {StyleSheet, Text, TouchableOpacity, useColorScheme} from 'react-native';
import {useSelector} from 'react-redux';
import {parseThemeColor} from '../../../../utils';

export default function NotificationButton({onPress, style, text}) {
  const selectedTheme = useColorScheme();
  const globalSettings = useSelector(state => state.sendbird.globalSettings.themes[0]);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[style, styles.wrapper(globalSettings.components.textButton, selectedTheme)]}>
      <Text
        style={styles.text(globalSettings.components.textButton, selectedTheme)}
        ellipsizeMode="tail"
        numberOfLines={2}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: (theme, selectedTheme) => ({
    height: 48,
    flex: 1,
    backgroundColor: parseThemeColor(theme.backgroundColor, selectedTheme),
    borderRadius: theme.radius,
    justifyContent: 'center',
    alignItems: 'center',
  }),
  text: (theme, selectedTheme) => ({
    color: parseThemeColor(theme.textColor, selectedTheme),
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
  }),
});
