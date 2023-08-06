import { Link } from "expo-router";
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

    const [usersInfo, setUsersInfo] = useState()
    let email = "manuelaag99@gmail.com"
    async function fetchData () {
        try {
            const { data, error } = await supabase.from("ALO-users-db").select("*").eq("user_email", email);
            setUsersInfo(data[0])
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        setUser(usersInfo)
        if (usersInfo) {
            setRestaurants(usersInfo.user_restaurants);
        }
    }, [])


    console.log(usersInfo)
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
                                console.log(restaurant)
                                console.log(restaurant.restaurant_name)
                                return (
                                    <TouchableHighlight underlayColor="#ccc" key={index} onPress={() => navigation.navigate("Restaurant", { id: restaurant.restaurant_id })} style={[ tw.flex, tw.flexRow, tw.wFull ]}>
                                        <Text style={[ tw.w4_5, tw.mY4, tw.pL4 ]}>
                                            {restaurant}
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
                
                <NewItem topText="Nueo restaurante" isVisible={newRestaurantVisibility}  itemToAdd="restaurant" onClose={() => setNewRestaurantVisibility(false)}  />
                <ModalTemplate animationForModal="fade" isVisible={modalVisibility} onClose={() => setModalVisibility(false)} textForButton="Eliminar" textForModal="¿Quieres eliminar tu cuenta? Esto es permanente." />
            </ScrollView>
        )
    }
}