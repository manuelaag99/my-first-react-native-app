import { View } from "react-native";
import AuthForm from "../Components/AuthForm";

export default function ProfileSettings ({ navigation, route }) {

    
    return (
        <AuthForm initialAction="update" navigation={navigation} />
    )
}