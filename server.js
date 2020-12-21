require('dotenv').config()

const Twilio = require('twilio')
const faker = require('faker')
const express = require('express')

const app = express()

const AccessToken = Twilio.jwt.AccessToken
const ChatGrant = AccessToken.ChatGrant

app.get('/token', (req, res) => {
  const identity = faker.name.findName()
  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET
  );

  token.identity = identity
  token.addGrant(new ChatGrant({
    serviceSid: process.env.TWILIO_CHAT_SERVICE_SID
  }));

  res.send({
    identity: token.identity,
    jwt: token.toJwt()
  })
})

app.listen(3001, function () {
  console.log('Programmable Chat server running on port 3001!')
})