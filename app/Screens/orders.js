import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableHighlight, View } from "react-native";
import { t, tw, tailwind } from "react-native-tailwindcss";
import ModalTemplate from "../Components/ModalTemplate";
import NewItem from "../Components/newItem";

import { supabase } from "../supabase/client";

export default function Orders ({ navigation, route }) {
    const [newItemVisibility, setNewItemVisibility] = useState(false);
    const [modalVisibility, setModalVisibility] = useState(false);
    const [ordersArray, setOrdersArray] = useState();
    const [dishesArray, setDishesArray] = useState();
    const [ordersArrayVisibility, setOrdersArrayVisibility] = useState(false);
    const [updateOrderVisibility, setUpdateOrderVisibility] = useState(false);

    const { creator_id, restaurant_id } = route.params;

    async function fetchOrdersData () {
        try {
            const { data, error } = await supabase.from("ALO-restaurant-orders").select("*").eq("restaurant_id", restaurant_id);
            setOrdersArray(data);
            if (error) console.log(error);
        } catch (err) {
            console.log(err);
        }
    }
    async function clearOrdersData () {
        try {
            const { error } = await supabase.from("ALO-restaurant-orders").delete("*").eq("restaurant_id", restaurant_id);
            if (error) console.log(error);
        } catch (err) {
            console.log(err);
        }
    }

    async function fetchDishesData () {
        try {
            const { data, error } = await supabase.from("ALO-orders-dishes").select("*").eq("restaurant_id", restaurant_id);
            setDishesArray(data);
            if (error) console.log(error);
        } catch (err) {
            console.log(err);
        }
    }
    async function clearDishesData () {
        try {
            const { error } = await supabase.from("ALO-orders-dishes").delete("*").eq("restaurant_id", restaurant_id);
            if (error) console.log(error);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchOrdersData();
        fetchDishesData();
    }, []);

    function fetchAgain () {
        fetchOrdersData();
        fetchDishesData();
    }

    function clearOrdersArray () {
        setOrdersArray();
        clearOrdersData();
        clearDishesData();
        setModalVisibility(false);
    }

    function updateOrder (order) {
        setUpdateOrderVisibility(true);
    }

    return (
        <ScrollView style={[ t.bgGray200 ]}>
            <View style={[ t.flex, t.flexCol, tw.justifyStart, tw.hFull, tw.wFull, t.pX5, t.pT6, t.pB10 ]}>
                <TouchableHighlight underlayColor="#ccc" onPress={() => setNewItemVisibility(true)} style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, t.bgWhite, tw.border, tw.borderGray200, tw.mXAuto, tw.pY6, tw.mY6, tailwind.roundedLg ]}>
                    <Text style={[ t.textCenter, t.fontBold, t.textBlack  ]}>
                        + Agregar orden
                    </Text>
                </TouchableHighlight>

                <View style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, tw.mXAuto, tailwind.roundedLg, tw.mY6 ]}>
                    {!ordersArray && <View style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, t.bgYellow500, tw.border, tw.borderGray200, tw.mXAuto, tw.pY6, tailwind.roundedLg ]}>
                        <Text style={[ t.textCenter, t.fontBold, t.textWhite  ]}>
                            No hay órdenes
                        </Text>
                    </View>}
                    {ordersArray && <TouchableHighlight underlayColor="#ffdd00" onPress={() => setOrdersArrayVisibility(!ordersArrayVisibility)} style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, t.bgYellow500, tw.mXAuto, tw.pY6, tailwind.roundedLg ]}>
                        <Text style={[ t.textCenter, t.fontBold, t.textWhite  ]}>
                            Órdenes
                        </Text>
                    </TouchableHighlight>}
                    {ordersArray && ordersArrayVisibility && ordersArray.map((order, index) => {
                        return (
                            <TouchableHighlight key={index} onPress={() => updateOrder(order)} style={[ t.flex, t.flexCol, tw.justifyCenter, t.bgWhite, tw.wFull, tw.borderB, tw.borderGray300, tw.mXAuto, tw.pY6, tailwind.roundedLg ]} underlayColor="#FFF69A">
                                <View>
                                    <Text style={[ t.textCenter, t.fontBold, t.textBlack  ]}>
                                        Mesa {order.table_number}
                                    </Text>
                                    {dishesArray && dishesArray.map((dish, index) => {
                                        if (order.order_id === dish.order_id) {
                                            return (
                                                <Text key={index} style={[ t.textCenter, t.fontBold, t.textBlack  ]}>
                                                    Platillo: {dish.dish_menu_item}, Notas: {dish.dish_notes}
                                                </Text>
                                            )
                                        }
                                    })}
                                </View>
                            </TouchableHighlight>
                        )
                    })}
                </View>

                <TouchableHighlight underlayColor="#ff6666" onPress={() => setModalVisibility(true)} style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, t.bgRed700, tw.mXAuto, tw.pY6, tw.mY6, tailwind.roundedLg ]}>
                    <Text style={[ t.textCenter, t.fontBold, t.textWhite  ]}>
                        Borrar lista de órdenes
                    </Text>
                </TouchableHighlight>

                <View style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, tw.mXAuto, tw.mY4, tw.pX6 ]}>
                    <Text style={[ t.textCenter, t.textGray600  ]}>
                        Se recomienda borrar la lista de órdenes al final de cada día, por motivos de espacio en la base de datos
                    </Text>
                </View>
                
                <NewItem isUpdating={true} isVisible={updateOrderVisibility} itemToAdd="order" onClose={() => setUpdateOrderVisibility(false)} restaurantId={restaurant_id} textForAddButton="ACTUALIZAR" topText="Actualizar orden" updateFetchedData={fetchAgain} />
                <NewItem isUpdating={false} isVisible={newItemVisibility} itemToAdd="order" onClose={() => setNewItemVisibility(false)} restaurantId={restaurant_id} textForAddButton="AGREGAR" topText="Nueva orden" updateFetchedData={fetchAgain} />
                <ModalTemplate isVisible={modalVisibility} onClose={() => setModalVisibility(false)} onPressingRedButton={clearOrdersArray} textForButton="Borrar" textForModal="¿Quieres borrar la lista de órdenes? Esto es permanente." />
            </View>
        </ScrollView>
    )
}