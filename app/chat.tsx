import { useContext, useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

import { UserContext } from '@/libs/Provider';
import useBatteryLevel from '@/hooks/useBatteryLevel';

interface Chat {
  nickname: string;
  battery_level: number;
  timestamp: string;
  message: string;
}

const collection = firestore().collection('chats');

export default function ChatScreen() {
  const batteryLevel = useBatteryLevel();

  const { nickname } = useContext(UserContext);

  const [chats, setChats] = useState<Chat[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    const subscriber = collection.onSnapshot((querySnapshot) => {
      const data: Chat[] = [];

      querySnapshot.forEach((docSnapshot) => {
        data.push(docSnapshot.data() as Chat);
      })

      setChats(data);
    });

    return subscriber;
  }, []);

  const handleSendMessage = useCallback(async () => {
    // TODO 유효성 검사
    if (!currentMessage) {
      return;
    }

    await collection.add({
      nickname,
      battery_level: batteryLevel,
      timestamp: new Date().toISOString(),
      message: currentMessage,
    });

    setCurrentMessage('');
  }, [currentMessage]);

  return (
    <View style={styles.container}>
      {chats.map((chat) => (
        <View key={chat.timestamp} style={styles.messageBox}>
          <Text>nickname: {chat.nickname}</Text>
          <Text>battery_level: {chat.battery_level}</Text>
          <Text>timestamp: {chat.timestamp}</Text>
          <Text>message: {chat.message}</Text>
        </View>
      ))}
      <TextInput
        value={currentMessage}
        placeholder="메세지를 입력해"
        onChangeText={(message) => setCurrentMessage(message)}
      />
      <Button
        title="전송"
        onPress={handleSendMessage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageBox: {
    marginVertical: 10,
    backgroundColor: 'pink'
  },
});
