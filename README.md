<h1 align="center">
  <img src="https://github.com/Gapur/react-native-twilio-chat/blob/master/src/assets/twilio-logo.png" />
  <br/>
  React Native Twilio Chat
</h1>

<p align="center">
  <img width="600"src="https://github.com/Gapur/react-native-twilio-chat/blob/master/src/assets/example.gif">
</p>

Build a Chat App with Twilio and React-Native

Best Practices Using Twilio Programmable Chat

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

<p align="center">
  <img width="800"src="https://github.com/Gapur/react-native-twilio-chat/blob/master/src/assets/account_sid.png">
</p>

Next, We need to generate an API key and API secret by navigating to Settings > API Keys > New API Key.

<p align="center">
  <img width="800"src="https://github.com/Gapur/react-native-twilio-chat/blob/master/src/assets/new_api_key.png">
</p>

If you create these things successfully, let’s copy and paste the SID and secret as the values TWILIO_API_KEY and TWILIO_API_SECRET.

<p align="center">
  <img width="800"src="https://github.com/Gapur/react-native-twilio-chat/blob/master/src/assets/sid_and_secret_key.png">
</p>

Last, we need to create a new Chat Service by navigating to All Products & Services > Programmable Chat > Services > Chat Services.

<p align="center">
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

## How to contribute?

1. Fork this repo
2. Clone your fork
3. Code 🤓
4. Test your changes
5. Submit a PR!
