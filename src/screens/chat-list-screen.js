import React from 'react'
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native'

import { colors } from '../theme'
import { images } from '../assets'
import { routes } from '../app'

const CHANNEL_LIST = Array(7).fill(null).map((_, idx) => idx)

export function ChatListScreen({ navigation }) {
  return (
    <View style={styles.screen}>
      <FlatList
        data={CHANNEL_LIST}
        contentContainerStyle={{ width: '100%' }}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate(routes.ChatRoom.name)}>
            <Image style={styles.cardIcon} source={images.message} />
            <Text style={styles.cardText}>Channel {item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.whisper,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.windsor,
    backgroundColor: colors.white,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 1,
    borderRadius: 10,
    marginHorizontal: 12,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cardIcon: {
    height: 44,
    width: 44,
  },
  cardText: {
    fontSize: 16,
    color: colors.cinder,
    marginLeft: 24,
    marginRight: 8
  }
})