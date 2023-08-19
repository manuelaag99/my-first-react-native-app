import { Text, View } from "react-native";
import { t, tailwind, tw } from "react-native-tailwindcss";

export default function MessageBox ({ textForMessageBox }) {
    return (
        <View style={[ t.flex, t.flexCol, tw.wFull, t.borderBlack, t.border2, tailwind.shadow2xl, t.bgWhite ]}>
            <Text>
                {textForMessageBox}
            </Text>
        </View>
    )
}