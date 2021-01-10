import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FlashMessage from 'react-native-flash-message';

import { WelcomeScreen } from './screens/welcome-screen';
import { ChatListScreen } from './screens/chat-list-screen';
import { ChatRoomScreen } from './screens/chat-room-screen';
import { ChatCreateScreen } from './screens/chat-create-screen';

import { colors } from './theme';

const Stack = createStackNavigator();

export const routes = {
  Welcome: {
    name: 'welcome',
    title: 'Welcome',
  },
  ChatList: {
    name: 'chat-list',
    title: 'Chat List',
  },
  ChatRoom: {
    name: 'chat-room',
    title: 'Chat Room',
  },
  ChatCreat: {
    name: 'chat-create',
    title: 'New Channel',
  },
};

export default function App() {
  const screenOptions = (title) => ({
    title,
    headerStyle: {
      backgroundColor: colors.amaranth,
    },
    headerTintColor: colors.white,
    headerTitleStyle: {
      fontWeight: '700',
    },
  });

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name={routes.Welcome.name}
          options={screenOptions(routes.Welcome.title)}
          component={WelcomeScreen}
        />
        <Stack.Screen
          name={routes.ChatList.name}
          options={screenOptions(routes.ChatList.title)}
          component={ChatListScreen}
        />
        <Stack.Screen
          name={routes.ChatRoom.name}
          options={screenOptions(routes.ChatRoom.title)}
          component={ChatRoomScreen}
        />
        <Stack.Screen
          name={routes.ChatCreat.name}
          options={screenOptions(routes.ChatCreat.title)}
          component={ChatCreateScreen}
        />
      </Stack.Navigator>
      <FlashMessage position="bottom" />
    </NavigationContainer>
  );
}
