import {Image, StyleSheet, Text, View, useColorScheme} from 'react-native';

import {COLORS} from '../../constants/theme';

export default function LoginHeader() {
  const selectedTheme = useColorScheme();
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/notificationsLogo.png')} />
      <Text style={styles.text(selectedTheme)}>React Native Sample App</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  text: selectedTheme => ({
    height: 24,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    marginTop: 4,
    marginBottom: 22,
    opacity: 0.88,
    color: COLORS[selectedTheme].text,
  }),
});
