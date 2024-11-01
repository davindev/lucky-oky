import { Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return <Text style={styles.text}>123</Text>
}

const styles = StyleSheet.create({
  text: {
    paddingTop: 100,
    color: 'red',
  },
});
