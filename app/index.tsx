import { useContext, useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
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

  const saveUser = useCallback(async () => {
    const userIds: number[] = [];
    const docs = await collection.get();

    docs.forEach((doc) => {
      const user = doc.data();
      userIds.push(user.id);
    });

    const userId = userIds.length > 0
      ? userIds[userIds.length - 1] + 1
      : 0;
    const newUser = {
      id: userId,
      nickname,
    };

    await collection.add(newUser);

    if (typeof setUser === 'function') {
      setUser(newUser);
    }
  }, [nickname]);

  const handleNavigateToChat = useCallback(async () => {
    await saveUser();
    router.push('/chat');
  }, [router, saveUser]);

  if (batteryLevel > MAX_BATTERY_LEVEL) {
    return (
      <View style={styles.container}>
        <Text>배터리가 {MAX_BATTERY_LEVEL}% 이하일 때 다시 와줘</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View>
        <Text>배터리가 {batteryLevel}% 남았다니 완전 럭키 비키잖앙</Text>
        <TextInput
          value={nickname}
          placeholder="닉네임을 입력해"
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
});
