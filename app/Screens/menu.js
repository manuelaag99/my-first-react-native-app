import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableHighlight, View } from "react-native";
import { t, tw, tailwind } from "react-native-tailwindcss";
import Icon from 'react-native-vector-icons/FontAwesome';

import NewItem from "../Components/newItem";
import ModalTemplate from "../Components/ModalTemplate";
import { supabase } from "../supabase/client";

export default function Orders ({ navigation, route }) {
    const [newItemVisibility, setNewItemVisibility] = useState(false);
    const [modalVisibility, setModalVisibility] = useState(false);
    const [menuItemsArray, setMenuItemsArray] = useState([]);
    const [menuItemsArrayVisibility, setMenuItemsArrayVisibility] = useState(false);
    const [updateItemVisibility, setUpdateItemVisibility] = useState(false);
    const [menuItemToUpdate, setMenuItemToUpdate] = useState();

    const { creator_id, restaurant_id } = route.params

    async function fetchMenuData () {
        try {
            const { data, error } = await supabase.from("ALO-restaurant-menu-items").select("*").eq("restaurant_id", restaurant_id);
            setMenuItemsArray(data)
            if (error) console.log(error)
        } catch (err) {
            console.log(err)
        }
    }

    async function clearMenuData () {
        try {
            const { data, error } = await supabase.from("ALO-restaurant-menu-items").delete("*").eq("restaurant_id", restaurant_id);
            if (error) console.log(error)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchMenuData();
    }, []);

    function fetchAgain () {
        fetchMenuData();
    }

    function clearMenuHandle () {
        setMenuItemsArray()
        clearMenuData()
        setModalVisibility(false)
    }

    function updateItem (item) {
        setUpdateItemVisibility(true);
        setMenuItemToUpdate(item);
    }

    return (
        <ScrollView style={[ t.bgGray200 ]}>
            <View style={[ t.flex, t.flexCol, tw.justifyStart, tw.hFull, tw.wFull, t.pX5, t.pT6, t.pB10 ]}>
                <TouchableHighlight underlayColor="#ccc" onPress={() => setNewItemVisibility(true)} style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, t.bgWhite, tw.border, tw.borderGray200, tw.mXAuto, tw.pY6, tw.mY6, tailwind.roundedLg ]}>
                    <Text style={[ t.textCenter, t.fontBold, t.textBlack  ]}>
                        + Agregar platillo
                    </Text>
                </TouchableHighlight>

                <View style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, tw.mXAuto, tailwind.roundedLg, tw.mY6 ]}>
                    {(menuItemsArray === null || menuItemsArray.length === 0) && <View style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, t.bgBlue400, tw.border, tw.borderGray200, tw.mXAuto, tw.pY6, tailwind.roundedLg ]}>
                        <Text style={[ t.textCenter, t.fontBold, t.textWhite  ]}>
                            No hay platillos
                        </Text>
                    </View>}
                    {(menuItemsArray.length > 0) && <TouchableHighlight underlayColor="#CCE5FF" onPress={() => setMenuItemsArrayVisibility(!menuItemsArrayVisibility)} style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, t.bgBlue400, tw.mXAuto, tw.pY6, tailwind.roundedLg ]}>
                        <Text style={[ t.textCenter, t.fontBold, t.textWhite  ]}>
                            Platillos
                        </Text>
                    </TouchableHighlight>}
                    {menuItemsArray && menuItemsArrayVisibility && menuItemsArray.map((item, index) => {
                        return (
                            
                            <View key={index} style={[[ t.flex, t.flexRow, tw.justifyCenter, t.bgWhite, tw.wFull, tw.borderB, tw.borderGray200, tw.mXAuto, tailwind.roundedLg ], { height: "fit" }]}>
                                <TouchableHighlight key={index} onPress={() => updateItem(item)} style={[ t.flex, t.flexCol, tw.justifyCenter, tw.w5_6, t.bgWhite, tw.mXAuto, tw.pY6, tailwind.roundedLLg ]} underlayColor={"#CCe5ff"} >
                                    <Text style={[ t.textLeft, t.fontBold, t.textBlack, tw.pX4  ]}>
                                        {item.menu_item_name}: {item.menu_item_description}
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

                <TouchableHighlight underlayColor="#ff6666" onPress={() => setModalVisibility(true)} style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, t.bgRed700, tw.mXAuto, tw.pY6, tw.mY6, tailwind.roundedLg ]}>
                    <Text style={[ t.textCenter, t.fontBold, t.textWhite  ]}>
                        Borrar menú
                    </Text>
                </TouchableHighlight>
                
                <NewItem itemToUpdate={menuItemToUpdate} isUpdating={true} isVisible={updateItemVisibility} itemToAdd="menuItem" onClose={() => setUpdateItemVisibility(false)} restaurantId={restaurant_id} textForAddButton="ACTUALIZAR" topText="Actualizar platillo" updateFetchedData={fetchAgain} userId={creator_id} />
                <NewItem itemToUpdate={null} isUpdating={false} isVisible={newItemVisibility} itemToAdd="menuItem" onClose={() => setNewItemVisibility(false)} restaurantId={restaurant_id} textForAddButton="AGREGAR" topText="Nuevo platillo" updateFetchedData={fetchAgain} userId={creator_id} />
                <ModalTemplate isVisible={modalVisibility} onClose={() => setModalVisibility(false)} onPressingRedButton={clearMenuHandle} textForButton="Borrar" textForModal="¿Quieres borrar el menú? Esto es permanente." />
            </View>
        </ScrollView>
    )
}