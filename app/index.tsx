import { useState, useContext, useCallback } from 'react';
import { View, Text, TextInput, Pressable, Image, StyleSheet } from 'react-native';
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
      {/* <Draggable x={50} y={50}>
        <Text style={styles.clover01}>🍀</Text>
      </Draggable>
      <Draggable x={50} y={150}>
        <Text style={styles.clover01}>☘️</Text>
      </Draggable> */}

      <Image
        style={styles.logo}
        source={require('@/assets/images/logo.png')}
      />

      <View style={styles.inner}>
        <TextInput
          style={styles.input}
          value={nickname}
          maxLength={10}
          placeholder="닉네임을 입력해!"
          placeholderTextColor="rgb(153, 153, 153)"
          onChangeText={setNickname}
        />
        <Pressable
          style={styles.button}
          disabled={!nickname}
          onPress={handleNavigateToChat}
        >
          <Text style={styles.buttonLabel}>입장하기</Text>
        </Pressable>
      </View>

      <Draggable x={150} y={170}>
        <Image
          style={styles.fairy}
          source={require('@/assets/images/fairy.png')}
        />
      </Draggable>

      <Draggable x={150} y={170}>
        <View style={styles.speechBubbleContainer}>
          <Image
            style={styles.fairy}
            source={require('@/assets/images/speech_bubble.png')}
          />
          <Text style={styles.text}>
            배터리가 <Text style={styles.textBold}>{batteryLevel}%</Text> 남았다니
          </Text>
          <Text style={styles.text}>
            완전 럭키 비키잖앙~! ✨
          </Text>
        </View>
      </Draggable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    position: 'relative',
    backgroundColor: 'rgb(250, 236, 188)',
  },

  logo: {
    width: 240,
    resizeMode: 'contain',
    transform: 'translate(0, -100px)'
  },

  inner: {
    display: 'flex',
    rowGap: 14,
    alignItems:'center',
  },

  input: {
    width: 240,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 8,
    fontFamily: 'Pretendard',
    fontSize: 14,
  },

  button: {
    width: 140,
    paddingVertical: 10,
    backgroundColor: 'rgb(188, 214, 172)',
    borderRadius: 8,
  },
  buttonLabel: {
    fontFamily: 'Pretendard',
    fontSize: 14,
    fontWeight: 'medium',
    textAlign: 'center',
    color: 'rgb(64, 75, 58)',
  },

  fairy: {
    width: 350,
    resizeMode: 'contain',
  },

  speechBubbleContainer: {
    position: 'relative',
  },
  speechBubble: {
    width: 100,
    resizeMode: 'contain',
  },

  textContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  text: {
    fontFamily: 'Pretendard',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  textBold: {
    fontWeight: 'bold',
    color: 'rgb(143, 172, 121)',
  },

  // clover01: {
  //   fontSize: 145,
  // },
});
