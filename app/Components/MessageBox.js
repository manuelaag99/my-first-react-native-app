import { Text, View } from "react-native";
import { t, tailwind, tw } from "react-native-tailwindcss";

export default function MessageBox ({ isError, textForMessageBox }) {
    return (
        <View style={[ t.flex, t.flexCol, tw.wFull, t.border, tailwind.shadow2xl, t.absolute, tw.mT10, tw.z50, tw.pX2, tw.pY2, tailwind.roundedLg, isError ? [ t.borderRed700, t.bgRed100 ] : [ t.borderGray600, t.bgWhite ] ]}>
            <Text style={isError ? [ t.textRed700, t.textLeft ] : [ t.textGray600, t.textLeft ]}>
                {textForMessageBox}
            </Text>
        </View>
    )
}