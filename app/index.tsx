import { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { useBatteryLevel } from 'expo-battery';

const MAX_BATTERY_LEVEL = 5;

export default function HomeScreen() {
  const [nickname, setNickname] = useState(''); // TODO 전역 상태로 관리

  const initialBatteryLevel = useBatteryLevel();
  const batteryLevel = +initialBatteryLevel.toFixed(2) * 100;

  if (batteryLevel > MAX_BATTERY_LEVEL) {
    return (
      <View style={styles.container}>
        <Text>배터리가 {MAX_BATTERY_LEVEL}% 이하일 때 다시 와줘!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View>
        <Text>배터리가 {batteryLevel}% 남았다니 완전 럭키 비키잖아~</Text>
        <TextInput value={nickname} placeholder="닉네임을 입력해!" onChangeText={setNickname} />
        <Link href="/chat">가보자고</Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
