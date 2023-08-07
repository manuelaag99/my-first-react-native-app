import { useEffect, useState } from "react";
import { Modal, Pressable } from "react-native";
import { Text, TextInput, TouchableHighlight, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { t, tw, tailwind } from "react-native-tailwindcss";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../supabase/client";

export default function NewItem ({ idOfItemToUpdate, isUpdating, isVisible, itemId, itemToAdd, onClose, restaurant_id, textForAddButton, topText }) {
    let user_id = "4ff038cb-0fe5-494b-80fe-89bbc5cdeb22";
    let email = "manuelaag99@gmail.com"

    const [restaurantInfo, setRestaurantInfo] = useState({ restaurant_name: "" });
    function restaurantNameChangeHandle (event) {
        setRestaurantInfo({ ...restaurantInfo, restaurant_name: event });
    }
    async function insertNewRestaurant () {
        let generated_restaurant_id = uuidv4()
        try {
            if (!isUpdating) {
                const { error } = await supabase.from("ALO-restaurants").insert({ creator_id: user_id, restaurant_name: restaurantInfo.restaurant_name, restaurant_id: generated_restaurant_id });
                if (error) console.log(error)
            } else {
                const { error } = await supabase.from("ALO-restaurants").update({ restaurant_name: restaurantInfo.restaurant_name }).eq("restaurant_id", itemId);
                if (error) console.log(error)
            }            
        } catch (err) {
            console.log(err)
        }
        onClose();
    }



    const [menuItems, setMenuItems] = useState({ menu_item_name: "", menu_item_description: "" });
    function itemNameChangeHandle (event) {
        setMenuItems({ ...menuItems, menu_item_name: event });
    }
    function itemDescriptionChangeHandle (event) {
        setMenuItems({ ...menuItems, menu_item_description: event });
    }
    async function insertNewMenuItem () {
        let generate_menu_item_id = uuidv4()
        try {
            if (!isUpdating) {
                const { error } = await supabase.from("ALO-restaurant-menu-items").insert({ creator_id: user_id, restaurant_id: restaurant_id, menu_item_id: generate_menu_item_id, menu_item_name: menuItems.menu_item_name, menu_item_description: menuItems.menu_item_description });
                if (error) console.log(error)
            } else {
                const { error } = await supabase.from("ALO-restaurant-menu-items").update({ menu_item_name: menuItems.menu_item_name, menu_item_description: menuItems.menu_item_description }).eq("menu_item_id", idOfItemToUpdate);
                if (error) console.log(error)
            }            
        } catch (err) {
            console.log(err)
        }
        onClose();
    }




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

    function addHandle () {
        if (itemToAdd === "restaurant") insertNewRestaurant();
        else if (itemToAdd === "menuItem") insertNewMenuItem();
    }

    const insets = useSafeAreaInsets();
    return (
        <Modal animationType="fade" onRequestClose={onClose} transparent={true} visible={isVisible}>
                    <View style={[[ t.flex, t.flexCol, tw.wFull, tw.hFull, t.justifyCenter, tw.pX2 ], { backgroundColor: "#00000075"}]}>

                        <View style={[[ t.flex, t.flexCol, tw.wFull, t.justifyCenter, t.shadow2xl ], { height: "fit" }]}>
                            <Text style={[[ tw.bgBlack, t.textWhite, tw.text3xl, tw.p3, t.textCenter ]]}>{topText}</Text>

                            {(itemToAdd === "restaurant") && <View style={[ t.flex, t.flexCol, tw.wFull, tw.bgWhite ]}>
                                <TextInput onChangeText={restaurantNameChangeHandle} placeholder="Nombre del restaurante..." style={[ tw.wFull, tw.pY2, tw.pX3, tw.h12 ]} />
                            </View>}

                            {(itemToAdd === "menuItem") && <View style={[ t.flex, t.flexCol, tw.wFull, tw.bgWhite ]}>
                                <TextInput onChangeText={itemNameChangeHandle} placeholder="Nombre del platillo..." style={[ tw.wFull, tw.pY2, tw.pX3, tw.h12 ]} />
                                <TextInput onChangeText={itemDescriptionChangeHandle} placeholder="Descripción del platillo..." style={[ tw.wFull, tw.pY2, tw.pX3, tw.h12, tw.borderT, tw.borderGray300 ]} />
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
                                <TouchableHighlight underlayColor="#CCE5FF" style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, tw.bgBlue400, tw.h16]} onPress={addHandle} >
                                    <Text style={[tw.textCenter, t.fontBold, t.textWhite ]}>{textForAddButton}</Text>
                                </TouchableHighlight>
                            </View>

                            {isUpdating && <View style={[ t.flex, t.flexRow, tw.wFull]}>
                                <TouchableHighlight underlayColor="#ff8888" style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, tw.bgRed700, tw.h16]} onPress={onClose} >
                                    <Text style={[tw.textCenter, t.fontBold, t.textWhite ]}>BORRAR</Text>
                                </TouchableHighlight>
                            </View>}

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
