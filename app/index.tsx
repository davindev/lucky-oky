import { useState, useContext, useCallback } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
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
      <View>
        <Text style={styles.subTitle}>
          배터리가 {batteryLevel}% 남았다니
        </Text>
        <Text style={styles.subTitle}>
          완전 럭키 비키잖앙~! ✨
        </Text>
        <TextInput
          value={nickname}
          placeholder="닉네임을 입력해 줘!"
          onChangeText={setNickname}
        />
        <Button
          title="입장하기"
          disabled={!nickname}
          onPress={handleNavigateToChat}
        />
      </View>
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
  subTitle: {
    fontFamily: 'Pretendard',
    textAlign: 'center',
    lineHeight: 20,
  },
});
