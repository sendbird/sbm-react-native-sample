import {SafeAreaView, StyleSheet, View, useColorScheme} from 'react-native';
import LoginFooter from '../components/login/LoginFooter';
import LoginForm from '../components/login/LoginForm';
import LoginHeader from '../components/login/LoginHeader';
import {COLORS} from '../constants';

export default function LoginScreen() {
  const selectedTheme = useColorScheme();
  return (
    <SafeAreaView style={styles.screen(selectedTheme)}>
      <View style={styles.container}>
        <LoginHeader />
        <LoginForm />
      </View>
      <View style={styles.footerContainer}>
        <LoginFooter />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: selectedTheme => ({
    backgroundColor: COLORS[selectedTheme].background,
    flex: 1,
  }),
  container: {
    height: '100%',
    padding: 24,
  },
  footerContainer: {
    width: '100%',
  },
});
