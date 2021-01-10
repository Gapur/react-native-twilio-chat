import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { showMessage } from 'react-native-flash-message'

import { colors } from '../theme'
import { images } from '../assets'
import { TwilioService } from '../services/twilio-service'

export function ChatCreateScreen({ navigation }) {
  const [channelName, setChannelName] = useState("")

  const onPress = () => TwilioService.getInstance().getChatClient()
    .then((client) => client.getChannelByUniqueName(channelName)
      .then((channel) => {
        if (channel.channelState.status !== 'joined') {
          return channel.join()
        } else {
          throw new Error('You are already joined.')
        }
      })
      .catch((err) => {
        if (err.message === 'Not Found') {
          return client
            .createChannel({ uniqueName: channelName, friendlyName: channelName })
            .then(channel => channel.join())
        }
        showMessage({
          message: err.message,
          type: 'danger'
        })
      }))
    .then(() => navigation.goBack())

  return (
    <View style={styles.screen}>
      <Image style={styles.logo} source={images.message} />
      <TextInput
        value={channelName}
        onChangeText={setChannelName}
        style={styles.input}
        placeholder="Channel Name"
        placeholderTextColor={colors.ghost}
      />
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>Create</Text>
      </TouchableOpacity>
    </View>
  )
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
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 17,
    color: colors.white
  }
});