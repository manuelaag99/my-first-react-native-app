import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableHighlight, View } from "react-native";
import { t, tw, tailwind } from "react-native-tailwindcss";
import NewItem from "../Components/newItem";
import ModalTemplate from "../Components/ModalTemplate";

export default function Orders ({ navigation }) {
    const [newItemVisibility, setNewItemVisibility] = useState(false);
    const [modalVisibility, setModalVisibility] = useState(false);
    const [menuItemsArray, setMenuItemsArray] = useState();
    const [menuItemsArrayVisibility, setMenuItemsArrayVisibility] = useState(false);

    const MENUARRAY = [
        {menu_item_name: "hamburguesa", menu_item_description: "incluye queso extraoooooooooooooooooooo", menu_item_id: "fb3983ef-ec3b-49ac-92c1-6e9d7d4a2e2d", restaurant_id: "8947488363782", creator_id: "4ff038cb-0fe5-494b-80fe-89bbc5cdeb22"},
        {menu_item_name: "nuggets", menu_item_description: "incluye papas", menu_item_id: "6bb75b70-869e-4cfd-9046-b7fe79581b9d", restaurant_id: "8947488363782", creator_id: "4ff038cb-0fe5-494b-80fe-89bbc5cdeb22"},
        {menu_item_name: "hamburguesa de pollo", menu_item_description: "incluye verduras", menu_item_id: "e483f181-cb47-402e-9083-061197b22004", restaurant_id: "8947488363782", creator_id: "4ff038cb-0fe5-494b-80fe-89bbc5cdeb22"}
    ]
    
    useEffect(() => {
        setMenuItemsArray(MENUARRAY)
    }, [])

    function pressMenuItemHandle (order) {
        console.log(order)
    }

    return (
        <ScrollView>
            <View style={[ t.flex, t.flexCol, tw.justifyStart, tw.hFull, tw.wFull, t.pX5, t.pT6, t.pB10 ]}>
                <TouchableHighlight underlayColor="#ccc" onPress={() => setNewItemVisibility(true)} style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, t.bgWhite, tw.border, tw.borderGray200, tw.mXAuto, tw.pY6, tw.mY6, tailwind.roundedLg ]}>
                    <Text style={[ t.textCenter, t.fontBold, t.textBlack  ]}>
                        + Agregar platillo
                    </Text>
                </TouchableHighlight>

                <View style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, tw.mXAuto, tailwind.roundedLg, tw.mY6 ]}>
                    {!menuItemsArray && <View style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, t.bgYellow500, tw.border, tw.borderGray200, tw.mXAuto, tw.pY6, tailwind.roundedLg ]}>
                        <Text style={[ t.textCenter, t.fontBold, t.textWhite  ]}>
                            No hay platillos
                        </Text>
                    </View>}
                    {menuItemsArray && <TouchableHighlight underlayColor="#CCE5FF" onPress={() => setMenuItemsArrayVisibility(!menuItemsArrayVisibility)} style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, t.bgBlue400, tw.border, tw.borderGray200, tw.mXAuto, tw.pY6, tailwind.roundedLg ]}>
                        <Text style={[ t.textCenter, t.fontBold, t.textWhite  ]}>
                            Platillos
                        </Text>
                    </TouchableHighlight>}
                    {menuItemsArray && menuItemsArrayVisibility && menuItemsArray.map((item, index) => {
                        return (
                            <TouchableHighlight key={index} onPress={() => pressMenuItemHandle(item.menu_item_id)} style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, tw.borderB, tw.borderGray300, tw.mXAuto, tw.pY6, tailwind.roundedLg ]} underlayColor={"#CCe5ff"} >
                                <Text style={[ t.textCenter, t.fontBold, t.textBlack, tw.pX4  ]}>
                                    {item.menu_item_name}: {item.menu_item_description}
                                </Text>
                            </TouchableHighlight>
                        )
                    })}
                </View>

                <TouchableHighlight underlayColor="#ff6666" onPress={() => setModalVisibility(true)} style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, t.bgRed700, tw.mXAuto, tw.pY6, tw.mY6, tailwind.roundedLg ]}>
                    <Text style={[ t.textCenter, t.fontBold, t.textWhite  ]}>
                        Borrar menú
                    </Text>
                </TouchableHighlight>
                
                <NewItem addItemText="Nuevo platillo" isVisible={newItemVisibility} itemToAdd="menuItem" onClose={() => setNewItemVisibility(false)} />
                <ModalTemplate isVisible={modalVisibility} onClose={() => setModalVisibility(false)} textForButton="Borrar" textForModal="¿Quieres borrar el menú? Esto es permanente." />
            </View>
        </ScrollView>
    )
}