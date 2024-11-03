import { useContext, useState, useEffect, useCallback } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

import { UserContext } from '@/libs/Provider';
import useBatteryLevel from '@/hooks/useBatteryLevel';

interface Chat {
  nickname: string;
  battery_level: number;
  timestamp: string;
  message: string;
}

export default function ChatScreen() {
  const batteryLevel = useBatteryLevel();

  const { nickname } = useContext(UserContext);

  const [chats, setChats] = useState<any>();
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    const subscriber = firestore().collection('chats').onSnapshot((QuerySnapshot) => {
      setChats(QuerySnapshot);
    });

    return subscriber;
  }, []);

  const handleSendMessage = useCallback(() => {
    firestore().collection('chats').add({
      nickname,
      battery_level: batteryLevel,
      timestamp: new Date().toISOString(),
      message: currentMessage,
    });
  }, []);

  return (
    <View style={styles.container}>
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
});
