import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableHighlight, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { t, tw, tailwind } from "react-native-tailwindcss";
import { supabase } from "../supabase/client";

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ModalTemplate from "../Components/ModalTemplate";
import NewItem from "../Components/newItem";

export default function UserProfile ({ navigation }) {
    const [newRestaurantVisibility, setNewRestaurantVisibility] = useState(false);
    const [modalVisibility, setModalVisibility] = useState(false);
    const [user, setUser] = useState();
    const [restaurants, setRestaurants] = useState();

    const [usersInfo, setUsersInfo] = useState();
    let email = "manuelaag99@gmail.com"
    let user_id = "4ff038cb-0fe5-494b-80fe-89bbc5cdeb22";

    async function fetchData () {
        try {
            const { data, error } = await supabase.from("ALO-users-db").select("*").eq("user_id", user_id);
            setUsersInfo(data[0])
            if (error) console.log(error)
        } catch (err) {
            console.log(err)
        }
        try {
            const { data, error } = await supabase.from("ALO-restaurants").select("*").eq("creator_id", user_id);
            setRestaurants(data)
            if (error) console.log(error)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        setUser(usersInfo)
        // if (usersInfo) {
        //     setRestaurants(usersInfo.user_restaurants);
        // }
    }, [usersInfo])

    const insets = useSafeAreaInsets();

    if (!user) {
        return (
            <ActivityIndicator style={[ tw.mT10]} size="large" color="#000" />
        )
    } else {
        return (
            <ScrollView>
                <View style={[[ tw.flex, tw.flexCol, t.pX5, t.pB10, tw.hScreen, tw.wScreen, t.bgWhite ], { paddingTop: insets.top }]}>

                    <View style={[ tw.flex, tw.flexCol, tw.justifyCenter, tw.wFull, tw.hFull, tw.mXAuto ]}>
                        <View style={[ tw.flex, tw.flexRow, tw.justifyCenter, tw.wFull, tw.mY6 ]}>
                            <Text style={[ t.textCenter, tw.mXAuto, tw.wFull, t.fontBold, t.text2xl, t.italic ]}>A LA ORDEN</Text>
                        </View>

                        <View style={[ tw.flex, tw.flexCol, tw.justifyCenter, tw.wFull, tw.bgWhite, tailwind.roundedLg, tw.mY5 ]}>
                            <View style={[ tw.flex, tw.flexRow, tw.justifyCenter, tw.wFull ]}>
                                <Text style={[ t.textCenter, tw.mXAuto, tw.mY4, tw.wFull, t.fontBold, t.text2xl ]}>Bienvenido, {user.user_display_name}</Text>
                            </View>
                        </View>

                        <View style={[ tw.flex, tw.flexCol, tw.justifyCenter, tw.wFull, tw.bgWhite, tw.border, tw.borderGray300, tailwind.roundedLg, tw.mY5 ]}>
                            <View style={[ tw.flex, tw.flexRow, tw.justifyCenter, tw.wFull ]}>
                                <Text style={[ t.textCenter, tw.mXAuto, tw.mY4, tw.wFull, t.fontBold ]}>MIS RESTAURANTES</Text>
                            </View>
                            {restaurants && restaurants.map((restaurant, index) => {
                                return (
                                    <TouchableHighlight underlayColor="#ccc" key={index} onPress={() => navigation.navigate("Restaurant", { creator_id: restaurant.creator_id, restaurant_id: restaurant.restaurant_id, restaurant_name: restaurant.restaurant_name })} style={[ tw.flex, tw.flexRow, tw.wFull ]}>
                                        <Text style={[ t.textCenter, tw.wFull, tw.mY4 ]}>
                                            {restaurant.restaurant_name}
                                        </Text>
                                    </TouchableHighlight>
                                )
                            })}
                            {restaurants && <TouchableHighlight underlayColor="#ccc" onPress={() => setNewRestaurantVisibility(true)} style={[ tw.flex, tw.flexRow, tw.justifyCenter, tw.wFull ]}>
                                <Text style={[ t.textCenter, tw.mXAuto, tw.mY5, tw.wFull, t.fontBold ]}>Agregar otro restaurante</Text>
                            </TouchableHighlight>}
                            {!restaurants && <TouchableHighlight underlayColor="#ccc" onPress={() => setNewRestaurantVisibility(true)} style={[ tw.flex, tw.flexRow, tw.justifyCenter, tw.wFull ]}>
                                <Text style={[ t.textCenter, tw.mXAuto, tw.mY4, tw.wFull, t.fontBold ]}>Aún no tienes restaurantes. Haz clic aquí para agregar uno</Text>
                            </TouchableHighlight>}
                        </View>

                        <TouchableHighlight underlayColor="#ccc" onPress={() => setModalVisibility(true)} style={[ tw.flex, tw.flexCol, tw.justifyCenter, tw.wFull, tw.bgWhite, tw.border, tw.borderGray300, tailwind.roundedLg, tw.mY5 ]}>
                            <View style={[ tw.flex, tw.flexRow, tw.justifyCenter, tw.wFull ]}>
                                <Text style={[ t.textCenter, tw.mXAuto, tw.mY4, tw.wFull, t.fontBold, t.textBlack ]}>Ajustes de perfil</Text>
                            </View>
                        </TouchableHighlight>

                        <View style={[ tw.flex, tw.flexCol, tw.justifyCenter, tw.wFull, tw.bgRed600, tailwind.roundedLg, tw.mY5 ]}>
                            <View style={[ tw.flex, tw.flexRow, tw.justifyCenter, tw.wFull ]}>
                                <Text style={[ t.textCenter, tw.mXAuto, tw.mY4, tw.wFull, t.fontBold, t.textWhite ]}>Cerrar sesión</Text>
                            </View>
                        </View>

                        <TouchableHighlight underlayColor="#ff0000" onPress={() => setModalVisibility(true)} style={[ tw.flex, tw.flexCol, tw.justifyCenter, tw.wFull, tw.bgRed800, tailwind.roundedLg, tw.mY5 ]}>
                            <View style={[ tw.flex, tw.flexRow, tw.justifyCenter, tw.wFull ]}>
                                <Text style={[ t.textCenter, tw.mXAuto, tw.mY4, tw.wFull, t.fontBold, t.textWhite ]}>Eliminar mi cuenta</Text>
                            </View>
                        </TouchableHighlight>

                    </View>
                </View>
                
                <NewItem isUpdating={false} isVisible={newRestaurantVisibility} itemToAdd="restaurant" onClose={() => setNewRestaurantVisibility(false)} textForAddButton="AGREGAR" topText="Nuevo restaurante" />
                <ModalTemplate animationForModal="fade" isVisible={modalVisibility} onClose={() => setModalVisibility(false)} textForButton="Eliminar" textForModal="¿Quieres eliminar tu cuenta? Esto es permanente." />
            </ScrollView>
        )
    }
}