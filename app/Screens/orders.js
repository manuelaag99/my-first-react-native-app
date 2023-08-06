import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableHighlight, View } from "react-native";
import { t, tw, tailwind } from "react-native-tailwindcss";
import NewItem from "../Components/newItem";
import ModalTemplate from "../Components/ModalTemplate";

export default function Orders ({ navigation }) {
    const [newItemVisibility, setNewItemVisibility] = useState(false);
    const [modalVisibility, setModalVisibility] = useState(false);
    const [ordersArray, setOrdersArray] = useState();
    const [ordersArrayVisibility, setOrdersArrayVisibility] = useState(false);

    // fetch orders
    // order them by date/time 
    // set them as state

    const ORDERSARRAY = [
        {table_number: "1", order_id: "fb3983ef-ec3b-49ac-92c1-6e9d7d4a2e2d", list_of_dishes: [{ menuItem: "Hamburguesa", notes: "sin lechuga" }, { menuItem: "Nuggets", notes: "Papas extra" }], restaurant_id: "8947488363782", creator_id: "4ff038cb-0fe5-494b-80fe-89bbc5cdeb22"},
        {table_number: "4", order_id: "6bb75b70-869e-4cfd-9046-b7fe79581b9d", list_of_dishes: [{ menuItem: "Tacos", notes: "sin cebolla" }, { menuItem: "", notes: "" }], restaurant_id: "8947488363782", creator_id: "4ff038cb-0fe5-494b-80fe-89bbc5cdeb22"},
        {table_number: "2", order_id: "e483f181-cb47-402e-9083-061197b22004", list_of_dishes: [{ menuItem: "", notes: "" }, { menuItem: "", notes: "" }], restaurant_id: "8947488363782", creator_id: "4ff038cb-0fe5-494b-80fe-89bbc5cdeb22"},
        {table_number: "5", order_id: "83dfshsa-b6rh-0oda-2rda-63td5wasdf04", list_of_dishes: [{ menuItem: "", notes: "" }, { menuItem: "", notes: "" }], restaurant_id: "1453414652716", creator_id: "4ff038cb-0fe5-494b-80fe-89bbc5cdeb22"}
    ]

    useEffect(() => {
        setOrdersArray(ORDERSARRAY)
    }, [])

    function clearOrdersArray () {
        setOrdersArray()
        // then, delete from database
        setModalVisibility(false)
    }

    function pressOrderHandle (order) {
        console.log(order)
    }

    return (
        <ScrollView>
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
                    {ordersArray && <TouchableHighlight underlayColor="#ffdd00" onPress={() => setOrdersArrayVisibility(!ordersArrayVisibility)} style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, t.bgYellow500, tw.border, tw.borderGray200, tw.mXAuto, tw.pY6, tailwind.roundedLg ]}>
                        <Text style={[ t.textCenter, t.fontBold, t.textWhite  ]}>
                            Órdenes
                        </Text>
                    </TouchableHighlight>}
                    {ordersArray && ordersArrayVisibility && ordersArray.map((order, index) => {
                        return (
                            <TouchableHighlight key={index} onPress={() => pressOrderHandle(order.order_id)} style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, tw.borderB, tw.borderGray300, tw.mXAuto, tw.pY6, tailwind.roundedLg ]} underlayColor="#FFF69A">
                                <View>
                                    <Text style={[ t.textCenter, t.fontBold, t.textBlack  ]}>
                                        Mesa {order.table_number}
                                    </Text>
                                    {order.list_of_dishes && order.list_of_dishes.map((dish, index) => {
                                        return (
                                            <Text key={index} style={[ t.textCenter, t.fontBold, t.textBlack  ]}>
                                                Platillo: {dish.menuItem}, Notas: {dish.notes}
                                            </Text>
                                        )
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
                
                <NewItem topText="Nueva orden"  isVisible={newItemVisibility}  itemToAdd="order" onClose={() => setNewItemVisibility(false)} />
                <ModalTemplate isVisible={modalVisibility} onClose={() => setModalVisibility(false)} onPressingRedButton={clearOrdersArray} textForButton="Borrar" textForModal="¿Quieres borrar la lista de órdenes? Esto es permanente." />
            </View>
        </ScrollView>
    )
}