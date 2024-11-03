import { useContext, useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

import { UserContext } from '@/libs/Provider';

interface Chat {
  nickname: string;
  battery_level: number;
  timestamp: string;
  message: string;
}

export default function ChatScreen() {
  const [chats, setChats] = useState<any>();
  const [currentMessage, setCurrentMessage] = useState('');

  const { nickname } = useContext(UserContext);

  const store = firestore().collection('chats');

  useEffect(() => {
    const subscriber = store.onSnapshot((QuerySnapshot) => {
      setChats(QuerySnapshot);
    });

    return subscriber;
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        value={currentMessage}
        placeholder="메세지를 입력해!"
        onChangeText={(message) => setCurrentMessage(message)}
      />
      <Button
        onPress={() => {
          store.add({
            nickname,
            battery_level: 0, // TODO
            timestamp: new Date().toISOString(),
            message: currentMessage,
          });
        }}
        title="전송"
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
