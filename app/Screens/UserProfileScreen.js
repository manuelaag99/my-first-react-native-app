import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableHighlight, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { t, tw, tailwind } from "react-native-tailwindcss";
import { supabase } from "../supabase/client";

import ModalTemplate from "../Components/ModalTemplate";
import NewItem from "../Components/newItem";

export default function UserProfileScreen ({ navigation, route }) {
    const [newRestaurantVisibility, setNewRestaurantVisibility] = useState(false);
    const [modalVisibility, setModalVisibility] = useState(false);
    const [user, setUser] = useState();
    const [restaurants, setRestaurants] = useState();

    let email = "manuelaag99@gmail.com";
    let user_id = "4ff038cb-0fe5-494b-80fe-89bbc5cdeb22";

    // const { user_id } = route.params;

    async function fetchData () {
        try {
            const { data, error } = await supabase.from("ALO-users-db").select("*").eq("user_id", user_id);
            setUser(data[0]);
            if (error) console.log(error);
        } catch (err) {
            console.log(err);
        }
        try {
            const { data, error } = await supabase.from("ALO-restaurants").select("*").eq("creator_id", user_id);
            setRestaurants(data);
            if (error) console.log(error);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchData();
    }, [navigation]);

    function fetchAgain () {
        fetchData();
    }

    async function refreshHandle () {
        try {
            const { data, error } = await supabase.from("ALO-restaurants").select("*").eq("creator_id", user_id);
            setRestaurants(data);
            if (error) console.log(error);
        } catch (err) {
            console.log(err);
        }
    }

    const insets = useSafeAreaInsets();

    if (!user) {
        return (
            <ActivityIndicator style={[ tw.mT10]} size="large" color="#000" />
        )
    } else if (user && restaurants) {
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
                                    <TouchableHighlight underlayColor="#ccc" key={index} onPress={() => navigation.navigate("Restaurant", { user_id: user_id, restaurant_id: restaurant.restaurant_id, restaurant_name: restaurant.restaurant_name, creator_name: user.user_display_name })} style={[ tw.flex, tw.flexRow, tw.wFull ]}>
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

                        <View style={[ tw.flex, tw.flexCol, tw.justifyCenter, tw.wFull, tw.bgWhite, tw.border, tw.borderGray300, tailwind.roundedLg, tw.mY5 ]}>
                            <View style={[ tw.flex, tw.flexRow, tw.justifyCenter, tw.wFull ]}>
                                <Text onPress={refreshHandle} style={[ t.textCenter, tw.mXAuto, tw.mY4, tw.wFull, t.fontBold ]}>RESTAURANTES DONDE TRABAJO</Text>
                            </View>
                            {restaurants && restaurants.map((restaurant, index) => {
                                return (
                                    <TouchableHighlight underlayColor="#ccc" key={index} onPress={() => navigation.navigate("Restaurant", { user_id: user_id, restaurant_id: restaurant.restaurant_id, restaurant_name: restaurant.restaurant_name, creator_name: user.user_display_name })} style={[ tw.flex, tw.flexRow, tw.wFull ]}>
                                        <Text style={[ t.textCenter, tw.wFull, tw.mY4 ]}>
                                            {restaurant.restaurant_name}
                                        </Text>
                                    </TouchableHighlight>
                                )
                            })}
                            {restaurants && <TouchableHighlight underlayColor="#ccc" onPress={() => navigation.navigate("Search Restaurant", { user_id: user_id })} style={[ tw.flex, tw.flexRow, tw.justifyCenter, tw.wFull ]}>
                                <Text style={[ t.textCenter, tw.mXAuto, tw.mY5, tw.wFull, t.fontBold ]}>Buscar otro restaurante</Text>
                            </TouchableHighlight>}
                            {!restaurants && <TouchableHighlight underlayColor="#ccc" onPress={() => navigation.navigate("Search Restaurant", { user_id: user_id })} style={[ tw.flex, tw.flexRow, tw.justifyCenter, tw.wFull ]}>
                                <Text style={[ t.textCenter, tw.mXAuto, tw.mY4, tw.wFull, t.fontBold ]}>Aún no tienes restaurantes. Haz clic aquí para agregar uno</Text>
                            </TouchableHighlight>}
                        </View>

                        <TouchableHighlight underlayColor="#ccc" onPress={() => navigation.navigate("Settings", { user_id: user_id })} style={[ tw.flex, tw.flexCol, tw.justifyCenter, tw.wFull, tw.bgWhite, tw.border, tw.borderGray300, tailwind.roundedLg, tw.mY5 ]}>
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
                
                <NewItem creatorId={user_id} dishesToUpdate={null} isUpdating={false} isVisible={newRestaurantVisibility} itemToAdd="restaurant" onClose={() => setNewRestaurantVisibility(false)} textForAddButton="AGREGAR" topText="Nuevo restaurante" updateFetchedData={fetchAgain} userId={user_id} />
                <ModalTemplate actionButtonBorder={tw.borderRed700} actionButtonColor={tw.bgRed700} animationForModal="fade" isVisible={modalVisibility} onClose={() => setModalVisibility(false)} restaurantId={null} textForButton="Eliminar" textForModal="¿Quieres eliminar tu cuenta? Esto es permanente." userId={user_id} />
            </ScrollView>
        )
    }
}