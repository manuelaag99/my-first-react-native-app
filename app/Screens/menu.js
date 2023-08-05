import { Text, View } from "react-native";
import { t, tw } from "react-native-tailwindcss";

export default function Menu ({ navigation }) {
    return (
        <View styles={[ t.flex, t.flexCol, tw.wFull ]}>
            <Text>
                MENU
            </Text>
        </View>
    )
}