import AuthForm from "../Components/AuthForm";

export default function LoginOrRegister ({ navigation, route }) {

    return (
        <AuthForm initialAction="register" navigation={navigation} />
    )
}