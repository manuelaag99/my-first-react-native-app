import { useEffect, useState } from "react";
import { Alert, Keyboard, KeyboardAvoidingView, Text,TouchableHighlight, TouchableWithoutFeedback, View } from "react-native";
import { t, tailwind, tw } from "react-native-tailwindcss";
import { v4 as uuidv4 } from "uuid";
import Icon from 'react-native-vector-icons/FontAwesome';

import Input from "./Input";
import { supabase } from "../supabase/client";
import { useForm } from "../Custom-Hooks";

export default function AuthForm ({ initialAction, isSettingsScreen, justify, navigation, paddingX, route, userId }) {
    const [logInAction, setLogInAction] = useState(initialAction);
    const [placeholderText, setPlaceholderText] = useState({ forEmail: "Escribe tu e-mail..." , forPassword: "Crea una contraseña..." });

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
        if (logInAction === "register" || logInAction === "update") {
            setPlaceholderText({ forEmail: "Escribe tu e-mail..." , forDisplayName: "Escribe tu nombre...", forPassword: "Crea una contraseña...", forUsername: "Crea un usuario" });
        } else if (logInAction === "signIn") {
            setPlaceholderText({ forEmail: "Escribe tu e-mail..." , forDisplayName: null, forPassword: "Escribe tu contraseña...", forUsername: null });
        }
    }, [logInAction]);


    let user_id
    async function registerUser () {
        user_id = uuidv4();
        try {
            const { error } = await supabase.from("ALO-users-db").insert({ user_id: user_id, user_username: stateOfForm.inputs.username.value, user_email: stateOfForm.inputs.email.value, user_display_name: stateOfForm.inputs.displayName.value, user_password: stateOfForm.inputs.password.value });
            if (error) console.log(error);
            navigation.navigate("User", { user_id: user_id });
        } catch (err) {
            console.log(err);
        }
    }

    function submitButtonHandler () {
        if (stateOfForm.isFormValid && logInAction === "register") {
            console.log("register");
            registerUser();
        } else if (stateOfForm.isFormValid && logInAction === "signIn") {
            console.log("sign in");
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[ t.flex, t.flexCol, tw.itemsCenter, tw.hFull, tw.wFull, paddingX, justify ]}>
                {!isSettingsScreen && <View style={[ tw.flex, tw.flexRow, tw.justifyCenter, tw.wFull, tw.mB6, tw.mT8 ]}>
                    <Text style={[ t.textCenter, tw.mXAuto, tw.wFull, t.fontBold, t.text2xl, t.italic ]}>A LA ORDEN</Text>
                </View>}
                <View style={[ t.flex, tw.justifyCenter, tw.itemsCenter, tw.wFull, tw.bgWhite, tw.pX4, tw.pY4, tailwind.roundedLg, (!isSettingsScreen && tailwind.shadow2xl) ]}>
                    {(logInAction !== "signIn") && <Input autoCapitalize="words" errorMessage="Escribe un nombre válido." field="displayName" individualInputAction={formHandler} instructionMessage={null} placeholderText={ placeholderText.forDisplayName } />}
                    {(logInAction !== "signIn") && <Input errorMessage="Escribe un usuario válido." field="username" individualInputAction={formHandler} instructionMessage="Escribe al menos 6 caracteres, sin espacios." placeholderText={ placeholderText.forUsername } />}
                    <Input errorMessage="Escribe un correo electrónico válido." field="email" individualInputAction={formHandler} instructionMessage={null} placeholderText={placeholderText.forEmail} />
                    <Input errorMessage="Escribe una contraseña válida" field="password" individualInputAction={formHandler} instructionMessage="Escribe al menos 10 caracteres, mayúsculas y minúsculas, y símbolos especiales (@, #, etc.)." placeholderText={placeholderText.forPassword} />
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