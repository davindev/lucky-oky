import {
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { router } from 'expo-router';

import { UserContext } from '@/libs/Provider';
import useBatteryLevel from '@/hooks/useBatteryLevel';
import { MAX_BATTERY_LEVEL } from '@/constants/Battery';

const collection = firestore().collection('chats');

interface Chat {
  user_id: number;
  user_nickname: string;
  battery_level: number;
  timestamp: string;
  message: string;
}

export default function ChatScreen() {
  const { id: userId, nickname: userNickname } = useContext(UserContext);

  const batteryLevel = useBatteryLevel();

  const [chats, setChats] = useState<Chat[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');

  // 배터리 잔량 확인
  useEffect(() => {
    if (batteryLevel > MAX_BATTERY_LEVEL) {
      Alert.alert(
        '배터리가 충전됐어~! 완전 최고야! ⚡️💖',
        `배터리가 ${MAX_BATTERY_LEVEL}% 이하가 되면 다시 와줘~! 기다리고 있을게~! 🌟💖`,
        [{ text: '알겠어~! 😊💖', onPress: () => router.push('/') }],
      );
    }
  }, [batteryLevel]);

  // firestore 변경 사항 구독
  useEffect(() => {
    const subscriber = collection.onSnapshot((querySnapshot) => {
      const docs: Chat[] = [];

      querySnapshot.forEach((docSnapshot) => {
        const chat = docSnapshot.data() as Chat;
        docs.push(chat);
      });

      setChats(docs);
    });

    return subscriber;
  }, []);

  const handleSendMessage = useCallback(async () => {
    await collection.add({
      user_id: userId,
      user_nickname: userNickname,
      battery_level: batteryLevel,
      timestamp: new Date().toISOString(),
      message: currentMessage,
    });

    setCurrentMessage('');
  }, [userId, userNickname, batteryLevel, currentMessage]);

  return (
    <View style={styles.container}>
      <Button
        title="홈으로 이동할게~! 🏡💖"
        onPress={router.back}
      />
      {chats.map((chat) => (
        <View key={`${chat.user_id}${chat.timestamp}`} style={[styles.chatBox, chat.user_id === userId ? styles.myChatBox : null]}>
          <Text>nickname: {chat.user_nickname}#{chat.user_id}</Text>
          <Text>battery_level: {chat.battery_level}</Text>
          <Text>timestamp: {chat.timestamp}</Text>
          <Text>message: {chat.message}</Text>
        </View>
      ))}
      <TextInput
        value={currentMessage}
        placeholder="메세지를 입력해줘~! 💌✨"
        onChangeText={(message) => setCurrentMessage(message)}
      />
      <Button
        title="전송"
        disabled={!currentMessage}
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
  chatBox: {
    marginVertical: 10,
    backgroundColor: 'pink',
  },
  myChatBox: {
    backgroundColor: 'blue',
  }
});
