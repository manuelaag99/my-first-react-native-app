import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function HomeScreen () {

    const insets = useSafeAreaInsets();
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingTop: insets.top }}>
            <View style={{ height: "50%", width: "100%", flex: 2 }}>
                <View style={{ width: "50%" }}>
                    <Text>Nice</Text>
                </View>
                <View style={{ width: "50%" }}>
                    <Text>Thingsss</Text>
                </View>
            </View>
            <View style={{ width: "100%", height: "50%" }}>
                <Text style={{ color: "#ff0000", fontSize: 30, fontWeight: "bold" }}>MEXIA'S TACOS</Text>
            </View>
        </View>
    );
}
