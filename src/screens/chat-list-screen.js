import React, { useState, useLayoutEffect, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { showMessage } from 'react-native-flash-message';

import { colors } from '../theme';
import { images } from '../assets';
import { routes } from '../app';
import { TwilioService } from '../services/twilio-service';
import { getToken } from '../services/api-service';

export function ChatListScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [channels, setChannels] = useState([]);
  const channelPaginator = useRef();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate(routes.ChatCreat.name)}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const configureChannelEvents = useCallback((client) => {
    client.on('messageAdded', (message) => {
      const lastMessageTime = message.dateCreated;
    });
    return client;
  }, []);

  const syncSubscribedChannels = useCallback(
    (client) =>
      client.getSubscribedChannels().then((paginator) => {
        channelPaginator.current = paginator;
        setChannels(TwilioService.getInstance().serializeChannels(channelPaginator.current.items));
      }),
    [setChannels],
  );

  useEffect(() => {
    setLoading(true);
    getToken()
      .then((twilioToken) => TwilioService.getInstance().getChatClient(twilioToken.token))
      .then(() => TwilioService.getInstance().addTokenListener(getToken))
      .then(configureChannelEvents)
      .then(syncSubscribedChannels)
      .catch((err) =>
        showMessage({
          message: err.message,
          type: 'danger',
        }),
      )
      .finally(() => setLoading(false));

    return () => {
      TwilioService.getInstance().clientShutdown();
    };
  }, [configureChannelEvents, syncSubscribedChannels]);

  return (
    <View style={styles.screen}>
      <FlatList
        data={channels}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate(routes.ChatRoom.name, { channelId: item.id })}>
            <Image style={styles.cardIcon} source={images.message} />
            <Text style={styles.cardText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.whisper,
  },
  addButton: {
    height: 24,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  addButtonText: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 24,
    color: colors.white,
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
    marginRight: 8,
  },
});
