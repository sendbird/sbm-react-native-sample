import {Image, StyleSheet, View} from 'react-native';

export default function LoginFooter() {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require('../../assets/sendbird_logo.png')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    width: '100%',
    paddingBottom: 24,
  },
  image: {
    height: 16,
    width: 94,
  },
});
