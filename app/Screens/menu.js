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

    useEffect(() => {
        setOrdersArray(["thing 1", "thing 2", "thing 2", "thing 2", "thing 2", "thing 2", "thing 2", "thing 2", "thing 2"])
    }, [])

    return (
        <ScrollView>
            <View style={[ t.flex, t.flexCol, tw.justifyStart, tw.hFull, tw.wFull, t.pX5, t.pT6, t.pB10 ]}>
                <TouchableHighlight underlayColor="#ccc" onPress={() => setNewItemVisibility(true)} style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, t.bgWhite, tw.border, tw.borderGray200, tw.mXAuto, tw.pY6, tw.mY6, tailwind.roundedLg ]}>
                    <Text style={[ t.textCenter, t.fontBold, t.textBlack  ]}>
                        + Agregar platillo
                    </Text>
                </TouchableHighlight>

                <View style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, tw.mXAuto, tailwind.roundedLg, tw.mY6 ]}>
                    {!ordersArray && <View style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, t.bgYellow500, tw.border, tw.borderGray200, tw.mXAuto, tw.pY6, tailwind.roundedLg ]}>
                        <Text style={[ t.textCenter, t.fontBold, t.textWhite  ]}>
                            No hay platillos
                        </Text>
                    </View>}
                    {ordersArray && <TouchableHighlight underlayColor="#CCE5FF" onPress={() => setOrdersArrayVisibility(!ordersArrayVisibility)} style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, t.bgBlue400, tw.border, tw.borderGray200, tw.mXAuto, tw.pY6, tailwind.roundedLg ]}>
                        <Text style={[ t.textCenter, t.fontBold, t.textWhite  ]}>
                            Platillos
                        </Text>
                    </TouchableHighlight>}
                    {ordersArray && ordersArrayVisibility && ordersArray.map((order, index) => {
                        return (
                            <TouchableHighlight key={index} style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, tw.borderB, tw.borderGray300, tw.mXAuto, tw.pY6, tailwind.roundedLg ]}>
                                <Text style={[ t.textCenter, t.fontBold, t.textBlack  ]}>
                                    {order}
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