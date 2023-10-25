import {StyleSheet, Text, View, useColorScheme} from 'react-native';
import {useSelector} from 'react-redux';
import {COLORS} from '../../../constants';
import {parseThemeColor} from '../../../utils';

// Text only no buttons

export default function Template04({variables}) {
  const selectedTheme = useColorScheme();
  const globalSettings = useSelector(state => state.sendbird.globalSettings.themes[0]);

  return (
    <View style={styles.wrapper(globalSettings.notification, selectedTheme)}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText(selectedTheme)}>{variables.header}</Text>
      </View>
      <View>
        <Text style={styles.bodyText(selectedTheme)}>{variables.content}</Text>
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
  bodyText: selectedTheme => ({
    fontSize: 14,
    fontWeight: '400',
    color: COLORS[selectedTheme].text,
  }),
});
