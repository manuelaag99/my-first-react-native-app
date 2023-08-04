import { View } from "react-native";
import { t, tw, tailwind } from "react-native-tailwindcss";

export default function RestaurantPage ({ route, navigation }) {
    console.log(route.params)
    return (
        <View style={[ tw.flex, tw.flexCol, t.pX5, tw.hScreen, tw.wScreen, t.bgWhite ]}>
            
        </View>
    )
}