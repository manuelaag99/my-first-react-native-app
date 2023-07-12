import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen () {
    const insets = useSafeAreaInsets();
    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 30 }}>This is the Home Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
})