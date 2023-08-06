import { useEffect, useState } from "react";
import { ImageBackground, Modal, Pressable } from "react-native";
import { Text, TextInput, TouchableHighlight, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { t, tw, tailwind } from "react-native-tailwindcss";

export default function NewItem ({ addItemText, isVisible, itemToAdd, onClose }) {
    const [order, setOrder] = useState({ tableNumber: "", date: "", listOfDishes: "" });
    const [dish, setDish] = useState({ menuItem: "", notes: "" });
    const [queue, setQueue] = useState([]);

    const [doneOrders, setDoneOrders] = useState([]);
    const [deletedOrders, setDeletedOrders] = useState([]);

    let orderDate;
    useEffect(() => {
        orderDate = new Date().toLocaleString();
        setOrder({ ...order, date: orderDate });
    }, [])

    console.log(orderDate)

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
        setOrder((prevState) => ({
            ...prevState,
            listOfDishes: [...prevState.listOfDishes, dish],
        }));
        setDish({ menuItem: "", notes: "" })
    };

    function addToQueueHandle () {
        setQueue([ ...queue, order ])
    }

    function doneButtonHandle(event) {
        setDoneOrders([...doneOrders, order]);
    }

    function deleteButtonHandle() {
        setDeletedOrders([...deletedOrders, order])
    }

    const insets = useSafeAreaInsets();
    return (
        <Modal animationType="fade" onRequestClose={onClose} transparent={true} visible={isVisible}>
                    <View style={[[ t.flex, t.flexCol, tw.wFull, tw.hFull, t.justifyCenter, tw.pX2 ], { backgroundColor: "#00000075"}]}>

                        <View style={[[ t.flex, t.flexCol, tw.wFull, t.justifyCenter, t.shadow2xl ], { height: "fit" }]}>
                            <Text style={[[ tw.bgBlack, t.textWhite, tw.text3xl, tw.p3, t.textCenter ]]}>{addItemText}</Text>

                            {(itemToAdd === "restaurant") && <View style={[ t.flex, t.flexCol, tw.wFull, tw.bgWhite ]}>
                                <TextInput placeholder="Nombre del restaurante..." style={[ tw.wFull, tw.pY2, tw.pX3, tw.h12 ]} />
                            </View>}

                            {(itemToAdd === "menuItem") && <View style={[ t.flex, t.flexCol, tw.wFull, tw.bgWhite ]}>
                                <TextInput placeholder="Nombre del platillo..." style={[ tw.wFull, tw.pY2, tw.pX3, tw.h12 ]} />
                                <TextInput placeholder="Descripción del platillo..." style={[ tw.wFull, tw.pY2, tw.pX3, tw.h12, tw.borderT, tw.borderGray300 ]} />
                            </View>}
                            
                            {(itemToAdd === "order") && <View style={[[ t.flex, t.flexCol, tw.wAuto ], { height: "fit"}]}>
                                <View style={[[ t.flex, t.flexRow, tw.wFull, tw.h12 ]]}>
                                    <TextInput placeholder="# de mesa" style={[ tw.w1_2, tw.bgWhite, tw.pX4, t.pY1, tw.h12 ]} onChangeText={tableNumberChangeHandle} value={order.tableNumber} />
                                    <TextInput editable={false} placeholder="Hora" style={[ tw.w1_2, tw.bgWhite, tw.pX4, t.pY1, tw.h12 ]} onChangeText={dateChangeHandle} value={order.date.split(",")[1]} />
                                </View>
                                <View style={[[ t.flex, t.flexCol, tw.wFull, tw.h24 ]]}>
                                    <View style={[[ t.flex, t.flexRow, tw.wFull, tw.hFull ]]}>
                                        <View style={[ t.flex, t.flexCol, tw.w5_6, tw.h24 ]}>
                                            <TextInput placeholder="Orden" style={[[ tw.wFull, tw.bgWhite, tw.pX4, t.pY1, tw.h12 ]]} onChangeText={(text) => dishChangeHandle("menuItem", text)} value={dish.menuItem} />
                                            <TextInput placeholder="Notas o especificaciones" style={[[ tw.wFull, tw.bgWhite, tw.pX4, t.pY1, tw.h12 ]]} onChangeText={(text) => dishChangeHandle("notes", text)} value={dish.notes} />
                                        </View>
                                        <View style={[ t.flex, t.flexCol, tw.hFull, tw.w1_6 ]}>
                                            <TouchableHighlight style={[ t.flex, t.flexCol, tw.justifyCenter, tw.h24, tw.wFull, tw.bgYellow500 ]} onPress={addDishHandle} underlayColor={"#ffdd00"} >
                                                <Text style={ [t.textCenter, t.textWhite, t.text3xl, tw.hFull ]}>+</Text>
                                            </TouchableHighlight>
                                        </View>
                                    </View>
                                </View>
                            </View>}

                            <View style={[[ t.flex, t.flexCol, tw.wFull ]]}>
                                {(order) && (order.listOfDishes) && order.listOfDishes.map((order, index) => {
                                    return (<View key={index} style={[ t.flex, t.flexRow, tw.wFull, t.bgWhite]}>
                                        <View style={[ t.flex, t.flexCol, tw.w5_6, t.pY1 ]}>
                                            <Text style={[tw.textLeft, tw.pX4, t.pY1, tw.w5_6 ]}>Platillo: {order.menuItem}</Text>
                                            <Text style={[tw.textLeft, tw.pX4, t.pY1, tw.w5_6 ]}>Notas: {order.notes}</Text>
                                        </View>
                                        <Pressable style={[ tw.w1_6, tw.bgRed500 ]} onPress={doneButtonHandle} >
                                            <Text style={[tw.textCenter, t.textWhite, tw.mY3 ]}>BORRAR</Text>
                                        </Pressable>
                                    </View>)
                                })}
                            </View>

                            <View style={[ t.flex, t.flexRow, tw.wFull]}>
                                <TouchableHighlight underlayColor="#CCE5FF" style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, tw.bgBlue400, tw.h16]} onPress={addToQueueHandle} >
                                    <Text style={[tw.textCenter, t.fontBold, t.textWhite ]}>AGREGAR</Text>
                                </TouchableHighlight>
                            </View>

                            <View style={[ t.flex, t.flexRow, tw.wFull]}>
                                <TouchableHighlight underlayColor="#ff8888" style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, tw.bgRed500, tw.h16]} onPress={onClose} >
                                    <Text style={[tw.textCenter, t.fontBold, t.textWhite ]}>CANCELAR</Text>
                                </TouchableHighlight>
                            </View>

                        </View>
                    </View>
        </Modal>
    );
}
