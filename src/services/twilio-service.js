import { Client } from 'twilio-chat'

export class TwilioService {
  static serviceInstance
  static chatClient

  constructor() {}

  static getInstance() {
    if (!TwilioService.serviceInstance) {
      TwilioService.serviceInstance = new TwilioService()
    }
    return TwilioService.serviceInstance
  }

  async getChatClient(twilioToken) {
    if (!TwilioService.chatClient && !twilioToken) {
      throw new Error('Twilio token is null or undefined')
    }
    if (!TwilioService.chatClient && twilioToken) {
      return Client.create(twilioToken).then((client) => {
        TwilioService.chatClient = client
        return TwilioService.chatClient
      })
    }
    return Promise.resolve().then(() => TwilioService.chatClient)
  }

  clientShutdown() {
    TwilioService.chatClient?.shutdown()
  }

  addTokenListener(getToken) {
    if (!TwilioService.chatClient) {
      throw new Error('Twilio client is null or undefined')
    }
    TwilioService.chatClient.on('tokenAboutToExpire', () => {
      getToken().then(({ token }) => {
        TwilioService.chatClient.updateToken(token)
      })
    })

    TwilioService.chatClient.on('tokenExpired', () => {
      getToken().then(({ token }) => {
        TwilioService.chatClient.updateToken(token)
      })
    }) 
    return TwilioService.chatClient
  }
}