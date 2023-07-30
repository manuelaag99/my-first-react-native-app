import { useEffect, useState } from "react";
import { Button, ImageBackground, StyleSheet, Text, TextInput, TouchableHighlight, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { t, tw } from "react-native-tailwindcss"

const imageurl = { uri: "https://www.wcrf-uk.org/wp-content/uploads/2021/06/588595864r-LS.jpg" };

export default function HomeScreen () {
    const [order, setOrder] = useState({ tableNumber: "", date: "", listOfDishes: "" });
    const [dish, setDish] = useState({ menuItem: "", notes: "" });
    const [queue, setQueue] = useState([]);

    const [doneOrders, setDoneOrders] = useState([]);
    const [deletedOrders, setDeletedOrders] = useState([]);

    // let orderDate;
    // useEffect(() => {
    //     orderDate = new Date();
    //     setOrder({ ...order, date: orderDate });
    // }, [])

    // console.log(orderDate)

    function tableNumberChangeHandle (event) {
        setOrder({ ...order, tableNumber: event });
    }

    function dateChangeHandle (event) {
        setOrder({ ...order, date: event });
    }

    function dishChangeHandle (field, text) {
        setDish({ ...dish, [field]: text });
    }


    function addDishHandle () {
        // setOrder({ ...order, listOfDishes: dish });
        setOrder((prevState) => ({
            ...prevState,
            listOfDishes: [...prevState.listOfDishes, dish],
        }));
        setDish({ menuItem: "", notes: "" })
        
    };

    function addToQueueHandle () {
        setQueue([ ...queue, order ])
    }

    function clearButtonHandle () {
        setQueue([]);
    }

    function doneButtonHandle(event) {
        setDoneOrders([...doneOrders, order]);
    }

    function deleteButtonHandle() {
        setDeletedOrders([...deletedOrders, order])
    }

    console.log(order);
    if (order) {
        console.log(order.listOfDishes)
    }

    const insets = useSafeAreaInsets();
    return (
        <View style={[[ t.flex, t.justifyCenter, tw.wFull, tw.hScreen ], { paddingTop: insets.top}]}>
            <ImageBackground source={imageurl} style={[ t.flex, t.justifyCenter, tw.wFull, tw.hFull ]}>
                <View style={[ t.flex, t.flexCol, t.justifyCenter, tw.h2_5, tw.wFull ]}>
                    
                    <View style={[ t.flex, t.flexCol, tw.wAuto, t.justifyCenter, tw.h2_5, tw.pX2 ]}>
                        <View style={[ t.flex, t.flexCol, tw.wFull, t.justifyCenter, tw.h2_5 ]}>
                            <Text style={[ tw.bgBlack, t.textWhite, tw.text3xl, tw.p3, t.textCenter ]}>Escribe aquí detalles de la orden:</Text>
                            <View style={[ t.flex, t.flexCol, tw.wAuto ]}>
                                <View style={[ t.flex, t.flexRow, tw.wFull ]}>
                                    <TextInput placeholder="# de mesa" style={[ tw.w1_2, tw.bgWhite, tw.pX4, t.p1 ]} onChangeText={tableNumberChangeHandle} value={order.tableNumber} />
                                    <TextInput placeholder="Hora" style={[ tw.w1_2, tw.bgWhite, tw.pX4, t.p1 ]} onChangeText={dateChangeHandle} value={order.date} />
                                </View>
                                
                                <View style={[ t.flex, t.flexCol, tw.wFull ]}>
                                    <View style={[ t.flex, t.flexRow, tw.wFull]}>
                                        <View style={[ t.flex, t.flexCol, tw.w5_6]}>
                                            <TextInput placeholder="Orden" style={[ tw.wFull, tw.bgWhite, tw.pX4, t.pY1 ]} onChangeText={(text) => dishChangeHandle("menuItem", text)} value={dish.menuItem} />
                                            <TextInput placeholder="Notas o especificaciones" style={[ tw.wFull, tw.bgWhite, tw.pX4, t.pY1 ]} onChangeText={(text) => dishChangeHandle("notes", text)} value={dish.notes} />
                                        </View>
                                        <View style={[ t.flex, t.flexCol, tw.w1_6 ]}>
                                            <TouchableHighlight style={[ tw.wFull, tw.bgYellow300 ]} onPress={addDishHandle} >
                                                <Text style={[tw.textCenter, t.text4xl ]}>+</Text>
                                            </TouchableHighlight>
                                        </View>
                                    </View>
                                    {(order) && (order.listOfDishes) && order.listOfDishes.map((order, index) => {
                                        return (<View key={index} style={[ t.flex, t.flexRow, tw.wFull, t.bgWhite]}>
                                            <View style={[ t.flex, t.flexCol, tw.w5_6, t.pY1 ]}>
                                                <Text style={[tw.textLeft, tw.pX4, t.pY1, tw.w5_6 ]}>Platillo: {order.menuItem}</Text>
                                                <Text style={[tw.textLeft, tw.pX4, t.pY1, tw.w5_6 ]}>Notas: {order.notes}</Text>
                                            </View>
                                            <TouchableHighlight style={[ tw.w1_6, tw.bgRed500 ]} onPress={doneButtonHandle} >
                                                <Text style={[tw.textCenter, tw.mY3 ]}>BORRAR</Text>
                                            </TouchableHighlight>
                                        </View>)
                                    })}
                                </View>

                                <View style={[ t.flex, t.flexRow, tw.wFull]}>
                                    <TouchableHighlight style={[ tw.wFull, tw.bgBlue400, t.p3]} onPress={addToQueueHandle} >
                                        <Text style={[tw.textCenter, t.fontBold ]}>AGREGAR ORDEN</Text>
                                    </TouchableHighlight>
                                </View>
                            </View>
                        </View>

                        <View style={[ t.flex, t.flexCol, tw.wAuto, tw.h3_5, t.overflowHidden, tw.bgWhite, tw.borderY, tw.borderSolid, t.justifyCenter, t.mY3 ]}>
                            <View style={[ t.flex, tw.wFull, t.justifyCenter, tw.bgWhite, tw.borderY, tw.borderSolid, tw.mXAuto, tw.pY1, tw.mY0 ]}>
                                <Text style={[ t.textCenter, tw.wFull ]}>Lista de órdenes:</Text>
                            </View>

                            {queue && queue.map((item, index) => {
                                return <View key={index} style={[ t.flex, t.flexRow, tw.wFull, t.justifyCenter, tw.bgWhite, tw.borderY, tw.borderSolid, tw.mXAuto, tw.mY0 ]}>
                                    <Text style={[ tw.mY3, t.textCenter, tw.w3_5, tw.hAuto ]}>{item.tableNumber}</Text>
                                    <TouchableHighlight style={[ tw.w1_5, tw.bgBlue400 ]} onPress={doneButtonHandle} >
                                        <Text style={[tw.textCenter, tw.mY3, t.fontBold ]}>DONE</Text>
                                    </TouchableHighlight>
                                    <TouchableHighlight style={[ tw.w1_5, tw.bgRed400 ]} onPress={deleteButtonHandle} >
                                        <Text style={[tw.textCenter, tw.mY3, t.fontBold ]}>DELETE</Text>
                                    </TouchableHighlight>
                                </View>
                            })}

                            {!queue && <View style={[ t.flex, t.flexRow, tw.wFull, t.justifyCenter, tw.bgWhite, tw.borderY, tw.borderSolid, tw.mXAuto, tw.mY0 ]}>
                                <Text style={[tw.textCenter, tw.mY3, t.fontBold ]}>You haven't written down any orders yet...</Text>
                            </View>}

                        </View>
                    </View>

                    <View style={[ tw.flex, tw.flexRow, tw.wAuto, tw.pX2, tw.mY3 ]}>
                            <TouchableHighlight style={[ tw.wFull, tw.p3, tw.bgRed400 ]} onPress={clearButtonHandle}>
                                <Text style={[ t.textCenter ]}>Borrar lista</Text>
                            </TouchableHighlight>

                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}