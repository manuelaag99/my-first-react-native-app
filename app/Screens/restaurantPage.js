import { useState } from "react";
import { ScrollView, Text, TouchableHighlight, View } from "react-native";
import { t, tw, tailwind } from "react-native-tailwindcss";
import ModalTemplate from "../Components/ModalTemplate";
import NewItem from "../Components/newItem";
import { supabase } from "../supabase/client";

export default function RestaurantPage ({ route, navigation }) {
    const [modalVisibility, setModalVisibility] = useState(false);
    const [newItemVisibility, setNewItemVisibility] = useState(false);
    const [updateRestaurantVisibility, setUpdateRestaurantVisibility] = useState(false);

    const { creator_id, restaurant_id, restaurant_name, creator_name } = route.params

    async function deleteRestaurantHandle () {
        try {
            const { error } = await supabase.from("ALO-restaurants").delete().eq("restaurant_id", restaurant_id)
            if (error) console.log(error)
        } catch (err) {
            console.log(err)
        }
        setModalVisibility(false);
        navigation.navigate("User");
    }

    return (
        <ScrollView style={[ t.bgGray200 ]}>
            <View style={[ t.flex, t.flexCol, tw.justifyStart, t.pX5, tw.hFull, tw.wFull, tw.overflowHidden, tw.pY5 ]}>
                <View style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, tw.mXAuto, tw.pY4, tw.mY4 ]}>
                    <Text style={[ tw.wFull, t.textCenter, t.fontBold, t.text4xl, tw.pY5 ]}>
                        {restaurant_name}
                    </Text>
                    <Text style={[ tw.wFull, t.textCenter, t.fontBold, t.text2xl ]}>
                        creado por {creator_name}
                    </Text>
                </View>

                <TouchableHighlight underlayColor="#ccc" onPress={() => setNewItemVisibility(true)} style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, t.bgWhite, tw.border, tw.borderGray200, tw.mXAuto, tw.pY6, tw.mY6, tailwind.roundedLg ]}>
                    <Text style={[ t.textCenter, t.fontBold, t.textBlack  ]}>
                        + Agregar orden
                    </Text>
                </TouchableHighlight>

                <TouchableHighlight underlayColor="#ffdd00" onPress={() => navigation.navigate("Orders", { creator_id: creator_id, restaurant_id: restaurant_id })} style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, t.bgYellow500, tw.mXAuto, tw.pY6, tw.mY6, tailwind.roundedLg ]}>
                    <Text style={[ t.textCenter, t.fontBold, t.textWhite  ]}>
                        Ver órdenes
                    </Text>
                </TouchableHighlight>

                <TouchableHighlight underlayColor="#CCE5FF" onPress={() => navigation.navigate("Menu", { creator_id: creator_id, restaurant_id: restaurant_id })} style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, t.bgBlue400, tw.mXAuto, tw.pY6, tw.mY6, tailwind.roundedLg ]}>
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

                <NewItem dishesToUpdate={null} isUpdating={false} isVisible={newItemVisibility} itemId={null} itemToAdd="order" itemToUpdate={null} onClose={() => setNewItemVisibility(false)} restaurantId={restaurant_id} textForAddButton="AGREGAR" topText="Nueva orden" />
                <NewItem dishesToUpdate={null} isUpdating={true} isVisible={updateRestaurantVisibility} itemId={restaurant_id} itemToAdd="restaurant" itemToUpdate={route.params} onClose={() => setUpdateRestaurantVisibility(false)} restaurantId={restaurant_id} textForAddButton="ACTUALIZAR" topText="Modificar restaurante" />
                <ModalTemplate isVisible={modalVisibility} onClose={() => setModalVisibility(false)} onPressingRedButton={deleteRestaurantHandle} textForButton="Eliminar" textForModal="¿Quieres eliminar este restaurante? Esto es permanente." />
            </View>
        </ScrollView>
    )
}