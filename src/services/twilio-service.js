import { Client } from 'twilio-chat';

export class TwilioService {
  static serviceInstance;
  static chatClient;

  constructor() {}

  static getInstance() {
    if (!TwilioService.serviceInstance) {
      TwilioService.serviceInstance = new TwilioService();
    }
    return TwilioService.serviceInstance;
  }

  async getChatClient(twilioToken) {
    if (!TwilioService.chatClient && !twilioToken) {
      throw new Error('Twilio token is null or undefined');
    }
    if (!TwilioService.chatClient && twilioToken) {
      return Client.create(twilioToken).then((client) => {
        TwilioService.chatClient = client;
        return TwilioService.chatClient;
      });
    }
    return Promise.resolve().then(() => TwilioService.chatClient);
  }

  clientShutdown() {
    TwilioService.chatClient?.shutdown();
  }

  addTokenListener(getToken) {
    if (!TwilioService.chatClient) {
      throw new Error('Twilio client is null or undefined');
    }
    TwilioService.chatClient.on('tokenAboutToExpire', () => {
      getToken().then((twilioUser) => {
        TwilioService.chatClient.updateToken(twilioUser.data.jwt);
      });
    });

    TwilioService.chatClient.on('tokenExpired', () => {
      getToken().then((twilioUser) => {
        TwilioService.chatClient.updateToken(twilioUser.data.jwt);
      });
    });
    return TwilioService.chatClient;
  }

  serializeChannels(channels) {
    return channels.map(this.serializeChannel);
  }

  serializeChannel(channel) {
    return {
      id: channel.sid,
      name: channel.friendlyName,
      createdAt: channel.dateCreated,
      updatedAt: channel.dateUpdated,
      lastMessageTime: channel.lastMessage?.dateCreated ?? channel.dateUpdated ?? channel.dateCreated,
    };
  }

  serializeMessages(messages) {
    return messages.map(this.serializeMessage).reverse();
  }

  serializeMessage(message) {
    return {
      _id: message.sid,
      text: message.body,
      createdAt: message.dateCreated,
      user: {
        _id: message.memberSid,
        name: message.author,
      },
      received: true,
    };
  }
}
