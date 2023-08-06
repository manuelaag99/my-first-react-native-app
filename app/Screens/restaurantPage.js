import { useState } from "react";
import { Modal, ScrollView, Text, TouchableHighlight, View } from "react-native";
import { t, tw, tailwind } from "react-native-tailwindcss";
import ModalTemplate from "../Components/ModalTemplate";
import NewItem from "../Components/newItem";

export default function RestaurantPage ({ route, navigation }) {
    const [modalVisibility, setModalVisibility] = useState(false);
    const [newItemVisibility, setNewItemVisibility] = useState(false);
    const [updateRestaurantVisibility, setUpdateRestaurantVisibility] = useState(false);

    console.log(route.params)
    return (
        <ScrollView>
            <View style={[ t.flex, t.flexCol, tw.justifyStart, t.pX5, tw.hFull, tw.wScreen, t.bgWhite, tw.overflowHidden, tw.pY5 ]}>
                <View style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, tw.mXAuto, tw.pY4, tw.mY4 ]}>
                    <Text style={[ tw.wFull, t.textCenter, t.fontBold, t.text4xl, tw.pY5 ]}>
                        Nombre
                    </Text>
                    <Text style={[ tw.wFull, t.textCenter, t.fontBold, t.text2xl ]}>
                        creado por nombre de creador
                    </Text>
                </View>

                <TouchableHighlight underlayColor="#ccc" onPress={() => setNewItemVisibility(true)} style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, t.bgWhite, tw.border, tw.borderGray200, tw.mXAuto, tw.pY6, tw.mY6, tailwind.roundedLg ]}>
                    <Text style={[ t.textCenter, t.fontBold, t.textBlack  ]}>
                        + Agregar orden
                    </Text>
                </TouchableHighlight>

                <TouchableHighlight underlayColor="#ffdd00" onPress={() => navigation.navigate("Orders")} style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, t.bgYellow500, tw.mXAuto, tw.pY6, tw.mY6, tailwind.roundedLg ]}>
                    <Text style={[ t.textCenter, t.fontBold, t.textWhite  ]}>
                        Ver órdenes
                    </Text>
                </TouchableHighlight>

                <TouchableHighlight underlayColor="#CCE5FF" onPress={() => navigation.navigate("Menu")} style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, t.bgBlue400, tw.mXAuto, tw.pY6, tw.mY6, tailwind.roundedLg ]}>
                    <Text style={[ t.textCenter, t.fontBold, t.textWhite  ]}>
                        Ver Menú
                    </Text>
                </TouchableHighlight>

                <TouchableHighlight underlayColor="#ccc" onPress={() => setUpdateRestaurantVisibility(true)} style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, t.bgWhite, tw.border, tw.borderGray200, tw.mXAuto, tw.pY6, tw.mT20, tw.mB6, tailwind.roundedLg ]}>
                    <Text style={[ t.textCenter, t.fontBold, t.textBlack  ]}>
                        Modificar restaurante
                    </Text>
                </TouchableHighlight>
                
                <TouchableHighlight underlayColor="#ff6666" onPress={() => setModalVisibility(true)} style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, t.bgRed700, tw.mXAuto, tw.pY6, tw.mY6, tailwind.roundedLg ]}>
                    <Text style={[ t.textCenter, t.fontBold, t.textWhite ]}>
                        Eliminar restaurante
                    </Text>
                </TouchableHighlight>
                
                <NewItem topText="Nueva orden" isVisible={newItemVisibility}  itemToAdd="order" onClose={() => setNewItemVisibility(false)} />
                <NewItem topText="Modificar restaurante" isVisible={updateRestaurantVisibility}  itemToAdd="restaurant" onClose={() => setUpdateRestaurantVisibility(false)} />
                <ModalTemplate isVisible={modalVisibility} onClose={() => setModalVisibility(false)} textForButton="Eliminar" textForModal="¿Quieres eliminar este restaurante? Esto es permanente." />
            </View>
        </ScrollView>
    )
}