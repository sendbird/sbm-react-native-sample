import {SafeAreaView, StyleSheet, View, useColorScheme} from 'react-native';
import LogoFooter from '../components/common/LogoFooter';
import HomeContent from '../components/home/HomeContent';
import HomeHeader from '../components/home/HomeHeader';
import {COLORS} from '../constants';

export default function HomeScreen() {
  const selectedTheme = useColorScheme();
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <HomeHeader />
        <HomeContent />
      </View>
      <View style={styles.footerContainer}>
        <LogoFooter />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#EEEEEE',
    flex: 1,
  },
  container: {
    height: '100%',
    padding: 24,
    alignItems: 'center',
  },
});
