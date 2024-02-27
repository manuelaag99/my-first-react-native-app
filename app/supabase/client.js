import "react-native-url-polyfill/auto"
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from "expo-secure-store";
import * as aesjs from "aes-js";
import "react-native-get-random-values";

import { API_KEY, API_URL } from "@env";
import { AppState } from "react-native";

// Use a custom domain as the supabase URL
export const supabase = createClient(API_URL, API_KEY, {
    auth: {
		storage: AsyncStorage,
		autoRefreshToken: false,  //eventually should be true
		persistSession: false, //eventually should be true
		detectSessionInUrl: false
    }
});

// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated. This should
// only be registered once.
// AppState.addEventListener('change', (state) => {
// 	if (state === 'active') {
// 		supabase.auth.startAutoRefresh()
// 	} else {
// 		supabase.auth.stopAutoRefresh()
// 	}
// })