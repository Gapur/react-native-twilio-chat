import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import { colors } from '../theme'

export function ChatListScreen() {
  return (
    <View style={styles.container}>
      <Text>Chat List Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.whisper,
  },
})