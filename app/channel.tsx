import { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { UserContext } from '@/libs/Provider';

export default function ChannelScreen() {
  const { nickname } = useContext(UserContext);

  return (
    <View style={styles.container}>
      <Text>{nickname}</Text>
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
