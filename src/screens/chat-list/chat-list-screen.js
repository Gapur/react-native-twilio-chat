import React, { useState, useLayoutEffect, useEffect, useCallback, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { showMessage } from 'react-native-flash-message';

import { colors } from '../../theme';
import { routes } from '../../app';
import { TwilioService } from '../../services/twilio-service';
import { getToken } from '../../services/api-service';
import { ChatListLoader } from './components/chat-list-loader';
import { ChatListEmpty } from './components/chat-list-empty';
import { ChatListItem } from './components/chat-list-item';

export function ChatListScreen({ navigation, route }) {
  const { username } = route.params;
  const [loading, setLoading] = useState(true);
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
      setChannels((prevChannels) =>
        prevChannels.map((channel) =>
          channel.id === message.channel.sid ? { ...channel, lastMessageTime: message.dateCreated } : channel,
        ),
      );
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
    getToken(username)
      .then((twilioUser) => TwilioService.getInstance().getChatClient(twilioUser.data.jwt))
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
  }, [username, configureChannelEvents, syncSubscribedChannels]);

  const sortedChannels = useMemo(
    () => channels.sort((channelA, channelB) => channelB.lastMessageTime - channelA.lastMessageTime),
    [channels],
  );

  return (
    <View style={styles.screen}>
      {loading ? (
        <ChatListLoader />
      ) : (
        <FlatList
          data={sortedChannels}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatListItem
              channel={item}
              onPress={() => navigation.navigate(routes.ChatRoom.name, { channelId: item.id, identity: username })}
            />
          )}
          ListEmptyComponent={<ChatListEmpty />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.snow,
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
});
