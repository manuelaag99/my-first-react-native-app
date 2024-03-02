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
import UserProfileScreen from './app/Screens/UserProfileScreen';
import RestaurantScreen from './app/Screens/RestaurantScreen';
import MenuScreen from './app/Screens/MenuScreen';
import OrdersScreen from './app/Screens/OrdersScreen';
import LoginOrRegisterScreen from './app/Screens/LoginOrRegisterScreen';
import ProfileSettingsScreen from './app/Screens/ProfileSettingsScreen';
import RestaurantTeamScreen from './app/Screens/RestaurantTeamScreen';
import RestaurantsSearchScreen from './app/Screens/RestaurantsSearchScreen';
import { useCallback, useEffect, useState } from 'react';
import { supabase } from './app/supabase/client';
import { AuthContext } from './app/Context/AuthContext';
import RequestsScreen from './app/Screens/RequestsScreen';
import DeleteUserAccountScreen from './app/Screens/DeleteUserAccountScreen';

export default function App() {
	let colorScheme = useColorScheme();
	let containerTheme;
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

	const [session, setSession] = useState();

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session }}) => {
			setSession(session);
		})

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		})
	}, [])

	const [userId, setUserId] = useState();
	const [token, setToken] = useState();
	const logIn = useCallback((uId, token) => {
		setUserId(uId);
		setToken(token);
	}, [])
	const logOut = useCallback(() => {
		setUserId(null);
		setToken(null);
	}, [])

	// const [fontsLoaded] = useFonts({
	//     'Anton': require('../assets/fonts/Anton-Regular.ttf'),
	// });

	const Stack = createNativeStackNavigator()


	if (token) {
		return <>
			<NavigationContainer>
				<AuthContext.Provider value={{ isLoggedIn: token, token: token, userId: userId, login: logIn, logout: logOut }}>
					{token && <Stack.Navigator>
						{/* <SafeAreaProvider>
						<SafeAreaView style={[styles.container, containerTheme]}> */}
							<Stack.Screen name='User' component={UserProfileScreen} options={{ title: "Mi Perfil" }} />
							<Stack.Screen name='Restaurant' component={RestaurantScreen} />
							<Stack.Screen name='Menu' component={MenuScreen} options={{ title: "Menú" }} />
							<Stack.Screen name='Orders' component={OrdersScreen} options={{ title: "Órdenes" }} />
							<Stack.Screen name='Settings' component={ProfileSettingsScreen} options={{ title: "Ajustes" }} />
							<Stack.Screen name='Team' component={RestaurantTeamScreen} options={{ title: "Equipo" }} />
							<Stack.Screen name='Search Restaurant' component={RestaurantsSearchScreen} options={{ title: "Buscar restaurante" }} />
							<Stack.Screen name='Requests' component={RequestsScreen} options={{ title: "Solicitudes" }} />
							<Stack.Screen name='Delete user account' component={DeleteUserAccountScreen} options={{ title: "Borrar mi cuenta" }} />
							{/* <View  style={styles.container}> */}
							{/* <Text style={textTheme}>Open up App.js to start working on your app!</Text> */}
							{/* <Link href="/about">About</Link> */}
							{/* <StatusBar style="auto" />
							<UserProfileScreen /> */}
							{/* <RestaurantScreen /> */}
							{/* </View> */}
						{/* </SafeAreaView>
						</SafeAreaProvider> */}
					</Stack.Navigator>}
				</AuthContext.Provider>
			</NavigationContainer>
		</>
	} else {
		return <>
			<NavigationContainer>
				<AuthContext.Provider value={{ isLoggedIn: token, token: token, userId: userId, login: logIn, logout: logOut }}>
					{!token && <Stack.Navigator>
						<Stack.Screen name='Sign in or Sign up' component={LoginOrRegisterScreen} options={{ title: "Iniciar Sesion" }} /> 
					</Stack.Navigator>}
				</AuthContext.Provider>
			</NavigationContainer>
		</>
	}
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
