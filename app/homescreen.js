import { useState } from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const imageurl = { uri: "https://www.wcrf-uk.org/wp-content/uploads/2021/06/588595864r-LS.jpg" }

export default function HomeScreen () {
    const [order, setOrder] = useState()
    const [listOfOrders, setListOfOrders] = useState([]);

    function changeHandle (e) {
        setOrder(e.target.value)
        console.log(e.target.value)
    }

    const insets = useSafeAreaInsets();
    return (
        <View style={{ flex: 1, paddingTop: insets.top, alignSelf: "baseline" }}>
            <ImageBackground source={imageurl} style={{ flex: 1, justifyContent: "center", width: "100%" }}>
                <Text style={{ backgroundColor: "#000000a0", color: "#fff", fontSize: 40 }}>yeahhhhhhh</Text>
                <input type="text" placeholder="Write the order here" onChange={changeHandle} />
            </ImageBackground>
        </View>
    );
}