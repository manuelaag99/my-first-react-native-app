import { Text, View } from "react-native";
import { t, tw, tailwind } from "react-native-tailwindcss";

export default function RestaurantPage ({ route, navigation }) {
    console.log(route.params)
    return (
        <View style={[ tw.flex, tw.flexCol, tw.justifyStart, t.pX5, tw.hFull, tw.wScreen, t.bgWhite, tw.overflowHidden, tw.pY6 ]}>
            <View style={[ tw.flex, tw.flexCol, tw.justifyCenter, tw.wFull, tw.mXAuto, tw.pY4, tw.mY4 ]}>
                <Text style={[ tw.wFull, t.textCenter, t.fontBold, t.text4xl, tw.pY5 ]}>
                    Nombre
                </Text>
                <Text style={[ tw.wFull, t.textCenter, t.fontBold, t.text2xl ]}>
                    creado por nombre de creador
                </Text>
            </View>

            <View style={[ tw.flex, tw.flexCol, tw.justifyCenter, tw.wFull, t.bgBlue400, tw.mXAuto, tw.pY6, tw.mY6, tailwind.roundedLg ]}>
                <Text style={[ t.textCenter, t.fontBold, t.textWhite  ]}>
                    Ver Menú
                </Text>
            </View>

            <View style={[ tw.flex, tw.flexCol, tw.justifyCenter, tw.wFull, t.bgYellow500, tw.mXAuto, tw.pY6, tw.mY6, tailwind.roundedLg ]}>
                <Text style={[ t.textCenter, t.fontBold, t.textWhite  ]}>
                    Órdenes
                </Text>
            </View>

            <View style={[ tw.flex, tw.flexCol, tw.justifyCenter, tw.wFull, t.bgRed700, tw.mXAuto, tw.pY6, tw.mY20, tailwind.roundedLg ]}>
                <Text style={[ t.textCenter, t.fontBold, t.textWhite ]}>
                    Eliminar restaurante
                </Text>
            </View>
        </View>
    )
}