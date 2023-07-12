import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './app/homescreen';

export default function App() {

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View  style={styles.container}>
          {/* <Text style={styles.text}>Open up App.js to start working on your app!</Text>
          <StatusBar style="auto" />
          <Link href="/about">About</Link> */}
          <HomeScreen />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#aaa"
  },
  text: {
    color: "#000fff"
  }
});
