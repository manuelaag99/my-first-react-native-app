import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableHighlight, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { t, tw, tailwind } from "react-native-tailwindcss";
import { supabase } from "../supabase/client";

import ModalTemplate from "../Components/ModalTemplate";
import NewItem from "../Components/NewItem";
import { AuthContext } from "../Context/AuthContext";

export default function UserProfileScreen ({ navigation, route }) {
    const auth = useContext(AuthContext);
    console.log(auth)
    const [newRestaurantVisibility, setNewRestaurantVisibility] = useState(false);
    const [modalVisibility, setModalVisibility] = useState(false);
    const [user, setUser] = useState();
    const [restaurants, setRestaurants] = useState();
    const [restaurantsThatTheUserIsAnEmployeeOf, setRestaurantsThatTheUserIsAnEmployeeOf] = useState();
    const [restaurantsThatTheUserIsAnEmployeeOfWithNames, setRestaurantsThatTheUserIsAnEmployeeOfWithNames] = useState();

    async function fetchData () {
        try {
            const { data, error } = await supabase.from("ALO-users-db").select("*").eq("user_id", auth.userId);
            setUser(data[0]);
            if (error) console.log(error);
        } catch (err) {
            console.log(err);
        }
        try {
            const { data, error } = await supabase.from("ALO-restaurants").select("*").eq("creator_id", auth.userId);
            setRestaurants(data);
            if (error) console.log(error);
        } catch (err) {
            console.log(err);
        }
        try {
            const { data, error } = await supabase.from("ALO-employees").select("*").eq("user_id", auth.userId);
            setRestaurantsThatTheUserIsAnEmployeeOf(data);
            if (error) console.log(error);
        } catch (err) {
            console.log(err);
        }
    }
    console.log(restaurantsThatTheUserIsAnEmployeeOf)

    useEffect(() => {
        if (restaurantsThatTheUserIsAnEmployeeOf) {
            restaurantsThatTheUserIsAnEmployeeOf.map((restaurantThatTheUserIsAnEmployeeOf) => {
                restaurants.map((restaurant) => {
                    if (restaurantThatTheUserIsAnEmployeeOf.restaurant_id === restaurant.restaurant_id) {
                        setRestaurantsThatTheUserIsAnEmployeeOfWithNames({ restaurant_id: restaurant.restaurant_id, restaurant_name: restaurant.restaurant_name })
                    } 
                })
            })
        }
    }, [restaurantsThatTheUserIsAnEmployeeOf])

    useEffect(() => {
        fetchData();
    }, [navigation]);

    function fetchAgain () {
        fetchData();
    }

    async function refreshHandle () {
        try {
            const { data, error } = await supabase.from("ALO-restaurants").select("*").eq("creator_id", auth.userId);
            setRestaurants(data);
            if (error) console.log(error);
        } catch (err) {
            console.log(err);
        }
    }

    const insets = useSafeAreaInsets();
    
    async function logout () {
        try {
            const { error } = await supabase.auth.signOut();
        } catch (err) {
            console.log(err)
        }
        auth.logout()
    }



    if (!user) {
        return (
            <View>
                <ActivityIndicator style={[ tw.mT10]} size="large" color="#000" />
            </View>
            
        )
    } else if (user && restaurants && restaurantsThatTheUserIsAnEmployeeOf) {
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
                                <Text onPress={refreshHandle} style={[ t.textCenter, tw.mXAuto, tw.mY4, tw.wFull, t.fontBold ]}>MIS RESTAURANTES</Text>
                            </View>
                            {restaurants && restaurants.map((restaurant, index) => {
                                return (
                                    <TouchableHighlight underlayColor="#ccc" key={index} onPress={() => navigation.navigate("Restaurant", { user_id: auth.userId, restaurant_id: restaurant.restaurant_id, restaurant_name: restaurant.restaurant_name, creator_name: user.user_display_name })} style={[ tw.flex, tw.flexRow, tw.wFull ]}>
                                        <Text style={[ t.textCenter, tw.wFull, tw.mY4, tw.pX4 ]}>
                                            {restaurant.restaurant_name}
                                        </Text>
                                    </TouchableHighlight>
                                )
                            })}
                            {restaurants && <TouchableHighlight underlayColor="#ccc" onPress={() => setNewRestaurantVisibility(true)} style={[ tw.flex, tw.flexRow, tw.justifyCenter, tw.wFull, tailwind.roundedLg ]}>
                                <Text style={[ t.textCenter, tw.mXAuto, tw.mY5, tw.wFull, t.fontBold ]}>Agregar otro restaurante</Text>
                            </TouchableHighlight>}
                            {!restaurants && <TouchableHighlight underlayColor="#ccc" onPress={() => setNewRestaurantVisibility(true)} style={[ tw.flex, tw.flexRow, tw.justifyCenter, tw.wFull, tailwind.roundedLg ]}>
                                <Text style={[ t.textCenter, tw.mXAuto, tw.mY4, tw.wFull, t.fontBold, t.pX4 ]}>Aún no tienes restaurantes. Haz clic aquí para agregar uno</Text>
                            </TouchableHighlight>}
                        </View>

                        <View style={[ tw.flex, tw.flexCol, tw.justifyCenter, tw.wFull, tw.bgWhite, tw.border, tw.borderGray300, tailwind.roundedLg, tw.mY5 ]}>
                            <View style={[ tw.flex, tw.flexRow, tw.justifyCenter, tw.wFull ]}>
                                <Text onPress={refreshHandle} style={[ t.textCenter, tw.mXAuto, tw.mY4, tw.wFull, t.fontBold ]}>RESTAURANTES DONDE TRABAJO</Text>
                            </View>
                            {restaurantsThatTheUserIsAnEmployeeOfWithNames && restaurantsThatTheUserIsAnEmployeeOfWithNames.map((restaurant, index) => {
                                return (
                                    <TouchableHighlight underlayColor="#ccc" key={index} onPress={() => navigation.navigate("Restaurant", { user_id: auth.userId, restaurant_id: restaurant.restaurant_id })} style={[ tw.flex, tw.flexRow, tw.wFull ]}>
                                        <Text style={[ t.textCenter, tw.wFull, tw.mY4, tw.pX4 ]}>
                                            {restaurant.restaurant_name}
                                        </Text>
                                    </TouchableHighlight>
                                )
                            })}
                            {(restaurantsThatTheUserIsAnEmployeeOf && restaurantsThatTheUserIsAnEmployeeOf.length > 1) && <TouchableHighlight underlayColor="#ccc" onPress={() => navigation.navigate("Search Restaurant", { user_id: auth.userId })} style={[ tw.flex, tw.flexRow, tw.justifyCenter, tw.wFull, tailwind.roundedLg ]}>
                                <Text style={[ t.textCenter, tw.mXAuto, tw.mY5, tw.wFull, t.fontBold ]}>Buscar otro restaurante</Text>
                            </TouchableHighlight>}
                            {(!restaurantsThatTheUserIsAnEmployeeOf || restaurantsThatTheUserIsAnEmployeeOf.length < 1) && <TouchableHighlight underlayColor="#ccc" onPress={() => navigation.navigate("Search Restaurant", { user_id: auth.userId })} style={[ tw.flex, tw.flexRow, tw.justifyCenter, tw.wFull, tailwind.roundedLg ]}>
                                <Text style={[ t.textCenter, tw.mXAuto, tw.mY4, tw.wFull, t.fontBold, t.pX4 ]}>Aún no trabajas en ningun restaurante. Haz clic aquí para buscar uno.</Text>
                            </TouchableHighlight>}
                        </View>

                        <TouchableHighlight underlayColor="#ccc" onPress={() => navigation.navigate("Requests", { user_id: auth.userId })} style={[ tw.flex, tw.flexCol, tw.justifyCenter, tw.wFull, tw.bgWhite, tw.border, tw.borderGray300, tailwind.roundedLg, tw.mY5 ]}>
                            <View style={[ tw.flex, tw.flexRow, tw.justifyCenter, tw.wFull ]}>
                                <Text style={[ t.textCenter, tw.mXAuto, tw.mY4, tw.wFull, t.fontBold, t.textBlack ]}>Solicitudes</Text>
                            </View>
                        </TouchableHighlight>

                        <TouchableHighlight underlayColor="#ccc" onPress={() => navigation.navigate("Settings", { user_id: auth.userId })} style={[ tw.flex, tw.flexCol, tw.justifyCenter, tw.wFull, tw.bgWhite, tw.border, tw.borderGray300, tailwind.roundedLg, tw.mY5 ]}>
                            <View style={[ tw.flex, tw.flexRow, tw.justifyCenter, tw.wFull ]}>
                                <Text style={[ t.textCenter, tw.mXAuto, tw.mY4, tw.wFull, t.fontBold, t.textBlack ]}>Ajustes de perfil</Text>
                            </View>
                        </TouchableHighlight>

                        <TouchableHighlight underlayColor="#ff7777" onPress={() => auth.logout()} style={[ tw.flex, tw.flexCol, tw.justifyCenter, tw.wFull, tw.bgRed600, tailwind.roundedLg, tw.mY5 ]}>
                            <View style={[ tw.flex, tw.flexRow, tw.justifyCenter, tw.wFull ]}>
                                <Text style={[ t.textCenter, tw.mXAuto, tw.mY4, tw.wFull, t.fontBold, t.textWhite ]}>Cerrar sesión</Text>
                            </View>
                        </TouchableHighlight>

                        <TouchableHighlight underlayColor="#ff0000" onPress={() => setModalVisibility(true)} style={[ tw.flex, tw.flexCol, tw.justifyCenter, tw.wFull, tw.bgRed800, tailwind.roundedLg, tw.mY5 ]}>
                            <View style={[ tw.flex, tw.flexRow, tw.justifyCenter, tw.wFull ]}>
                                <Text style={[ t.textCenter, tw.mXAuto, tw.mY4, tw.wFull, t.fontBold, t.textWhite ]}>Eliminar mi cuenta</Text>
                            </View>
                        </TouchableHighlight>

                    </View>
                </View>
                
                <NewItem creatorId={auth.userId} dishesToUpdate={null} isUpdating={false} isVisible={newRestaurantVisibility} itemToAdd="restaurant" onClose={() => setNewRestaurantVisibility(false)} textForAddButton="AGREGAR" topText="Nuevo restaurante" updateFetchedData={fetchAgain} userId={auth.userId} />
                <ModalTemplate actionButtonBorder={tw.borderRed700} actionButtonColor={tw.bgRed700} animationForModal="fade" isVisible={modalVisibility} onClose={() => setModalVisibility(false)} restaurantId={null} textForButton="Eliminar" textForModal="¿Quieres eliminar tu cuenta? Esto es permanente." userId={auth.userId} />
            </ScrollView>
        )
    }
}