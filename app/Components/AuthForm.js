import { useContext, useEffect, useState } from "react";
import { Alert, Keyboard, KeyboardAvoidingView, Text,TouchableHighlight, TouchableWithoutFeedback, View } from "react-native";
import { t, tailwind, tw } from "react-native-tailwindcss";
import { v4 as uuidv4 } from "uuid";
import Icon from 'react-native-vector-icons/FontAwesome';

import Input from "./Input";
import { AuthContext } from "../Context/AuthContext";
import { supabase } from "../supabase/client";
import { useForm } from "../Custom-Hooks";

export default function AuthForm ({ initialAction, isSettingsScreen, justify, navigation, paddingX, route, userId }) {
    const auth = useContext(AuthContext);
    const [logInAction, setLogInAction] = useState(initialAction);
    const [placeholderText, setPlaceholderText] = useState({ forEmail: "Escribe tu e-mail..." , forPassword: "Crea una contraseña..." });
    const [errorWithSignInOrSignUp, setErrorWithSignInOrSignUp] = useState();
    const [loading, setLoading] = useState(false);

    const initialFormState = {
        inputs: {
            email: { value: "", isValid: false },
            password: { value: "", isValid: false }
        },
        isFormValid: false
    };

    async function fetchUserInfo () {
        try {
            const { data, error } = await supabase.from("ALO-users-db").select("*").eq("user_id", userId);
            console.log(error);
        } catch (err) {
            Alert(err);
        }
    }

    useEffect(() => {
        if (isSettingsScreen) fetchUserInfo();
    }, [])

    const [stateOfForm, formHandler] = useForm(initialFormState);

    useEffect(() => {
        if (logInAction === "register") {
            setPlaceholderText({ forEmail: "Escribe tu e-mail..." , forDisplayName: "Escribe tu nombre...", forPassword: "Crea una contraseña...", forUsername: "Crea un usuario" });
        } else if (logInAction === "signIn") {
            setPlaceholderText({ forEmail: "Escribe tu e-mail..." , forDisplayName: null, forPassword: "Escribe tu contraseña...", forUsername: null });
        } else if (logInAction === "update") {
            setPlaceholderText({ forEmail: "Actualiza tu e-mail..." , forDisplayName: "Actualiza tu nombre...", forPassword: "Actualiza tu contraseña...", forUsername: "Actualiza tu nombre de usuario..." });
        }
    }, [logInAction]);


    const [signUpData, setSignUpData] = useState();
    async function registerUser () {
        try {
            const { data, error } = await supabase.auth.signUp({
                email: stateOfForm.inputs.email.value,
                password: stateOfForm.inputs.password.value
            })
            if (error) setErrorWithSignInOrSignUp(error);
            setSignUpData(data);
            // if (data) auth.login(new_user_id, data.session.access_token);
        } catch (err) {
            setErrorWithSignInOrSignUp(err);
        }
        if (errorWithSignInOrSignUp) Alert.alert(errorWithSignInOrSignUp);
        
    }
    console.log(signUpData)

    async function createUserInDatabase () {
        try {
            const { error } = await supabase.from("ALO-users-db").insert({ user_id: signUpData.user.id, user_username: stateOfForm.inputs.username.value, user_email: stateOfForm.inputs.email.value, user_display_name: stateOfForm.inputs.displayName.value, user_password: stateOfForm.inputs.password.value });
            if (error) setErrorWithSignInOrSignUp(error);
            if (!error) auth.login(signUpData.user.id, signUpData.session.access_token);
        } catch (err) {
            setErrorWithSignInOrSignUp(err);
        }
    }
    useEffect(() => {
        if (signUpData) createUserInDatabase();
    }, [signUpData])

    const [userIdForSignIn, setUserIdForSignIn] = useState();
    async function getUserId () {
        try {
            const { data, error } = await supabase.from("ALO-users-db").select("user_id").eq("user_email", stateOfForm.inputs.email.value);
            if (error) setErrorWithSignInOrSignUp(error);
            console.log(data.user_id);
            setUserIdForSignIn(data.user_id);
        } catch (err) {
            setErrorWithSignInOrSignUp(err);
        }
    }

    async function signInUser () {
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: stateOfForm.inputs.email.value,
                password: stateOfForm.inputs.password.value
            })
            if (error) setErrorWithSignInOrSignUp(error);
            if (!error) auth.login(data.user.id, data.session.access_token);
        } catch (err) {
            setErrorWithSignInOrSignUp(err);
        }
        if (errorWithSignInOrSignUp) Alert.alert(errorWithSignInOrSignUp);
    }

    function submitButtonHandler () {
        if (stateOfForm.isFormValid && logInAction === "register") {
            registerUser();
        } else if (stateOfForm.isFormValid && logInAction === "signIn") {
            signInUser();
        } else if (stateOfForm.isFormValid && logInAction === "update") {
            console.log("update profile")
        }
    }

    if (loading) {
        return null;
    } else {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={[ t.flex, t.flexCol, tw.itemsCenter, tw.hFull, tw.wFull, paddingX, justify ]}>
                    {!isSettingsScreen && <View style={[ tw.flex, tw.flexRow, tw.justifyCenter, tw.wFull, tw.mB6, tw.mT8 ]}>
                        <Text style={[ t.textCenter, tw.mXAuto, tw.wFull, t.fontBold, t.text2xl, t.italic ]}>A LA ORDEN</Text>
                    </View>}
                    <View style={[ t.flex, tw.justifyCenter, tw.itemsCenter, tw.wFull, tw.bgWhite, tw.pX4, tw.pY4, tailwind.roundedLg, (!isSettingsScreen && tailwind.shadow2xl) ]}>
                        {(logInAction !== "signIn") && <Input isPasswordField={false} autoCapitalize="words" errorMessage="Escribe un nombre válido." field="displayName" individualInputAction={formHandler} instructionMessage={null} placeholderText={ placeholderText.forDisplayName } />}
                        {(logInAction !== "signIn") && <Input isPasswordField={false} errorMessage="Escribe un usuario válido." field="username" individualInputAction={formHandler} instructionMessage="Escribe al menos 6 caracteres, sin espacios." placeholderText={ placeholderText.forUsername } />}
                        <Input isPasswordField={false} errorMessage="Escribe un correo electrónico válido." field="email" individualInputAction={formHandler} instructionMessage={null} placeholderText={placeholderText.forEmail} />
                        <Input isPasswordField={true} errorMessage="Escribe una contraseña válida" field="password" individualInputAction={formHandler} instructionMessage="Escribe al menos 10 caracteres, mayúsculas y minúsculas, y símbolos especiales (@, #, etc.)." placeholderText={placeholderText.forPassword} />
                        <TouchableHighlight onPress={submitButtonHandler} style={[[ tw.pY4, tw.mY3, tw.pX3, tw.bgBlue400, tailwind.roundedLg, tailwind.shadow2xl ], { width: "95%" }]} underlayColor="#ccddff">
                            <Text style={[ t.textCenter, t.fontBold, t.textWhite ]}>
                                {(logInAction === "register") && "Registrarse"}
                                {(logInAction === "signIn") && "Iniciar sesión"}
                                {(logInAction === "update") && "Actualizar"}
                            </Text>
                        </TouchableHighlight>
    
    
                        {!isSettingsScreen && <TouchableHighlight onPress={() => console.log("click")} style={[[ t.flex, t.justifyCenter, tw.pX3, tw.pY4, tw.mY3, tailwind.roundedLg, tailwind.shadow2xl, t.bgRed500], { width: "95%" }]} underlayColor="#ffdddd" >
                            <View style={[ t.flex, t.flexRow, t.justifyCenter, t.itemsCenter]}>
                                <View style={[ tw.mR4 ]}>
                                    <Icon name="google" style={[ t.textWhite, tw.m0]} size={20} color="#000" />
                                </View>
                                <View>
                                    <Text style={[ t.textCenter, t.textWhite, t.fontBold ]}>
                                        {(logInAction === "register") && "Registrarse con Google"}
                                        {(logInAction === "signIn") && "Iniciar sesión con Google"}
                                    </Text>
                                </View>
                            </View>
                        </TouchableHighlight>}
    
                        {!isSettingsScreen && <TouchableHighlight onPress={() => console.log("click")} style={[[ t.flex, t.justifyCenter, t.itemsCenter, tw.pX3, tw.pY4, tw.mY3, tailwind.roundedLg, tailwind.shadow2xl, t.bgBlue700], { width: "95%" }]} underlayColor="#ddddff" >
                            <View style={[ t.flex, t.flexRow, t.justifyCenter, t.itemsCenter]}>
                                <View style={[ tw.mR4 ]}>
                                    <Icon name="facebook" style={[ t.textWhite, tw.m0]} size={20} color="#000" />
                                </View>
                                <View>
                                    <Text style={[ t.textCenter, t.textWhite, t.fontBold ]}>
                                    {(logInAction === "register") && "Registrarse con Facebook"}
                                    {(logInAction === "signIn") && "Iniciar sesión con Facebook"}
                                    </Text>
                                </View>
                            </View>
                        </TouchableHighlight>}
    
                        {!isSettingsScreen && (logInAction === "register") && <Text onPress={() => setLogInAction("signIn")} style={[ tw.mT4, tw.mB3]} >
                            ¿Ya tienes cuenta? Inicia sesión.
                        </Text>}
                        {!isSettingsScreen && (logInAction === "signIn") && <Text onPress={() => setLogInAction("register")} style={[ tw.mT4, tw.mB3 ]} >
                            ¿No tienes cuenta? Regístrate.
                        </Text>}
    
                    </View>
    
                    
                </View>
            </TouchableWithoutFeedback>
        )
    }
    
}