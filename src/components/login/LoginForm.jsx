import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {initSendbird} from '../../redux/slices/sendbird';

import {APP_ID, COLORS, TOKEN, USER_ID} from '../../constants';

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [state, setState] = useState({
    appId: APP_ID,
    userId: USER_ID,
    token: TOKEN,
    isLoading: false,
  });

  const handleTextChange = (element, text) => {
    setState({
      ...state,
      [element]: text,
    });
  };

  const handleLogin = async () => {
    try {
      setState({
        ...state,
        isLoading: true,
      });
      dispatch(initSendbird(state))
        .unwrap()
        .then(() => {
          setState({
            ...state,
            isLoading: false,
          });
        });
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
      });
      console.log(error);
    }
  };

  useEffect(() => {
    AsyncStorage.getItem('loginInformation').then(data => {
      if (data) {
        setState({
          ...state,
          isLoading: true,
        });
        dispatch(initSendbird(JSON.parse(data)))
          .unwrap()
          .then(() => {
            setState({
              ...state,
              isLoading: false,
            });
            navigation.navigate('Home');
          });
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        value={state.appId}
        autoCapitalize="none"
        onChangeText={text => handleTextChange('appId', text)}
        placeholder="Application ID"
        placeholderTextColor="#00000050"
      />
      <TextInput
        style={styles.textInput}
        autoCapitalize="none"
        value={state.userId}
        onChangeText={text => handleTextChange('userId', text)}
        placeholder="User ID"
        placeholderTextColor="#00000050"
      />
      <TextInput
        style={styles.textInput}
        autoCapitalize="none"
        value={state.token}
        onChangeText={text => handleTextChange('token', text)}
        placeholder="Token (Optional)"
        placeholderTextColor="#00000050"
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        {state.isLoading ? <ActivityIndicator /> : <Text style={styles.buttonText}>Sign In</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  textInput: {
    borderRadius: 4,
    marginBottom: 16,
    backgroundColor: '#EEEEEE',
    width: '100%',
    height: 56,
    maxHeight: 56,
    paddingHorizontal: 16,
  },
  button: {
    width: '100%',
    height: 48,
    backgroundColor: COLORS.purple,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 24,
  },
});
