<h1 align="center">
  <img src="https://github.com/Gapur/react-native-twilio-chat/blob/master/src/assets/twilio-logo.png" />
  <br/>
  React Native Twilio Chat
</h1>

Build a Twilio-Powered Chat App Using React Native

Quickly get started with a Twilio Programmable Chat

Twilio Programmable Chat makes it easy for you to add chat features into your web and mobile apps without building or scaling a real-time chat backend. Chat has all the necessary APIs and features to integrate with your business logic to ensure you are in control.

I wanted to build a quick, full-featured chat feature for my React Native app. I managed to do it with [Twilio Programmable Chat](https://www.twilio.com/docs/chat).

I searched the internet a lot to find the best way to use Twilio Programmable Chat with React Native. Unfortunately, I couldn’t find much. So I decided to write an article about it, hopefully saving others some time.

## Setting up the Project

Install the repository:
```sh
git clone https://github.com/Gapur/react-native-twilio-chat.git
```

After that, move it into the react-native-twilio-chat directory and run it from the terminal:
```
cd react-native-twilio-chat
npm run ios
```

## Creating Our Server

Before we get started, We need to generate an access token to authorize the React Native app to communicate with the Programmable Twilio Chat.
To set up our backend for Chat, we’ll need four values from our Twilio account. We’ll store these in our .env file:
- Service instance SID—a service instance where all the data for our application is stored and scoped
- Account SID — your primary Twilio account identifier
- API key — used to authenticate
- API secret — used to authenticate

Now, if your account is ready, you can find your account SID on the [Twilio Console](https://www.twilio.com/console). You should copy and paste it as the value TWILIO_ACCOUNT_SID to the .env file.

<p>
  <img width="800"src="https://github.com/Gapur/react-native-twilio-chat/blob/master/src/assets/account_sid.png">
</p>

Next, We need to generate an API key and API secret by navigating to Settings > API Keys > New API Key.

<p>
  <img width="800"src="https://github.com/Gapur/react-native-twilio-chat/blob/master/src/assets/new_api_key.png">
</p>

If you create these things successfully, let’s copy and paste the SID and secret as the values TWILIO_API_KEY and TWILIO_API_SECRET.

<p>
  <img width="800"src="https://github.com/Gapur/react-native-twilio-chat/blob/master/src/assets/sid_and_secret_key.png">
</p>

Last, we need to create a new Chat Service by navigating to All Products & Services > Programmable Chat > Services > Chat Services.

<p>
  <img width="800"src="https://github.com/Gapur/react-native-twilio-chat/blob/master/src/assets/chat_service.png">
</p>

Let’s copy and paste the service SID as the value TWILIO_CHAT_SERVICE_SID.

Finally, our .env file should look like this:
```js
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_API_KEY=your_api_key
TWILIO_API_SECRET=your_api_secret
TWILIO_CHAT_SERVICE_SID=your_chat_service_sid
```

When our .env is ready, we can create a simple server with a single GET route, /token/:identity. This route will request and return a token from TWILIO. Let’s install dependencies for our server:

```sh
yarn add express dotenv twilio
```

Create our server.js:
```js
require('dotenv').config();

const Twilio = require('twilio');
const express = require('express');

const app = express();

const AccessToken = Twilio.jwt.AccessToken;
const ChatGrant = AccessToken.ChatGrant;

app.get('/token/:identity', (req, res) => {
  const identity = req.params.identity;
  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET,
  );

  token.identity = identity;
  token.addGrant(
    new ChatGrant({
      serviceSid: process.env.TWILIO_CHAT_SERVICE_SID,
    }),
  );

  res.send({
    identity: token.identity,
    jwt: token.toJwt(),
  });
});

app.listen(3001, function () {
  console.log('Programmable Chat server running on port 3001!');
});
```

That’s it for our server. Now, We can run our server with the following command line:
```sh
node server.js
```

## React Native Navigation

In order to show you the Twilio Programmable Chat in action, I’m going to build a full-featured app on React Native. Our app will have four screens: WelcomeScreen, ChatListScreen, ChatRoomScreen, and ChatCreateScreen.

We need a router to navigate between screens in our React Native app. So I’m going to use the react-native-navigation library. React Native Navigation provides 100% native-platform navigation on both iOS and Android. We should install it with the required packages:

```sh
yarn add @react-navigation/native react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view @react-navigation/stack
```

## Welcome Screen

We’ll start with the welcome screen. Let’s create welcome-screen.js and add the following code:

```js
export function WelcomeScreen({ navigation }) {
  const [username, setUsername] = useState('');

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
      <TouchableOpacity
        disabled={!username}
        style={styles.button}
        onPress={() => navigation.navigate(routes.ChatList.name, { username })}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}
```

We’ll use the username to generate the Twilio access token.

<p>
  <img width="800"src="https://github.com/Gapur/react-native-twilio-chat/blob/master/src/assets/welcome-screen.png">
</p>

## Chat-Create Screen

The next step is to create a chat client which is what we needed the token for. I’m going to use twilio-chat to connect and work with the [Twilio SDK](http://media.twiliocdn.com/sdk/js/chat/releases/4.0.0/docs/index.html). Let’s install and test it:

```sh
yarn add twilio-chat events
```

Then, we’ll create a getToken method for handling communication with our token server.

```js
const getToken = (username) =>
  axios.get(`http://localhost:3001/token/${username}`).then((twilioUser) => twilioUser.data.jwt);
```

Now, we should create the Twilio Chat Client instance with a token by calling [create(token)](http://media.twiliocdn.com/sdk/js/chat/releases/4.0.0/docs/Client.html#.create__anchor). Also, we have two events to help manage our token expiration: tokenAboutToExpire and tokenExpired.

Let’s create a twilio-service.js file to prevent the repeat initializing of the Twilio Chat Client across all screens. We’ll create and store a single Twilio service client instance and use it on each screen.

```js
import { Client } from 'twilio-chat';

export class TwilioService {
  static serviceInstance;
  static chatClient;

  // create a single service instance
  static getInstance() {
    if (!TwilioService.serviceInstance) {
      TwilioService.serviceInstance = new TwilioService();
    }
    return TwilioService.serviceInstance;
  }

  // use chat client if don't have instance, create a new chat client
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

  // manage our token expiration
  addTokenListener(getToken) {
    if (!TwilioService.chatClient) {
      throw new Error('Twilio client is null or undefined');
    }
    TwilioService.chatClient.on('tokenAboutToExpire', () => {
      getToken().then(TwilioService.chatClient.updateToken);
    });

    TwilioService.chatClient.on('tokenExpired', () => {
      getToken().then(TwilioService.chatClient.updateToken);
    });
    return TwilioService.chatClient;
  }
  
  // gracefully shutting down library instance.
  clientShutdown() {
    TwilioService.chatClient?.shutdown();
    TwilioService.chatClient = null;
  }
}
```

Last, I’ll create chat-create-screen.js with the following code:

```js
export function ChatCreateScreen() {
  const [channelName, setChannelName] = useState('');
  const [loading, setLoading] = useState(false);

  const onCreateOrJoin = () => {
    setLoading(true);
    TwilioService.getInstance()
      .getChatClient()
      .then((client) =>
        client
          .getChannelByUniqueName(channelName)
          .then((channel) => (channel.channelState.status !== 'joined' ? channel.join() : channel))
          .catch(() =>
            client.createChannel({ uniqueName: channelName, friendlyName: channelName }).then((channel) => channel.join()),
          ),
      )
      .then(() => showMessage({ message: 'You have joined.' }))
      .catch((err) => showMessage({ message: err.message, type: 'danger' }))
      .finally(() => setLoading(false));
  };

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
      <TouchableOpacity style={styles.button} onPress={onCreateOrJoin}>
        <Text style={styles.buttonText}>Create Or Join</Text>
      </TouchableOpacity>
      {loading && <LoadingOverlay />}
    </View>
  );
}
```

Once the chat client is initialized, we can create a new chat channel with [createChannel({ uniqueName, friendlyName })](http://media.twiliocdn.com/sdk/js/chat/releases/4.0.0/docs/Client.html#createChannel__anchor) or join an existing channel with the join() method. To join an existing channel, we have to get the channel from Twilio by using the [getChannelByUniqueName()](http://media.twiliocdn.com/sdk/js/chat/releases/4.0.0/docs/Client.html#getChannelByUniqueName__anchor) method and passing the room name to it.

If the channel doesn’t exist, an exception will be thrown. If it does exist, the method will return the channel resource, and from there, the channel can be joined.

<p align="center">
  <img width="600"src="https://github.com/Gapur/react-native-twilio-chat/blob/master/src/assets/chat-create-screen.gif">
</p>

## Let’s Demo Our Twilio Chat App

<p align="center">
  <img width="600"src="https://github.com/Gapur/react-native-twilio-chat/blob/master/src/assets/example.gif">
</p>

## How to contribute?

1. Fork this repo
2. Clone your fork
3. Code 🤓
4. Test your changes
5. Submit a PR!
