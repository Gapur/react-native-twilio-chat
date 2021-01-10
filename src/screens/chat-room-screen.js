import React, { useState, useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { showMessage } from 'react-native-flash-message';

import { colors } from '../theme';
import { TwilioService } from '../services/twilio-service';

export function ChatRoomScreen({ route }) {
  const { channelId } = route.params;
  const [messages, setMessages] = useState([]);
  const chatClientChannel = useRef();
  const chatMessagesPaginator = useRef();

  const configureChannelEvents = useCallback((channel) => {
    chatClientChannel.current = channel;
    chatClientChannel.current.on('messageAdded', (message) => {
      console.log('new message', message);
      const serializedMessage = TwilioService.getInstance().serializeMessage(message);
      const { giftedId } = serializedMessage.attributes;
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
      );
  }, [channelId, configureChannelEvents]);

  const onSend = useCallback((newMessages = []) => {
    const attributes = { giftedId: newMessages[0]._id };
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
    chatClientChannel.current?.sendMessage(newMessages[0].text, attributes);
  }, []);

  console.log('message', messages);

  return (
    <View style={styles.screen}>
      <GiftedChat
        messagesContainerStyle={styles.messageContainer}
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
        }}
      />
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
