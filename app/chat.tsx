import { useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { router } from 'expo-router';
import dayjs from 'dayjs';
import type { ScrollView as ScrollViewType } from 'react-native-reanimated/lib/typescript/Animated';

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

  const chatsContainerRef = useRef<ScrollViewType | null>(null);

  const [chats, setChats] = useState<Chat[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // 배터리 잔량 확인
  useEffect(() => {
    if (batteryLevel > MAX_BATTERY_LEVEL) {
      Alert.alert(
        '배터리가 충전됐어~!',
        `배터리가 ${MAX_BATTERY_LEVEL}% 이하가 되면 다시 와줘!
      기다리고 있을게~ ⚡️💖`,
        [{ text: '알겠어!', onPress: () => router.push('/') }]
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

      const newDocs = docs.sort(
        (a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp)
      );

      setChats(newDocs);
    });

    return subscriber;
  }, []);

  const handleConfirmExit = useCallback(() => {
    Alert.alert('정말 채팅방을 나갈 거야? 🥺', '', [
      { text: '아니!' },
      { text: '응! 다음에 봐~', onPress: router.back },
    ]);
  }, []);

  const handleScrollDown = useCallback(() => {
    if (!chatsContainerRef.current) {
      return;
    }

    chatsContainerRef.current.scrollToEnd({ animated: true });
  }, []);

  const handleSendMessage = useCallback(async () => {
    setIsSending(true);

    await collection.add({
      user_id: userId,
      user_nickname: userNickname,
      battery_level: batteryLevel,
      timestamp: new Date().toISOString(),
      message: currentMessage,
    });

    setIsSending(false);
    setCurrentMessage('');
  }, [userId, userNickname, batteryLevel, currentMessage]);

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={handleConfirmExit}>
        <Image
          style={styles.backIcon}
          source={require('@/assets/images/chevron_left.png')}
        />
      </Pressable>

      <ScrollView
        ref={chatsContainerRef}
        style={styles.chatsContainer}
        onContentSizeChange={handleScrollDown}
      >
        {chats.map((chat) => {
          const isMine = chat.user_id === userId;
          const date = dayjs(chat.timestamp);

          return (
            <View
              key={`${chat.user_id}/${chat.timestamp}`}
              style={[
                styles.chatContainer,
                isMine ? styles.myChatContainer : styles.otherChatContainer,
              ]}
            >
              <View style={styles.profileContainer}>
                <Text style={styles.nickname}>
                  {chat.user_nickname}#{chat.user_id}
                </Text>
                <Text
                  style={[
                    styles.batteryLevel,
                    chat.battery_level <= 1 ? styles.lowBatteryLevel : null,
                  ]}
                >
                  {chat.battery_level}%
                </Text>
              </View>

              <View
                style={[
                  styles.chatBoxContainer,
                  isMine ? styles.myChatBoxContainer : null,
                ]}
              >
                <View
                  style={[
                    styles.chatBox,
                    isMine ? styles.myChatBox : styles.otherChatBox,
                  ]}
                >
                  <Text style={styles.message}>{chat.message}</Text>
                </View>
                <Text style={styles.sentTime}>
                  {`${date.format('M월 D일')} ${
                    date.hour() > 12 ? '오후' : '오전'
                  } ${date.format('h:m')}`}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.messageForm}>
        <TextInput
          style={styles.messageInput}
          value={currentMessage}
          placeholder="메세지를 입력해!"
          onChangeText={(message) => setCurrentMessage(message)}
        />
        <Pressable
          style={styles.sendButton}
          disabled={!currentMessage || isSending}
          onPress={handleSendMessage}
        >
          <Text style={styles.sendButtonLabel}>전송</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faecbc',
  },

  backButton: {
    paddingTop: 58,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  backIcon: {
    width: 10,
    height: 16,
  },

  chatsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },

  chatContainer: {
    marginVertical: 8,
  },
  myChatContainer: {
    alignItems: 'flex-end',
  },
  otherChatContainer: {
    alignItems: 'flex-start',
  },

  profileContainer: {
    columnGap: 4,
    flexDirection: 'row',
  },
  nickname: {
    fontFamily: 'Pretendard',
    fontSize: 12,
    fontWeight: '700',
    color: '#333333',
  },
  batteryLevel: {
    fontFamily: 'Pretendard',
    fontSize: 12,
    color: '#333333',
  },
  lowBatteryLevel: {
    color: '#de2428',
  },

  chatBoxContainer: {
    columnGap: 4,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  myChatBoxContainer: {
    flexDirection: 'row-reverse',
  },
  chatBox: {
    maxWidth: 240,
    marginTop: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  myChatBox: {
    backgroundColor: '#bcd6ac',
  },
  otherChatBox: {
    backgroundColor: '#f4da86',
  },
  message: {
    fontFamily: 'Pretendard',
  },
  sentTime: {
    marginBottom: 2,
    fontFamily: 'Pretendard',
    fontSize: 10,
    color: '#333333',
  },

  messageForm: {
    columnGap: 6,
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 50,
  },
  messageInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    fontFamily: 'Pretendard',
    color: '#333333',
  },
  sendButton: {
    width: 60,
    paddingVertical: 10,
    backgroundColor: '#bcd6ac',
    borderRadius: 8,
  },
  sendButtonLabel: {
    fontFamily: 'Pretendard',
    fontWeight: '500',
    textAlign: 'center',
    color: '#404b3a',
  },
});
