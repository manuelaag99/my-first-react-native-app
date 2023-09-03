import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableHighlight, View } from "react-native";
import { t, tw, tailwind } from "react-native-tailwindcss";
import Icon from 'react-native-vector-icons/FontAwesome';

import ModalTemplate from "../Components/ModalTemplate";
import NewItem from "../Components/newItem";
import { supabase } from "../supabase/client";

export default function OrdersScreen ({ navigation, route }) {
    const [newOrderVisibility, setNewOrderVisibility] = useState(false);

    const { user_id, restaurant_id } = route.params;

    const [ordersArray, setOrdersArray] = useState();
    const [ordersArrayVisibility, setOrdersArrayVisibility] = useState(false);
    async function fetchOrdersData () {
        try {
            const { data, error } = await supabase.from("ALO-restaurant-orders").select("*").eq("restaurant_id", restaurant_id);
            setOrdersArray(data);
            if (error) console.log(error);
        } catch (err) {
            console.log(err);
        }
    }

    const [dishesArray, setDishesArray] = useState();
    async function fetchDishesData () {
        try {
            const { data, error } = await supabase.from("ALO-orders-dishes").select("*").eq("restaurant_id", restaurant_id);
            setDishesArray(data);
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

    const [actionForModal, setActionForModal] = useState();
    const [modalVisibility, setModalVisibility] = useState(false);
    function deleteAllOrders () {
        setActionForModal("¿Quieres borrar la lista de órdenes? Esto es permanente.");
        setModalVisibility(true);
    }
    function clearOrdersArray () { 
        fetchAgain();
    }

    const [orderToDelete, setOrderToDelete] = useState();
    function deleteOrder (order) {
        console.log(order)
        setOrderToDelete(order);
        setActionForModal("¿Quieres borrar esta orden? Esto es permanente.");
        setModalVisibility(true);
        // try {
        //     const { error } = await supabase.from("ALO-orders-dishes").delete("*").eq("order_id", order.order_id);
        //     if (error) console.log(error);
        // } catch (err) {
        //     console.log(err);
        // }
        // try {
        //     const { error } = await supabase.from("ALO-restaurant-orders").delete("*").eq("order_id", order.order_id);
        //     if (error) console.log(error);
        // } catch (err) {
        //     console.log(err);
        // }
    }


    const [updateOrderVisibility, setUpdateOrderVisibility] = useState(false);    
    const [orderToUpdate, setOrderToUpdate] = useState();
    const [orderToUpdateDishes, setOrderToUpdateDishes] = useState();
    function updateOrder (order) {
        setUpdateOrderVisibility(true);
        setOrderToUpdate(order);
        setOrderToUpdateDishes(dishesArray.filter((dish) => order.order_id === dish.order_id));
    }

    
    return (
        <ScrollView style={[ t.bgGray200 ]}>
            <View style={[ t.flex, t.flexCol, tw.justifyStart, tw.hFull, tw.wFull, t.pX5, t.pT6, t.pB10 ]}>
                <TouchableHighlight underlayColor="#ccc" onPress={() => setNewOrderVisibility(true)} style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, t.bgWhite, tw.border, tw.borderGray200, tw.mXAuto, tw.pY6, tw.mY6, tailwind.roundedLg ]}>
                    <Text style={[ t.textCenter, t.fontBold, t.textBlack  ]}>
                        + Agregar orden
                    </Text>
                </TouchableHighlight>

                <View style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, tw.mXAuto, tailwind.roundedLg, tw.mY6 ]}>
                    {(!ordersArray || ordersArray.length === 0) && <View style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, t.bgYellow500, tw.border, tw.borderGray200, tw.mXAuto, tw.pY6, tailwind.roundedLg ]}>
                        <Text style={[ t.textCenter, t.fontBold, t.textWhite  ]}>
                            No hay órdenes
                        </Text>
                    </View>}
                    {ordersArray && (ordersArray.length > 0) && <TouchableHighlight underlayColor="#ffeebb" onPress={() => setOrdersArrayVisibility(!ordersArrayVisibility)} style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, t.bgYellow500, tw.mXAuto, tw.pY6, tailwind.roundedLg ]}>
                        <Text style={[ t.textCenter, t.fontBold, t.textWhite  ]}>
                            Órdenes
                        </Text>
                    </TouchableHighlight>}
                    {ordersArray && ordersArrayVisibility && ordersArray.map((order, index) => {
                        return (
                            <View key={index} style={[[ t.flex, t.flexRow, tw.justifyCenter, t.bgWhite, tw.wFull, tw.borderB, tw.borderGray200, tw.mXAuto, tailwind.roundedLg ], { height: "fit" }]}>
                                <TouchableHighlight onPress={() => updateOrder(order)} style={[ t.flex, t.flexCol, tw.justifyCenter, t.w4_6, tailwind.roundedLLg ]} underlayColor="#FFF69A">
                                    <View style={[ t.flex, t.flexCol, tw.justifyCenter, t.wFull, tw.pX4, tw.pY6 ]}>
                                        <Text style={[ t.textLeft, t.fontBold, t.textBlack ]}>
                                            Mesa {order.table_number}
                                        </Text>
                                        {dishesArray && dishesArray.map((dish, index) => {
                                            if (order.order_id === dish.order_id) {
                                                return (
                                                    <Text key={index} style={[ t.textLeft, t.fontBold, t.textBlack ]}>
                                                        Platillo: {dish.dish_menu_item}, Notas: {dish.dish_notes}
                                                    </Text>
                                                )
                                            }
                                        })}
                                    </View>
                                </TouchableHighlight>
                                <TouchableHighlight onPress={() => deleteOrder(order)} style={[ t.flex, tw.justifyCenter, tw.w1_6 ]} underlayColor="#22ff88">
                                    <Text style={[ t.textCenter ]}>
                                        <Icon name="check" size={25} />
                                    </Text>
                                </TouchableHighlight>
                                <TouchableHighlight onPress={() => deleteOrder(order)} style={[ t.flex, tw.justifyCenter, tw.w1_6, tailwind.roundedRLg ]} underlayColor="#ff0055">
                                    <Text style={[ t.textCenter ]}>
                                        <Icon name="trash" size={25} />
                                    </Text>
                                </TouchableHighlight>
                            </View>
                        )
                    })}
                </View>

                <TouchableHighlight underlayColor="#ff6666" onPress={deleteAllOrders} style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, t.bgRed700, tw.mXAuto, tw.pY6, tw.mY6, tailwind.roundedLg ]}>
                    <Text style={[ t.textCenter, t.fontBold, t.textWhite  ]}>
                        Borrar lista de órdenes
                    </Text>
                </TouchableHighlight>

                <View style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, tw.mXAuto, tw.mY4, tw.pX6 ]}>
                    <Text style={[ t.textCenter, t.textGray600 ]}>
                        Se recomienda borrar la lista de órdenes al final de cada día, por motivos de espacio en la base de datos
                    </Text>
                </View>
                
                <NewItem dishesToUpdate={orderToUpdateDishes} isUpdating={true} isVisible={updateOrderVisibility} itemToAdd="order" itemToUpdate={orderToUpdate} onClose={() => setUpdateOrderVisibility(false)} restaurantId={restaurant_id} textForAddButton="ACTUALIZAR" topText="Actualizar orden" updateFetchedData={fetchAgain} userId={user_id} />
                <NewItem dishesToUpdate={null} isUpdating={false} isVisible={newOrderVisibility} itemToAdd="order" itemToUpdate={null} onClose={() => setNewOrderVisibility(false)} restaurantId={restaurant_id} textForAddButton="AGREGAR" topText="Nueva orden" updateFetchedData={fetchAgain} userId={user_id} />
                <ModalTemplate actionButtonBorder={tw.borderRed700} actionButtonColor={tw.bgRed700} isVisible={modalVisibility} onClose={() => setModalVisibility(false)} onTasksAfterAction={clearOrdersArray} orderToDelete={orderToDelete} restaurantId={restaurant_id} textForButton="Borrar" textForModal={actionForModal} userId={user_id} />
            </View>
        </ScrollView>
    )
}