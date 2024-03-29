import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Text,TouchableHighlight, TouchableWithoutFeedback, View } from "react-native";
import { t, tailwind, tw } from "react-native-tailwindcss";
import Icon from 'react-native-vector-icons/FontAwesome';

import Input from "./Input";
import { AuthContext } from "../Context/AuthContext";
import { supabase } from "../supabase/client";
import { useForm } from "../Custom-Hooks";
import ErrorModal from "./ErrorModal";

export default function AuthForm ({ initialAction, isSettingsScreen, justify, navigation, paddingX, route, userId, userInfo }) {
    const auth = useContext(AuthContext);
    const [openErrorModal, setOpenErrorModal] = useState(false);
    const [textForErrorModal, setTextForErrorModal] = useState("");
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

    const [stateOfForm, formHandler, formSwitcher, formFiller] = useForm(initialFormState);

    const [allUserEmails, setAllUserEmails] = useState();
    const [allUsernames, setAllUsernames] = useState();
    async function fetchAllUserEmais () {
        try {
            const { data, error } = await supabase.from("ALO-users-db").select("user_email");
            if (error) console.log(error);
            setAllUserEmails(data);
        } catch (err) {
            console.log(err);
        }
    }
    async function fetchAllUsernames () {
        try {
            const { data, error } = await supabase.from("ALO-users-db").select("user_username");
            if (error) console.log(error);
            setAllUsernames(data);
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        fetchAllUserEmais();
        fetchAllUsernames();
    }, [])

    const [isUsernameTaken, setIsUsernameTaken] = useState(false);
    const [isEmailTaken, setIsEmailTaken] = useState(false);
    useEffect(() => {
        if (stateOfForm) {
            if (stateOfForm.inputs) {
                if (stateOfForm.inputs.email && stateOfForm.inputs.username) {
                    if (stateOfForm.inputs.email.value && stateOfForm.inputs.username.value) {
                        if (allUserEmails && (allUserEmails.length > 0) && stateOfForm.inputs.email.value) {
                            if (allUserEmails.some((user) => user.user_email === stateOfForm.inputs.email.value)) {
                                setIsEmailTaken(true);
                            } else {
                                setIsEmailTaken(false);
                            }
                        }
                        if (allUsernames && (allUsernames.length > 0) && stateOfForm.inputs.username.value) {
                            if (allUsernames.some((user) => user.user_username === stateOfForm.inputs.username.value)) {
                                setIsUsernameTaken(true);
                            } else {
                                setIsUsernameTaken(false);
                            }
                        }
                    }
                }
            }
        }


    }, [allUserEmails, allUsernames, stateOfForm])

    useEffect(() => {
        if (logInAction === "register") {
            formSwitcher("switch to sign up", stateOfForm);
            setPlaceholderText({ forEmail: "Escribe tu e-mail..." , forDisplayName: "Escribe tu nombre...", forPassword: "Crea una contraseña...", forUsername: "Crea un usuario" });
        } else if (logInAction === "signIn") {
            formSwitcher("switch to sign in", stateOfForm);
            setPlaceholderText({ forEmail: "Escribe tu e-mail..." , forDisplayName: null, forPassword: "Escribe tu contraseña...", forUsername: null });
        } else if (logInAction === "update" && userInfo) {
            setPlaceholderText({ forEmail: "Actualiza tu e-mail..." , forDisplayName: "Actualiza tu nombre...", forPassword: "Actualiza tu contraseña...", forUsername: "Actualiza tu nombre de usuario..." });
            formFiller("fill with existing info", userInfo);
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
        } catch (err) {
            setErrorWithSignInOrSignUp(err);
        }
        if (errorWithSignInOrSignUp) console.log(errorWithSignInOrSignUp);
        
    }

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
        if (errorWithSignInOrSignUp) console.log(errorWithSignInOrSignUp);
    }

    async function updateUser () {
        try {
            const { error } = await supabase.from("ALO-users-db").update({ user_display_name: stateOfForm.inputs.displayName.value, user_email: stateOfForm.inputs.email.value, user_password: stateOfForm.inputs.password.value, user_username: stateOfForm.inputs.username.value }).eq("user_id", auth.userId);
            if (error) console.log(error);
        } catch (err) {
            console.log(err);
        }
    }

    function submitButtonHandler () {   
        if (isEmailTaken) {
            if (logInAction === "register") {
                setTextForErrorModal("Lo lamentamos, tu correo electrónico ya esta asociado con una cuenta existente. Intenta usar uno diferente.");
                setOpenErrorModal(true);
            }
        } else {
            if (isUsernameTaken) {
                if (logInAction === "register") {
                    setTextForErrorModal("Lo lamentamos, tu usuario ya esta asociado con una cuenta existente. Intenta usar uno diferente.");
                    setOpenErrorModal(true);
                }
            } else {
                if (stateOfForm.isFormValid) {
                    if (logInAction === "register") {
                        registerUser();
                    } else if (logInAction === "signIn") {
                        signInUser();
                    } else if (logInAction === "update") {
                        updateUser();
                    }
                } else {
                    setTextForErrorModal("Revisa que los datos que ingresaste cumplan con los requisitos.");
                    setOpenErrorModal(true);
                }
            }
        }
    }

    function deleteUserAccount () {
        navigation.navigate("Delete user account");
    }

    console.log(isEmailTaken)

    async function signInWithFacebook () {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "facebook"
            })
        } catch (err) {
            console.log(err);
        }
    }

    async function signInWithGoogle () {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google"
            })
        } catch (err) {
            console.log(err);
        }
    }

    if ((isSettingsScreen && !userInfo) || (!isSettingsScreen && loading)) {
        return (
            <ActivityIndicator style={[ tw.mT10]} size="large" color="#000" />
        )
    } else if ((isSettingsScreen && userInfo) || (!isSettingsScreen && !loading)) {
        return (
            <>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={[ t.flex, t.flexCol, tw.itemsCenter, tw.hFull, tw.wFull, paddingX, justify ]}>
                        {!isSettingsScreen && <View style={[ tw.flex, tw.flexRow, tw.justifyCenter, tw.wFull, tw.mB6, tw.mT8 ]}>
                            <Text style={[ t.textCenter, tw.mXAuto, tw.wFull, t.fontBold, t.text2xl, t.italic ]}>A LA ORDEN</Text>
                        </View>}
                        <View style={[ t.flex, tw.justifyCenter, tw.itemsCenter, tw.wFull, tw.bgWhite, tw.pX4, tw.pY4, tailwind.roundedLg, (!isSettingsScreen && tailwind.shadow2xl) ]}>
                            {(logInAction !== "signIn") && <Input isPasswordField={false} autoCapitalize="words" errorMessage="Escribe un nombre válido." field="displayName" individualInputAction={formHandler} initialInputValue={userInfo ? userInfo.user_display_name : ""} instructionMessage={null} placeholderText={ placeholderText.forDisplayName } />}
                            {(logInAction !== "signIn") && <Input isPasswordField={false} errorMessage="Escribe un usuario válido." field="username" individualInputAction={formHandler} initialInputValue={userInfo ? userInfo.user_username : ""} instructionMessage="Escribe al menos 6 caracteres, sin espacios." placeholderText={ placeholderText.forUsername } />}
                            <Input isPasswordField={false} errorMessage="Escribe un correo electrónico válido." field="email" individualInputAction={formHandler} initialInputValue={userInfo ? userInfo.user_email : ""} instructionMessage={null} placeholderText={placeholderText.forEmail} />
                            <Input isPasswordField={true} errorMessage="Escribe una contraseña válida" field="password" individualInputAction={formHandler} initialInputValue={userInfo ? userInfo.user_password : ""} instructionMessage="Escribe al menos 10 caracteres, mayúsculas y minúsculas, y símbolos especiales (@, #, etc.), sin espacios." placeholderText={placeholderText.forPassword} />
                            <TouchableHighlight disabled={!stateOfForm.isFormValid} onPress={submitButtonHandler} style={[[ tw.pY4, tw.mY3, tw.pX3, tailwind.roundedLg, tailwind.shadow2xl ], (stateOfForm.isFormValid ? tw.bgBlue400 : tw.bgBlue200 ), { width: "95%" }]} underlayColor="#ccddff">
                                <Text style={[ t.textCenter, t.fontBold, t.textWhite ]}>
                                    {(logInAction === "register") && "Registrarse"}
                                    {(logInAction === "signIn") && "Iniciar sesión"}
                                    {(logInAction === "update") && "Actualizar"}
                                </Text>
                            </TouchableHighlight>
                            {isSettingsScreen && <TouchableHighlight onPress={deleteUserAccount} style={[[ tw.pY4, tw.mY3, tw.pX3, tw.bgRed600, tailwind.roundedLg, tailwind.shadow2xl ], { width: "95%" }]} underlayColor="#f11">
                                <Text style={[ t.textCenter, t.fontBold, t.textWhite ]}>
                                    Borrar mi cuenta
                                </Text>
                            </TouchableHighlight>}
        
        
                            {!isSettingsScreen && <TouchableHighlight onPress={() => signInWithGoogle} style={[[ t.flex, t.justifyCenter, tw.pX3, tw.pY4, tw.mY3, tailwind.roundedLg, tailwind.shadow2xl, t.bgRed500], { width: "95%" }]} underlayColor="#ffdddd" >
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
        
                            {!isSettingsScreen && <TouchableHighlight onPress={() => signInWithFacebook} style={[[ t.flex, t.justifyCenter, t.itemsCenter, tw.pX3, tw.pY4, tw.mY3, tailwind.roundedLg, tailwind.shadow2xl, t.bgBlue700], { width: "95%" }]} underlayColor="#ddddff" >
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
                <ErrorModal animationForModal="fade" isVisible={openErrorModal} onPressingRedButton={null} onClose={() => setOpenErrorModal(false)} textForButton="Aceptar" textForModal={textForErrorModal} />
            </>
        )
    }
}