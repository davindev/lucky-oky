import { useContext, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

import { UserContext } from '@/libs/Provider';
import useBatteryLevel from '@/hooks/useBatteryLevel';
import { MAX_BATTERY_LEVEL } from '@/constants/Battery';

export default function HomeScreen() {
  const batteryLevel = useBatteryLevel();

  const { nickname, setUser } = useContext(UserContext);

  const handleChangeNickname = useCallback((nickname: string) => {
    if (typeof setUser === 'function') {
      setUser((current) => ({ ...current, nickname }));
    }
  }, []);

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
          onChangeText={handleChangeNickname}
        />
        <Link href="/chat">입장하기</Link>
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
