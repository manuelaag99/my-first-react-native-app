import { useEffect, useState } from "react";
import { ImageBackground } from "react-native";
import { Text, TextInput, TouchableHighlight, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { t, tw, tailwind } from "react-native-tailwindcss";

export default function NewOrder () {
    const [order, setOrder] = useState({ tableNumber: "", date: "", listOfDishes: "" });
    const [dish, setDish] = useState({ menuItem: "", notes: "" });
    const [queue, setQueue] = useState([]);

    const [doneOrders, setDoneOrders] = useState([]);
    const [deletedOrders, setDeletedOrders] = useState([]);

    const [usersInfo, setUsersInfo] = useState()

    useEffect(() => {
        async function fetchData () {
            try {
                const { data, error } = await supabase.from('ALO-users-db').select("*")
                setUsersInfo(data)
            } catch (err) {
                console.log(err)
            }
        }
        fetchData();
    }, []);  

    console.log(usersInfo)

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
        <View style={[[ t.flex, t.justifyCenter, tw.wFull ]]}>
                <View style={[[ t.flex, t.flexCol, t.justifyCenter, tw.h90, tw.wFull ]]}>
                    
                    <View style={[[ t.flex, t.flexCol, tw.wAuto, t.justifyCenter, tw.pX2 ], { height: "90%" }]}>

                        <View style={[[ t.flex, t.flexCol, tw.wFull, t.justifyCenter ], { height: "40%" }]}>
                            <Text style={[[ tw.bgBlack, t.textWhite, tw.text3xl, tw.p3, t.textCenter ]]}>Escribe aquí la orden:</Text>

                            <View style={[[ t.flex, t.flexCol, tw.wAuto ], { height: "fit"}]}>
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
                                        {/* <View style={[ t.flex, t.flexCol, tw.w1_6, tw.h24, tw.itemsCenter ]}> */}
                                            <TouchableHighlight style={[ t.flex, t.flexCol, tw.justifyCenter, tw.h24, tw.w1_6, tw.bgYellow300, tw.itemsCenter ]} onPress={addDishHandle} >
                                                <Text style={[tw.textCenter, t.text4xl, tw.hFull ]}>+</Text>
                                            </TouchableHighlight>
                                        {/* </View> */}
                                    </View>
                                </View>
                            </View>

                            <View style={[[ t.flex, t.flexCol, tw.wFull ]]}>
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
                </View>
        </View>
    );
}
