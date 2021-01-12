import React, { useState, useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { showMessage } from 'react-native-flash-message';

import { colors } from '../../theme';
import { TwilioService } from '../../services/twilio-service';
import { ChatLoader } from './components/chat-loader';

export function ChatRoomScreen({ route }) {
  const { channelId } = route.params;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const chatClientChannel = useRef();
  const chatMessagesPaginator = useRef();

  const configureChannelEvents = useCallback((channel) => {
    chatClientChannel.current = channel;
    chatClientChannel.current.on('messageAdded', (message) => {
      const serializedMessage = TwilioService.getInstance().serializeMessage(message);
      const { giftedId } = message.attributes;
      if (giftedId) {
        setMessages((prevMessages) => prevMessages.map((m) => (m._id === giftedId ? serializedMessage : m)));
      } else {
        setMessages((prevMessages) => [serializedMessage, ...prevMessages]);
      }
    });
    return chatClientChannel.current;
  }, []);

  useEffect(() => {
    TwilioService.getInstance()
      .getChatClient()
      .then((client) => client.getChannelBySid(channelId))
      .then((channel) => configureChannelEvents(channel))
      .then((currentChannel) => currentChannel.getMessages())
      .then((paginator) => {
        chatMessagesPaginator.current = paginator;
        const serializedMessages = TwilioService.getInstance().serializeMessages(paginator.items);
        setMessages(serializedMessages);
      })
      .catch((err) =>
        showMessage({
          message: err.message,
          type: 'danger',
        }),
      )
      .finally(() => setLoading(false));
  }, [channelId, configureChannelEvents]);

  const onSend = useCallback((newMessages = []) => {
    const attributes = { giftedId: newMessages[0]._id };
    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
    chatClientChannel.current?.sendMessage(newMessages[0].text, attributes);
  }, []);

  return (
    <View style={styles.screen}>
      {loading ? (
        <ChatLoader />
      ) : (
        <GiftedChat
          messagesContainerStyle={styles.messageContainer}
          messages={messages}
          renderAvatarOnTop
          onSend={(messages) => onSend(messages)}
          user={{
            _id: 'Gapur',
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    backgroundColor: colors.white,
  },
  messageContainer: {
    backgroundColor: colors.whisper,
  },
});
