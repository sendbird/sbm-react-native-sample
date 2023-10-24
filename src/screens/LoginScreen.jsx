import {SafeAreaView, StyleSheet, View, useColorScheme} from 'react-native';
import LogoFooter from '../components/common/LogoFooter';
import LoginForm from '../components/login/LoginForm';
import LoginHeader from '../components/login/LoginHeader';
import {COLORS} from '../constants';

export default function LoginScreen() {
  const selectedTheme = useColorScheme();
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <LoginHeader />
        <LoginForm />
      </View>
      <View style={styles.footerContainer}>
        <LogoFooter />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  container: {
    height: '100%',
    padding: 24,
  },
  footerContainer: {
    width: '100%',
  },
});
