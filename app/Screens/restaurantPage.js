import { useState } from "react";
import { Modal, ScrollView, Text, TouchableHighlight, View } from "react-native";
import { t, tw, tailwind } from "react-native-tailwindcss";
import ModalTemplate from "../Components/ModalTemplate";
import NewOrder from "../Components/newOrder";

export default function RestaurantPage ({ route, navigation }) {
    const [modalVisibility, setModalVisibility] = useState(false);
    const [newOrderVisibility, setNewOrderVisibility] = useState(false);

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

                <TouchableHighlight underlayColor="#CCE5FF" onPress={() => navigation.navigate("Menu")} style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, t.bgBlue400, tw.mXAuto, tw.pY6, tw.mY6, tailwind.roundedLg ]}>
                    <Text style={[ t.textCenter, t.fontBold, t.textWhite  ]}>
                        Ver Menú
                    </Text>
                </TouchableHighlight>

                <TouchableHighlight underlayColor="#ccc" onPress={() => setNewOrderVisibility(true)} style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, t.bgWhite, tw.border, tw.borderGray200, tw.mXAuto, tw.pY6, tw.mY6, tailwind.roundedLg ]}>
                    <Text style={[ t.textCenter, t.fontBold, t.textBlack  ]}>
                        + Agregar orden
                    </Text>
                </TouchableHighlight>

                <TouchableHighlight underlayColor="#FFFFCC" onPress={() => navigation.navigate("Orders")} style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, t.bgYellow500, tw.mXAuto, tw.pY6, tw.mY6, tailwind.roundedLg ]}>
                    <Text style={[ t.textCenter, t.fontBold, t.textWhite  ]}>
                        Órdenes
                    </Text>
                </TouchableHighlight>

                <TouchableHighlight underlayColor="#ff6666" onPress={() => setModalVisibility(true)} style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, t.bgRed700, tw.mXAuto, tw.pY6, tw.mY16, tailwind.roundedLg ]}>
                    <Text style={[ t.textCenter, t.fontBold, t.textWhite ]}>
                        Eliminar restaurante
                    </Text>
                </TouchableHighlight>
                
                <ModalTemplate isVisible={modalVisibility} onClose={() => setModalVisibility(false)} textForButton="Eliminar" textForModal="¿Quieres eliminar este restaurante? Esto es permanente." />
                <NewOrder isVisible={newOrderVisibility} onClose={() => setNewOrderVisibility(false)} />
            </View>
        </ScrollView>
    )
}