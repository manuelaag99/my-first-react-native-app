import { useState } from "react";
import { Text, TextInput, TouchableHighlight, View } from "react-native";
import { t, tailwind, tw } from "react-native-tailwindcss";

export default function LoginOrRegister () {
    const [logInAction, setLogInAction] = useState("register");
    return (
        <View style={[ t.flex, t.flexCol, tw.justifyCenter, tw.itemsCenter, t.pX5, tw.hFull, tw.wFull, tw.pB10 ]}>
            <View style={[ tw.flex, tw.flexRow, tw.justifyCenter, tw.wFull, tw.mB6 ]}>
                <Text style={[ t.textCenter, tw.mXAuto, tw.wFull, t.fontBold, t.text2xl, t.italic ]}>A LA ORDEN</Text>
            </View>
            <View style={[ t.flex, tw.justifyCenter, tw.itemsCenter, tw.wFull, tw.bgWhite, tw.pX4, tw.pY4, tailwind.roundedLg, tailwind.shadow2xl ]}>
                <TextInput placeholder="Escribe tu e-mail..." style={[ tw.w5_6, tw.pY2, tw.pX2, tw.mY2, tw.h12 ]} />
                {(logInAction === "register") && <TextInput placeholder="Escribe tu nombre..." style={[ tw.w5_6, tw.pY2, tw.pX2, tw.mY2, tw.h12 ]} />}
                <TextInput placeholder="Crea una contraseña..." style={[ tw.w5_6, tw.pY2, tw.pX2, tw.mY2, tw.h12 ]} />
                <TouchableHighlight style={[[ tw.pY4, tw.mT4, tw.mB1, tw.pX3, tw.bgBlue500, tailwind.roundedLg, tailwind.shadow2xl ], { width: "95%" }]}>
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