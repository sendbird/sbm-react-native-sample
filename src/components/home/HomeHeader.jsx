import {StyleSheet, Text, View} from 'react-native';

export default function HomeHeader() {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Home</Text>
      <Text style={styles.secondaryHeaderText}>Authenticated (API)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#EEEEEE',
  },
  headerText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
  },
  secondaryHeaderText: {
    marginLeft: 'auto',
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
    opacity: 0.5,
    marginTop: 8,
  },
});
