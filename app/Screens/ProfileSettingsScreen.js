import { ActivityIndicator, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, View } from "react-native";
import AuthForm from "../Components/AuthForm";
import { t, tw } from "react-native-tailwindcss";
import { useContext, useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { AuthContext } from "../Context/AuthContext";

export default function ProfileSettingsScreen ({ navigation, route }) {
    const auth = useContext(AuthContext);
    const [user, setUser] = useState();

    const { user_id } = route.params;

    async function fetchData () {
        try {
            const { data, error } = await supabase.from("ALO-users-db").select("*").eq("user_id", user_id);
            setUser(data[0])
            if (error) console.log(error)
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        fetchData()
    }, [])

    if (!user) {
        return (
            <ActivityIndicator style={[ tw.mT10]} size="large" color="#000" />
        )
    } else { 
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView style={[ t.flex, t.flexCol, t.justifyStart, t.bgWhite, tw.itemsCenter, tw.hFull, tw.wScreen, tw.pB10 ]}>
                    <AuthForm initialAction="update" isSettingsScreen={true} justify={t.justifyStart} navigation={navigation} paddingX={tw.pX0} userInfo={user} />
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        )
    }
}