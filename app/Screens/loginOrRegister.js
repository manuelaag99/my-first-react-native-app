import { useEffect, useState } from "react";
import { Text,TouchableHighlight, View } from "react-native";
import { t, tailwind, tw } from "react-native-tailwindcss";
import Input from "../Components/Input";

export default function LoginOrRegister () {
    const [logInAction, setLogInAction] = useState("register");
    const [placeholderText, setPlaceholderText] = useState({ forEmail: "Escribe tu e-mail..." , forPassword: "Crea una contraseña..." });
    const [profileInfo, setProfileInfo] = useState({ email: "", displayName: "", password: "" });

    useEffect(() => {
        if (logInAction === "register") {
            setPlaceholderText({ forEmail: "Escribe tu e-mail..." , forDisplayName: "Escribe tu nombre...", forPassword: "Crea una contraseña..." })
        } else if (logInAction === "signIn") {
            setPlaceholderText({ forEmail: "Escribe tu e-mail..." , forDisplayName: null, forPassword: "Escribe tu contraseña..." })
        }
    }, [logInAction]);

    return (
        <View style={[ t.flex, t.flexCol, tw.justifyCenter, tw.itemsCenter, t.pX5, tw.hFull, tw.wFull, tw.pB10 ]}>
            <View style={[ tw.flex, tw.flexRow, tw.justifyCenter, tw.wFull, tw.mB6 ]}>
                <Text style={[ t.textCenter, tw.mXAuto, tw.wFull, t.fontBold, t.text2xl, t.italic ]}>A LA ORDEN</Text>
            </View>
            <View style={[ t.flex, tw.justifyCenter, tw.itemsCenter, tw.wFull, tw.bgWhite, tw.pX4, tw.pY4, tailwind.roundedLg, tailwind.shadow2xl ]}>
                {(logInAction === "register") && <Input errorMessage="Escribe un nombre válido." field="displayName" placeholderText={ placeholderText.forDisplayName } />}
                <Input errorMessage="Escribe un correo electrónico válido." field="email" placeholderText={placeholderText.forEmail} />
                <Input errorMessage="Incluye mayúsculas, minúsculas, y símbolos especiales (@, #, etc.)" field="password" placeholderText={placeholderText.forPassword} />
                <TouchableHighlight onPress={() => console.log("yeah")} style={[[ tw.pY4, tw.mT4, tw.mB1, tw.pX3, tw.bgBlue500, tailwind.roundedLg, tailwind.shadow2xl ], { width: "95%" }]} underlayColor="#ccddff">
                    <Text style={[ t.textCenter, t.fontBold, t.textWhite ]}>
                        {(logInAction === "register") && "Registrarse"}
                        {(logInAction === "signIn") && "Iniciar sesión"}
                    </Text>
                </TouchableHighlight>
                {(logInAction === "register") && <Text onPress={() => setLogInAction("signIn")} style={[ tw.mT5, tw.mB2 ]} >
                    ¿Ya tienes cuenta? Inicia sesión.
                </Text>}
                {(logInAction === "signIn") && <Text onPress={() => setLogInAction("register")} style={[ tw.mT5, tw.mB2 ]} >
                    ¿No tienes cuenta? Regístrate.
                </Text>}
            </View>
        </View>
    )
}