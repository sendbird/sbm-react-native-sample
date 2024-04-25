import {useNavigation} from '@react-navigation/native';
import {Platform, StyleSheet, Text, TouchableOpacity, View, useColorScheme} from 'react-native';
import {useSelector} from 'react-redux';
import SettingIcon from '../../assets/SettingsIcon.svg';
import {parseThemeColor} from '../../utils';

export default function NotificationListHeader() {
  const navigation = useNavigation();
  const selectedTheme = useColorScheme();
  const headerSettings = useSelector(state => state.sendbird.globalSettings.themes[0].header);

  return (
    <>
      <View style={styles.outerContainer(headerSettings, selectedTheme)}>
        <View style={styles.innerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft height={24} width={24} style={styles.image(headerSettings, selectedTheme)} />
          </TouchableOpacity>
          <Text style={styles.text(headerSettings, selectedTheme)}>Notifications</Text>
        </View>
      </View>
      <View style={styles.headerLine(headerSettings, selectedTheme)} />
    </>
  );
}

const styles = StyleSheet.create({
  outerContainer: (headerSettings, selectedTheme) => ({
    width: '100%',
    flexDirection: 'row',
    paddingTop: Platform.OS === 'android' ? 10 : 0,
    paddingBottom: 12,
    backgroundColor: parseThemeColor(headerSettings.backgroundColor, selectedTheme),
    borderBottomWidth: 1,
    borderBottomColor: parseThemeColor(headerSettings.lineColor, selectedTheme),
  }),
  innerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 10,
  },
  text: (headerSettings, selectedTheme) => ({
    fontSize: headerSettings.textSize,
    fontWeight: headerSettings.fontWeight,
    marginLeft: 8,
    color: parseThemeColor(headerSettings.textColor, selectedTheme),
  }),
  image: (headerSettings, selectedTheme) => ({
    color: parseThemeColor(headerSettings.buttonIconTintColor, selectedTheme),
  }),
  headerLine: (headerSettings, selectedTheme) => ({
    flex: 1,
    height: 1,
    maxHeight: 1,
    backgroundColor: parseThemeColor(headerSettings.lineColor, selectedTheme),
  }),
});
