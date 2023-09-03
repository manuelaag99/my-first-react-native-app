import { ScrollView, View } from "react-native";
import AuthForm from "../Components/AuthForm";
import { t, tw } from "react-native-tailwindcss";

export default function LoginOrRegisterScreen({ navigation, route }) {
    return (
        <ScrollView style={[ t.flex, tw.hScreen ]}>
            <View style={[t.flex, t.flexCol, tw.justifyCenter, tw.itemsCenter, t.pX5, tw.hFull, tw.wFull, tw.pB10]}>
                <AuthForm initialAction="register" justify={t.justifyCenter} navigation={navigation} paddingX={tw.pX5} />
            </View>
        </ScrollView>
    )
}