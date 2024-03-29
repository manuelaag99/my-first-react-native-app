import { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView } from "react-native";
import { Text, TextInput, TouchableHighlight, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { t, tw, tailwind } from "react-native-tailwindcss";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../supabase/client";
import Icon from 'react-native-vector-icons/FontAwesome';

import ErrorModal from "./ErrorModal";
import ListToSelect from "./ListToSelect";

export default function NewItem ({ dishesToUpdate, isUpdating, isVisible, itemId, itemToAdd, itemToUpdate, onClose, restaurantId, textForAddButton, topText, updateFetchedData, userId }) {
    // let user_id = "4ff038cb-0fe5-494b-80fe-89bbc5cdeb22";
    let email = "manuelaag99@gmail.com"

    const [errorModalVisibility, setErrorModalVisibility] = useState(false);
    const [errorMessage, setErrorMessage] = useState();

    const [restaurantInfo, setRestaurantInfo] = useState({ restaurant_name: "", restaurant_description: "" });
    function restaurantNameChangeHandle (event) {
        setRestaurantInfo({ ...restaurantInfo, restaurant_name: event });
    }
    function restaurantDescriptionChangeHandle (event) {
        setRestaurantInfo({ ...restaurantInfo, restaurant_description: event });
    }
    async function addOrUpdateRestaurant () {
        let generated_restaurant_id = uuidv4()
        try {
            if (!isUpdating) {
                const { error } = await supabase.from("ALO-restaurants").insert({ creator_id: userId, restaurant_name: restaurantInfo.restaurant_name, restaurant_description: restaurantInfo.restaurant_description, restaurant_id: generated_restaurant_id });
                if (error) console.log(error)
            } else {
                const { error } = await supabase.from("ALO-restaurants").update({ restaurant_name: restaurantInfo.restaurant_name, restaurant_description: restaurantInfo.restaurant_description }).eq("restaurant_id", itemId);
                if (error) console.log(error)
            }            
        } catch (err) {
            console.log(err);
        }
        let generated_administrator_id = uuidv4();
        if (!isUpdating) {
            try {
                const { error } = await supabase.from("ALO-admins").insert({ administrator_id: generated_administrator_id, user_id: userId, restaurant_id: generated_restaurant_id });
                if (error) console.log(error)
            } catch (err) {
                console.log(err);
            }   
        }
        onClose();
        updateFetchedData();
        setRestaurantInfo({ restaurant_name: "" });
    }



    const [menuItems, setMenuItems] = useState({ menu_item_name: "", menu_item_description: "" });
    function itemNameChangeHandle (event) {
        setMenuItems({ ...menuItems, menu_item_name: event });
    }
    function itemDescriptionChangeHandle (event) {
        setMenuItems({ ...menuItems, menu_item_description: event });
    }
    async function addOrUpdateMenuItem () {
        if (menuItems.menu_item_name === null || menuItems.menu_item_name.trim() === "") {
            setErrorMessage("Debes incluir un nombre del platillo.");
            setErrorModalVisibility(true);
        } else if (menuItems.menu_item_description === null || menuItems.menu_item_description.trim() === "") {
            setErrorMessage("Debes incluir una descripción del platillo.");
            setErrorModalVisibility(true);
        } else {
            let generate_menu_item_id = uuidv4();
            try {
                if (!isUpdating) {
                    const { error } = await supabase.from("ALO-restaurant-menu-items").insert({ creator_id: userId, restaurant_id: restaurantId, menu_item_id: generate_menu_item_id, menu_item_name: menuItems.menu_item_name, menu_item_description: menuItems.menu_item_description });
                    if (error) console.log(error);
                } else {
                    const { error } = await supabase.from("ALO-restaurant-menu-items").update({ menu_item_name: menuItems.menu_item_name, menu_item_description: menuItems.menu_item_description }).eq("menu_item_id", itemToUpdate.menu_item_id);
                    if (error) console.log(error);
                }            
            } catch (err) {
                console.log(err);
            }
            onClose();
            updateFetchedData();
            setMenuItems({ menu_item_name: "", menu_item_description: "" });
        }
    }
    async function deleteMenuItem () {
        try {
            const { error } = await supabase.from("ALO-restaurant-menu-items").delete().eq("menu_item_id", itemToUpdate.menu_item_id);
            if (error) console.log(error);
        } catch (err) {
            console.log(err);
        }
        onClose();
        updateFetchedData(); 
    }


    const [order, setOrder] = useState({ tableNumber: "", date: new Date().toLocaleString(), order_id: "" });
    function tableNumberChangeHandle (event) {
        setOrder({ ...order, tableNumber: event });
    }
    async function addOrUpdateOrder () {
        if (order.tableNumber === null || order.tableNumber.trim() === "" ) {
            setErrorMessage("Debes incluir número de mesa.");
            setErrorModalVisibility(true);
        } else if (!storedDishes || storedDishes.length < 1) {
            setErrorMessage("Debes incluir platillos.");
            setErrorModalVisibility(true);
        } else {
            console.log("worked")
            try {
                if (!isUpdating) {
                    const { error } = await supabase.from("ALO-restaurant-orders").insert({ creator_id: userId, restaurant_id: restaurantId, order_id: order.order_id, table_number: order.tableNumber });
                    if (error) console.log(error);
                } else {
                    const { error } = await supabase.from("ALO-restaurant-orders").update({ table_number: order.tableNumber }).eq("order_id", order.order_id);
                    if (error) console.log(error);
                }
            } catch (err) {
                console.log(err);
            }
            onClose();
            setStoredDishes();
            setOrder({ tableNumber: "", date: new Date().toLocaleString() , order_id: "" });
            updateFetchedData();
        }
    }

    
    const [dish, setDish] = useState({ menuItem: "", notes: "" });
    const [storedDishes, setStoredDishes] = useState();
    const [menuItemsListVisibility, setMenuItemsListVisibility] = useState(false);
    async function fetchStoredDishes () {
        if (itemToAdd === "order") {
            try {
                const { data, error } = await supabase.from("ALO-orders-dishes").select("*").eq("order_id", order.order_id);
                setStoredDishes(data);
                if (error) console.log(error);
            } catch (err) {
                console.log(err);
            }
        }
    }
    function dishChangeHandle (field, text) {
        setDish({ ...dish, [field]: text });
    }
    function receiveSelectedValueFromList (menuItem) {
        setDish({ ...dish, menuItem: menuItem });
        setMenuItemsListVisibility(false);
    }
    
    async function addDishHandle () {
        if (dish.menuItem === null || dish.menuItem.trim() === "" ) {
            setErrorMessage("Debes incluir un platillo.");
            setErrorModalVisibility(true);
        } else {
            let generate_dish_id = uuidv4();
            try {
                const { error } = await supabase.from("ALO-orders-dishes").insert({ creator_id: userId, restaurant_id: restaurantId, order_id: order.order_id, dish_id: generate_dish_id, dish_menu_item: dish.menuItem, dish_notes: dish.notes });
                if (error) console.log(error);
            } catch (err) {
                console.log(err);
            }
            setDish({ menuItem: "", notes: "" });
            setMenuItemsListVisibility(false);
            fetchStoredDishes();
        }
    }
    async function deleteDishHandle(order) {
        console.log(order.dish_id)
        try {
            const { error } = await supabase.from("ALO-orders-dishes").delete().eq("dish_id", order.dish_id)
            if (error) console.log(error);
        } catch (err) {
            console.log(err);
        }
        fetchStoredDishes();
    }

    let orderId;
    useEffect(() => {
        if (itemToUpdate) {
            if (itemToAdd === "restaurant") {
                setRestaurantInfo({ restaurant_name: itemToUpdate.restaurant_name, restaurant_description: itemToUpdate.restaurant_description });
            } else if (itemToAdd === "menuItem") {
                setMenuItems({ menu_item_name: itemToUpdate.menu_item_name , menu_item_description: itemToUpdate.menu_item_description });
            } else if (itemToAdd === "order") {
                setOrder({ tableNumber: itemToUpdate.table_number.toString(), date: new Date(itemToUpdate.created_at).toLocaleString(), order_id: itemToUpdate.order_id });
                setStoredDishes(dishesToUpdate);
            }
        }
    }, [itemToUpdate]);

    useEffect(() => {
        orderId = uuidv4();
        setOrder({ ...order, order_id: orderId });
    }, []);


    function addButtonHandle () {
        if (itemToAdd === "restaurant") addOrUpdateRestaurant();
        else if (itemToAdd === "menuItem") addOrUpdateMenuItem();
        else if (itemToAdd === "order") addOrUpdateOrder();
    }

    function deleteButtonHandle() {
        if (itemToAdd === "menuItem") deleteMenuItem();
    }

    function closeNewItemWindowHandle () {
        onClose();
        if (itemToAdd === "restaurant") setRestaurantInfo({ restaurant_name: "", restaurant_description: "" });
        else if (itemToAdd === "menuItem") setMenuItems({ menuItem: "", notes: "" });
        else if (itemToAdd === "order")  {
            setDish({ menuItem: "", notes: "" });
            setOrder({ tableNumber: "", date: new Date().toLocaleString(), order_id: "" });
            setStoredDishes();
        }
    }

    const insets = useSafeAreaInsets();
    return (
        <Modal animationType="fade" onRequestClose={onClose} transparent={true} visible={isVisible}>
            <View style={[[ t.flex, t.flexCol, tw.wFull, tw.hFull, t.justifyCenter, tw.pX2 ], { backgroundColor: "#00000075"}]}>

                <View style={[[ t.flex, t.flexCol, tw.wFull, t.justifyCenter, t.shadow2xl ], { height: "fit" }]}>
                    <Text style={[[ tw.bgBlack, t.textWhite, tw.text3xl, tw.p3, t.textCenter ]]}>{topText}</Text>

                    {(itemToAdd === "restaurant") && <View style={[ t.flex, t.flexCol, tw.wFull, tw.bgWhite ]}>
                        <TextInput onChangeText={restaurantNameChangeHandle} placeholder={itemToUpdate ? null : "Nombre del restaurante..."} style={[ tw.wFull, tw.pY2, tw.pX3, tw.h12 ]} value={restaurantInfo.restaurant_name} />
                        <TextInput onChangeText={restaurantDescriptionChangeHandle} placeholder={itemToUpdate ? null : "Información del restaurante..."} style={[ tw.wFull, tw.pY2, tw.pX3, tw.h12 ]} value={restaurantInfo.restaurant_description} />
                    </View>}

                    {(itemToAdd === "menuItem") && <View style={[ t.flex, t.flexCol, tw.wFull, tw.bgWhite ]}>
                        <TextInput onChangeText={itemNameChangeHandle} placeholder={itemToUpdate ? null : "Nombre del platillo..."} style={[ tw.wFull, tw.pY2, tw.pX3, tw.h12 ]} value={menuItems.menu_item_name} />
                        <TextInput onChangeText={itemDescriptionChangeHandle} placeholder={itemToUpdate ? null : "Descripción del platillo..."} style={[ tw.wFull, tw.pY2, tw.pX3, tw.h12, tw.borderT, tw.borderGray300 ]} value={menuItems.menu_item_description} />
                    </View>}
                            
                    {(itemToAdd === "order") && <View style={[[ t.flex, t.flexCol, tw.wAuto, tw.h36 ]]}>
                        <View style={[[ t.flex, t.flexRow, tw.wFull, tw.h12 ]]}>
                            <TextInput placeholder={itemToUpdate ? null : "# de mesa"} style={[ tw.w1_2, tw.bgWhite, tw.pX4, t.pY1, tw.h12 ]} onChangeText={tableNumberChangeHandle} value={order.tableNumber} />
                            <TextInput editable={false} placeholder="Hora" style={[ tw.w1_2, tw.bgWhite, tw.pX4, t.pY1, tw.h12 ]} value={order.date.split(",")[1]} />
                        </View>
                        <View style={[[ t.flex, t.flexCol, tw.wFull, tw.h24 ]]}>
                            <View style={[[ t.flex, t.flexRow, tw.wFull, tw.hFull ]]}>
                                <View style={[ t.flex, t.flexCol, tw.w5_6, tw.h24 ]}>
                                    <TextInput placeholder="Orden" style={[[ tw.wFull, tw.bgWhite, tw.pX4, t.pY1, tw.h12 ]]} onBlur={() => setMenuItemsListVisibility(false)} onChangeText={(text) => dishChangeHandle("menuItem", text)} onFocus={() => setMenuItemsListVisibility(true)} value={dish.menuItem} />                                    
                                        {menuItemsListVisibility && <ListToSelect onClose={() => setMenuItemsListVisibility(false)} restaurantId={restaurantId} searchQuery={dish.menuItem} sendSelectedValueFromList={receiveSelectedValueFromList} />}
                                    <TextInput placeholder="Notas o especificaciones" style={[[ tw.wFull, tw.bgWhite, tw.pX4, t.pY1, tw.h12 ]]} onChangeText={(text) => dishChangeHandle("notes", text)} value={dish.notes} />
                                </View>
                                <View style={[ t.flex, t.flexCol, tw.hFull, tw.w1_6 ]}>
                                    <TouchableHighlight style={[ t.flex, t.flexCol, t.justifyCenter, t.itemsCenter, tw.wFull, tw.bgYellow500, tw.hFull ]} onPress={addDishHandle} underlayColor={"#ffeebb"} >
                                        <Text style={[ t.textCenter, t.textWhite, t.text3xl ]}>
                                            <Icon name="plus" size={25} />
                                        </Text>
                                    </TouchableHighlight>
                                </View>
                            </View>
                        </View>
                    </View>}

                    <View style={[[ t.flex, t.flexCol, tw.wFull ], { flexGrow: 0, minHeight: 0, maxHeight: 120 }]}>
                        {(order) && (storedDishes) && (storedDishes.length > 0) && <ScrollView style={[[ t.flex, t.flexCol, tw.wFull ], { flexGrow: 0 }]}>
                            {storedDishes.map((order, index) => {
                                return (<View key={index} style={[ t.flex, t.flexRow, tw.wFull, t.bgWhite, t.borderT, t.borderGray200]}>
                                    <View style={[ t.flex, t.flexCol, tw.w5_6, t.pY1 ]}>
                                        <Text style={[tw.textLeft, tw.pX4, t.pY1, tw.w5_6, t.textGray600 ]}>Platillo: {order.dish_menu_item}</Text>
                                        <Text style={[tw.textLeft, tw.pX4, t.pY1, tw.w5_6, t.textGray600 ]}>Notas: {order.dish_notes}</Text>
                                    </View>
                                    <TouchableHighlight style={[ tw.w1_6, tw.bgRed500, t.flex, t.flexCol, t.justifyCenter, t.itemsCenter ]} onPress={() => deleteDishHandle(order)} underlayColor="#ffaaaa" >
                                        <Text style={[tw.textCenter, t.textWhite, tw.mY3 ]}>
                                            <Icon name="trash" size={25} />
                                        </Text>
                                    </TouchableHighlight>
                                </View>)
                            })}
                        </ScrollView>}
                    </View>

                    <View style={[ t.flex, t.flexRow, tw.wFull]}>
                        <TouchableHighlight underlayColor="#CCE5FF" style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, tw.bgBlue400, tw.h16]} onPress={addButtonHandle} >
                            <Text style={[tw.textCenter, t.fontBold, t.textWhite ]}>{textForAddButton}</Text>
                        </TouchableHighlight>
                    </View>

                    {(isUpdating) && (itemToAdd !== "restaurant") && <View style={[ t.flex, t.flexRow, tw.wFull]}>
                        <TouchableHighlight underlayColor="#ff8888" style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, tw.bgRed700, tw.h16]} onPress={deleteButtonHandle} >
                            <Text style={[tw.textCenter, t.fontBold, t.textWhite ]}>BORRAR</Text>
                        </TouchableHighlight>
                    </View>}

                    <View style={[ t.flex, t.flexRow, tw.wFull]}>
                        <TouchableHighlight underlayColor="#ff8888" style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, tw.bgRed500, tw.h16]} onPress={closeNewItemWindowHandle} >
                            <Text style={[tw.textCenter, t.fontBold, t.textWhite ]}>CANCELAR</Text>
                        </TouchableHighlight>
                    </View>

                </View>
            </View>

            <ErrorModal isVisible={errorModalVisibility} onClose={() => setErrorModalVisibility(false)} textForButton="Aceptar" textForModal={errorMessage}/>
        </Modal>
    );
}
