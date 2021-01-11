import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image } from 'react-native';
import { showMessage } from 'react-native-flash-message';

import { colors } from '../theme';
import { routes } from '../app';
import { images } from '../assets';
import { TwilioService } from '../services/twilio-service';
import { getToken } from '../services/api-service';
import { LoadingOverlay } from '../components';

export function WelcomeScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const onPress = () => {
    setLoading(true);
    getToken(username)
      .then((twilioUser) => TwilioService.getInstance().getChatClient(twilioUser.data.jwt))
      .then(() => TwilioService.getInstance().addTokenListener(getToken))
      .then(() => navigation.navigate(routes.ChatList.name))
      .catch((err) =>
        showMessage({
          message: err.message,
          type: 'danger',
        }),
      )
      .finally(() => setLoading(false));
  };

  return (
    <View style={styles.screen}>
      <Image style={styles.logo} source={images.logo} />
      <Text style={styles.titleText}>Welcome to Twilio Chat</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        placeholder="Username"
        placeholderTextColor={colors.ghost}
      />
      <TouchableOpacity disabled={!username} style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      {loading && <LoadingOverlay />}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.whisper,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 32,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.amaranth,
  },
  input: {
    width: 280,
    height: 50,
    padding: 12,
    fontSize: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.eclipse,
    marginTop: 32,
    marginBottom: 16,
  },
  button: {
    width: 280,
    height: 50,
    backgroundColor: colors.malibu,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 17,
    color: colors.white,
  },
});
