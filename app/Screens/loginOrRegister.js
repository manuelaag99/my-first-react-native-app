import { Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from "react-native";
import AuthForm from "../Components/AuthForm";
import { t, tw } from "react-native-tailwindcss";

export default function LoginOrRegister({ navigation, route }) {
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView style={[t.flex, t.flexCol, tw.justifyCenter, tw.itemsCenter, t.pX5, tw.hFull, tw.wFull, tw.pB10]}>
                <AuthForm initialAction="register" navigation={navigation} />
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}