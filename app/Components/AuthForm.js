import { useEffect, useState } from "react";
import { Alert, Keyboard, KeyboardAvoidingView, Text,TouchableHighlight, TouchableWithoutFeedback, View } from "react-native";
import { t, tailwind, tw } from "react-native-tailwindcss";
import { v4 as uuidv4 } from "uuid";

import Input from "./Input";
import { supabase } from "../supabase/client";
import { useForm } from "../Custom-Hooks";


export default function AuthForm ({ initialAction, isSettingsScreen, navigation, route, userId }) {
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
        if (logInAction === "register") {
            setPlaceholderText({ forEmail: "Escribe tu e-mail..." , forDisplayName: "Escribe tu nombre...", forPassword: "Crea una contraseña...", forUsername: "Crea un usuario" });
        } else if (logInAction === "signIn") {
            setPlaceholderText({ forEmail: "Escribe tu e-mail..." , forDisplayName: null, forPassword: "Escribe tu contraseña...", forUsername: null });
        }
    }, [logInAction]);


    async function registerUser () {
        let user_id = uuidv4();
        try {
            const { error } = await supabase.from("ALO-users-db").insert({ user_id: user_id, user_username: stateOfForm.inputs.username.value, user_email: stateOfForm.inputs.email.value, user_display_name: stateOfForm.inputs.displayName.value, user_password: stateOfForm.inputs.password.value });
            if (error) console.log(error);
        } catch (err) {
            console.log(err);
        }
        navigation.navigate("User", { user_id: user_id });
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
            <KeyboardAvoidingView style={[ t.flex, t.flexCol, tw.justifyCenter, tw.itemsCenter, t.pX5, tw.hFull, tw.wFull, tw.pB10 ]}>
                <View style={[ tw.flex, tw.flexRow, tw.justifyCenter, tw.wFull, tw.mB6 ]}>
                    <Text style={[ t.textCenter, tw.mXAuto, tw.wFull, t.fontBold, t.text2xl, t.italic ]}>A LA ORDEN</Text>
                </View>
                <View style={[ t.flex, tw.justifyCenter, tw.itemsCenter, tw.wFull, tw.bgWhite, tw.pX4, tw.pY4, tailwind.roundedLg, tailwind.shadow2xl ]}>
                    {(logInAction === "register") && <Input errorMessage="Escribe un nombre válido." field="displayName" individualInputAction={formHandler} instructionMessage={null} placeholderText={ placeholderText.forDisplayName } />}
                    {(logInAction === "register") && <Input errorMessage="Escribe un usuario válido." field="username" individualInputAction={formHandler} instructionMessage="Escribe al menos 6 caracteres" placeholderText={ placeholderText.forUsername } />}
                    <Input errorMessage="Escribe un correo electrónico válido." field="email" individualInputAction={formHandler} instructionMessage={null} placeholderText={placeholderText.forEmail} />
                    <Input errorMessage="Escribe una contraseña válida" field="password" individualInputAction={formHandler} instructionMessage="Escribe al menos 10 caracteres, mayúsculas y minúsculas, y símbolos especiales (@, #, etc.)." placeholderText={placeholderText.forPassword} />
                    <TouchableHighlight onPress={submitButtonHandler} style={[[ tw.pY4, tw.mT4, tw.mB1, tw.pX3, tw.bgBlue500, tailwind.roundedLg, tailwind.shadow2xl ], { width: "95%" }]} underlayColor="#ccddff">
                        <Text style={[ t.textCenter, t.fontBold, t.textWhite ]}>
                            {(logInAction === "register") && "Registrarse"}
                            {(logInAction === "signIn") && "Iniciar sesión"}
                            {(logInAction === "update") && "Actualizar"}
                        </Text>
                    </TouchableHighlight>
                    {(logInAction === "register") && <Text onPress={() => setLogInAction("signIn")} style={[ tw.mT5, tw.mB2 ]} >
                        ¿Ya tienes cuenta? Inicia sesión.
                    </Text>}
                    {(logInAction === "signIn") && <Text onPress={() => setLogInAction("register")} style={[ tw.mT5, tw.mB2 ]} >
                        ¿No tienes cuenta? Regístrate.
                    </Text>}
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}