import {SafeAreaView, StyleSheet, View, useColorScheme} from 'react-native';
import HomeContent from '../components/home/HomeContent';
import HomeHeader from '../components/home/HomeHeader';
import {COLORS} from '../constants';

export default function HomeScreen() {
  const selectedTheme = useColorScheme();
  return (
    <SafeAreaView style={styles.screen(selectedTheme)}>
      <View style={styles.container}>
        <HomeHeader />
        <HomeContent />
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
    alignItems: 'center',
  },
});
