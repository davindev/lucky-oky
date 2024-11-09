import { useState, useContext, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  StyleSheet,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Draggable from 'react-native-draggable';
import { router } from 'expo-router';

import { UserContext } from '@/libs/Provider';
import useBatteryLevel from '@/hooks/useBatteryLevel';
import { MAX_BATTERY_LEVEL } from '@/constants/Battery';

const collection = firestore().collection('users');

export default function HomeScreen() {
  const [nickname, setNickname] = useState('');

  const batteryLevel = useBatteryLevel();

  const { setUser } = useContext(UserContext);

  const generateRandomId = useCallback(() => {
    return Math.floor(Math.random() * 10_000) + 1;
  }, []);

  const createUser = useCallback(async () => {
    const userIds: number[] = [];
    const docs = await collection.get();

    docs.forEach((doc) => {
      const user = doc.data();
      userIds.push(user.id);
    });

    let userId = generateRandomId();

    while (userIds.includes(userId)) {
      userId = generateRandomId();
    }

    const newUser = {
      id: userId,
      nickname,
    };

    await collection.add(newUser);

    if (typeof setUser === 'function') {
      setUser(newUser);
    }
  }, [nickname, generateRandomId]);

  const handleNavigateToChat = useCallback(async () => {
    await createUser();
    router.push('/chat');
  }, [router, createUser]);

  if (batteryLevel > MAX_BATTERY_LEVEL) {
    return (
      <View style={styles.container}>
        <Text>
          배터리가 {MAX_BATTERY_LEVEL}% 이하일 때 다시 와줬으면 좋겠어~! 💖
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Draggable x={280} y={160}>
        <Text style={styles.clover01}>🍀</Text>
      </Draggable>
      <Draggable x={-70} y={-60}>
        <Text style={styles.clover02}>☘️</Text>
      </Draggable>
      <Draggable x={180} y={-90}>
        <Text style={styles.clover03}>☘️</Text>
      </Draggable>
      <Draggable x={10} y={410}>
        <Text style={styles.clover04}>☘️</Text>
      </Draggable>
      <Draggable x={100} y={600}>
        <Text style={styles.clover05}>🍀</Text>
      </Draggable>

      <View style={styles.inner}>
        <Image
          style={styles.logoImage}
          source={require('@/assets/images/logo.png')}
        />

        <View style={styles.nicknameForm}>
          <TextInput
            style={styles.nicknameInput}
            value={nickname}
            maxLength={10}
            placeholder="닉네임을 입력해!"
            placeholderTextColor="rgb(153, 153, 153)"
            onChangeText={setNickname}
          />
          <Pressable
            style={styles.enterButton}
            disabled={!nickname}
            onPress={handleNavigateToChat}
          >
            <Text style={styles.enterButtonLabel}>입장하기</Text>
          </Pressable>
        </View>
      </View>

      <Draggable x={30} y={250}>
        <Image
          style={styles.fairyImage}
          source={require('@/assets/images/fairy.png')}
        />
      </Draggable>

      <Draggable x={20} y={260}>
        <View style={styles.speechBubbleContainer}>
          <Image
            style={styles.speechBubbleImage}
            source={require('@/assets/images/speech_bubble.png')}
          />
          <View style={styles.textContainer}>
            <Text style={styles.text}>
              배터리가 <Text style={styles.textBold}>{batteryLevel}%</Text>{' '}
              남았다니
            </Text>
            <Text style={styles.text}>완전 럭키 비키잖앙~! ✨</Text>
          </View>
        </View>
      </Draggable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgb(250, 236, 188)',
  },

  inner: {
    flex: 1,
    justifyContent: 'space-between',
    zIndex: 99,
    marginVertical: 100,
  },

  logoImage: {
    width: 240,
    height: 146,
  },

  nicknameForm: {
    rowGap: 14,
    alignItems: 'center',
  },
  nicknameInput: {
    width: 240,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 8,
    fontFamily: 'Pretendard',
    fontSize: 14,
  },
  enterButton: {
    width: 140,
    paddingVertical: 10,
    backgroundColor: 'rgb(188, 214, 172)',
    borderRadius: 8,
  },
  enterButtonLabel: {
    fontFamily: 'Pretendard',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    color: 'rgb(64, 75, 58)',
  },

  fairyImage: {
    width: 500,
    height: 513,
  },

  speechBubbleContainer: {
    position: 'relative',
  },
  speechBubbleImage: {
    width: 220,
    height: 103,
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  text: {
    fontFamily: 'Pretendard',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  textBold: {
    fontWeight: '700',
    color: 'rgb(143, 172, 121)',
  },

  clover01: {
    fontSize: 145,
    transform: 'rotate(60deg)',
  },
  clover02: {
    fontSize: 145,
    transform: 'rotate(120deg)',
  },
  clover03: {
    fontSize: 145,
    transform: 'rotate(-40deg)',
  },
  clover04: {
    fontSize: 145,
    transform: 'rotate(-40deg)',
  },
  clover05: {
    fontSize: 145,
    transform: 'rotate(-40deg)',
  },
});
