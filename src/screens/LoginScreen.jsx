import {SafeAreaView, StyleSheet, View} from 'react-native';
import LogoFooter from '../components/common/LogoFooter';
import LoginForm from '../components/login/LoginForm';
import LoginHeader from '../components/login/LoginHeader';

export default function LoginScreen() {
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
