import { Text, View } from "react-native";
import { t, tw } from "react-native-tailwindcss";

export default function Orders ({ navigation }) {
    return (
        <View style={[ t.flex, t.flexCol, tw.wFull ]}>
            <Text>
                Órdenes
            </Text>
        </View>
    )
}