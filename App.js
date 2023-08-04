import { Link, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from "expo-font";
import 'react-native-url-polyfill/auto';
import { AppRegistry } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './app/homescreen';
import UserProfile from './app/Screens/userProfile';
import RestaurantPage from './app/Screens/restaurantPage';

export default function App() {
  let colorScheme = useColorScheme();

  let containerTheme
  if (colorScheme === "dark") {
    containerTheme = styles.darkContainer
  } else {
    containerTheme = styles.lightContainer
  }

  let textTheme
  if (colorScheme === "dark") {
    textTheme = styles.darkThemeText
  } else {
    textTheme = styles.lightThemeText
  }

  // const [fontsLoaded] = useFonts({
  //     'Anton': require('../assets/fonts/Anton-Regular.ttf'),
  // });

  const Stack = createNativeStackNavigator()

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* <SafeAreaProvider>
          <SafeAreaView style={[styles.container, containerTheme]}> */}
            <Stack.Screen name="User" component={UserProfile} />
            <Stack.Screen name="Restaurant" component={RestaurantPage} />
            {/* <View  style={styles.container}> */}
              {/* <Text style={textTheme}>Open up App.js to start working on your app!</Text> */}
              {/* <Link href="/about">About</Link> */}
              {/* <StatusBar style="auto" />
              <UserProfile /> */}
              {/* <RestaurantPage /> */}
            {/* </View> */}
          {/* </SafeAreaView>
        </SafeAreaProvider> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  darkContainer: {
    backgroundColor: "#1a1a1a"
  },
  darkThemeText: {
    color: "#fff"
  },
  lightContainer: {
    backgroundColor: "#fff"
  },
  lightThemeText: {
    color: "#000"
  }
});
