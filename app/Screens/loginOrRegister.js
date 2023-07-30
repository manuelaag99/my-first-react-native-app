import { TextInput, TouchableHighlight, View } from "react-native";

export default function HomeScreen () {
    return (
        <View style={[ t.flex ]}>
            <View style={[ t.flex, tw.w5_6, tw.bgWhite ]}>
                <TextInput placeholder="Escribe tu e-mail" />
                <TextInput placeholder="Nombre de tu restaurante" />
                <TextInput placeholder="Crea una contraseña" />
                <TouchableHighlight>
                    Registrarse
                </TouchableHighlight>
            </View>
        </View>
    )
}