import { useState } from "react";
import { Button, ImageBackground, StyleSheet, Text, TextInput, TouchableHighlight, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { t, tw } from "react-native-tailwindcss"

const imageurl = { uri: "https://www.wcrf-uk.org/wp-content/uploads/2021/06/588595864r-LS.jpg" }

export default function HomeScreen () {
    const [order, setOrder] = useState()
    const [listOfOrders, setListOfOrders] = useState([]);

    function changeHandle (event) {
        console.log(event)
        setOrder(event)
        // console.log(e.target.value)
    }

    function addButtonHandle () {
        setListOfOrders([...listOfOrders, order]);
        setOrder("");
    }

    const insets = useSafeAreaInsets();
    return (
        <View style={[[ t.flex, t.justifyCenter, tw.wFull, tw.hScreen ], { paddingTop: insets.top}]}>
            <ImageBackground source={imageurl} style={[ t.flex, t.justifyCenter, tw.wFull, tw.hFull ]}>
                <View style={[ t.flex, t.flexCol, t.justifyCenter, tw.h3_5, tw.wFull ]}>
                    <View style={[ t.flex, t.flexCol, tw.wAuto, t.justifyCenter, tw.h2_5, tw.pX2 ]}>
                        <View style={[ t.flex, t.flexCol, tw.wFull, t.justifyCenter, tw.h2_5 ]}>
                            <Text style={[ tw.bgBlack, t.textWhite, tw.text3xl, tw.pY2, t.textCenter ]}>Write down the order below</Text>
                            <View style={[ t.flex, t.flexRow ]}>
                                <TextInput style={[ tw.w4_5, tw.bgWhite, tw.pX4 ]} onChangeText={changeHandle} value={order} />
                                <TouchableHighlight style={[ tw.w1_5, tw.bgRed400, t.p3]} onPress={addButtonHandle} >
                                    <Text style={[tw.textCenter]}>ADD</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                        <View style={[ t.flex, t.flexCol, tw.wAuto, tw.h3_5, t.overflowHidden, tw.bgWhite, tw.borderY, tw.borderSolid, t.justifyCenter, tw.flexGrow ]}>
                            <View style={[ t.flex, tw.wFull, t.justifyCenter, tw.bgWhite, tw.borderY, tw.borderSolid, tw.mXAuto, tw.pY1 ]}>
                                <Text style={[ t.textCenter, tw.wFull ]}>List of orders:</Text>
                            </View>
                            {listOfOrders && listOfOrders.map((order, index) => {
                                return <View key={index} style={[ t.flex, tw.wFull, t.justifyCenter, tw.bgWhite, tw.borderY, tw.borderSolid, tw.mXAuto, tw.pY1 ]}>
                                    <Text style={[ tw.mY3, t.textCenter, tw.wFull, tw.hAuto ]}>{order}</Text>
                                </View>
                            })}
                        </View>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}