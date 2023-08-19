import { Text, View } from "react-native";
import { t, tailwind, tw } from "react-native-tailwindcss";

export default function MessageBox ({ textForMessageBox }) {
    return (
        <View style={[ t.flex, t.flexCol, tw.wFull, t.borderRed700, t.border, tailwind.shadow2xl, t.bgRed100, t.absolute, tw.mT10, t.z20, tw.pX2, tw.pY2, tailwind.roundedLg ]}>
            <Text style={[ t.textRed700, t.textLeft ]}>
                {textForMessageBox}
            </Text>
        </View>
    )
}