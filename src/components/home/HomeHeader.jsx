import {StyleSheet, Text, View, useColorScheme} from 'react-native';
import {COLORS} from '../../constants';

export default function HomeHeader() {
  const selectedTheme = useColorScheme();
  return (
    <View style={styles.container}>
      <Text style={styles.headerText(selectedTheme)}>Home</Text>
      <Text style={styles.secondaryHeaderText(selectedTheme)}>Authenticated (API)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#EEEEEE',
  },
  headerText: selectedTheme => ({
    fontSize: 24,
    fontWeight: '700',
    color: COLORS[selectedTheme].text,
  }),
  secondaryHeaderText: selectedTheme => ({
    marginLeft: 'auto',
    fontSize: 16,
    fontWeight: '400',
    color: COLORS[selectedTheme].text,
    opacity: 0.5,
    marginTop: 8,
  }),
});
