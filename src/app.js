import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import { WelcomeScreen } from './screens/welcome-screen'
import { ChatListScreen } from './screens/chat-list-screen'
import { ChatRoomScreen } from './screens/chat-room-screen'

const Stack = createStackNavigator();

export const routes = {
  Welcome: 'welcome',
  ChatList: 'chat-list',
  ChatRoom: 'chat-room'
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name={routes.Welcome} component={WelcomeScreen} />
        <Stack.Screen name={routes.ChatList} component={ChatListScreen} />
        <Stack.Screen name={routes.ChatRoom} component={ChatRoomScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

