import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableHighlight, View } from "react-native";
import { t, tailwind, tw } from "react-native-tailwindcss";
import Icon from 'react-native-vector-icons/FontAwesome';
import { supabase } from "../supabase/client";
import ModalTemplate from "../Components/ModalTemplate";
import { AuthContext } from "../Context/AuthContext";

export default function RestaurantsSearchScreen ({ navigation, route }) {
    const auth = useContext(AuthContext);
    const [searchQuery, setSearchQuery] = useState();
    const [allRestaurantsArray, setAllRestaurantsArray] = useState();
    const [restaurantsToDisplay, setRestaurantsToDisplay] = useState();

    const { user_id } = route.params;

    async function fetchAllRestaurants () {
        try {
            const { data, error } = await supabase.from("ALO-restaurants").select("*");
            console.log(data)
            if (error) console.log(error);
            setAllRestaurantsArray(data);
        } catch (err) {
            console.log(err);
        }
    }

    function searchInputHandle (event) {
        setSearchQuery(event);
    }

    useEffect(() => {
        fetchAllRestaurants();
    }, [])

    useEffect(() => {
        if (!searchQuery) {
            setRestaurantsToDisplay(allRestaurantsArray);
        } else if (searchQuery) {
            setRestaurantsToDisplay(allRestaurantsArray.filter((restaurant) => {
                return restaurant.restaurant_name.includes(searchQuery);
            }))
        }
    }, [searchQuery])

    const [searchButtonPressStatus, setSearchButtonPressStatus] = useState(false);

    const [modalVisibility, setModalVisibility] = useState(false);
    const [restaurantIdToSendRequestTo, setRestaurantIdToSendRequestTo] = useState();
    function openModalAndSendRestaurant (restaurant) {
        console.log(restaurant)
        setRestaurantIdToSendRequestTo(restaurant.restaurant_id);
        setModalVisibility();
    }
    
    if (!allRestaurantsArray) {
        return <ActivityIndicator style={[ tw.mT10]} size="large" color="#000" />
    } else if (allRestaurantsArray) {
        return (
            <ScrollView>
                    <View style={[ t.flex, t.flexCol, tw.mY2, tw.pX4, tw.wFull ]}>
                        <View style={[ t.flex, t.flexRow, t.justifyCenter, t.itemsCenter, t.bgWhite, tw.wFull, tw.pX2, tailwind.roundedLg, tw.mY3 ]}>
                            <TextInput onChangeText={searchInputHandle} placeholder="Escribe aquí el nombre de un restaurante..." style={[[ tw.pX2, tw.pY3, tw.h12 ], { width: "90%" }]} value={searchQuery} />
                            <View style={[[ t.flex, t.justifyCenter, t.itemsCenter, tw.h12 ], { width: "10%" }]}>
                                <Text style={[[ t.textCenter ], { color: searchButtonPressStatus ? "#222" : "#999" }]} onPressIn={() => setSearchButtonPressStatus(true)} onPressOut={() => setSearchButtonPressStatus(false)} >
                                    <Icon name="search" size={25} />
                                </Text>
                            </View>
                        </View>
    
                        {!searchQuery && <View>
                            <Text style={[ t.textGray500, t.textCenter, tw.mY3 ]}>
                                Escribe un nombre para buscar un restaurante.
                            </Text>
                        </View>}
                        {searchQuery && <View style={[ t.flex, t.flexCol, tw.wFull ]}>
                            {restaurantsToDisplay && restaurantsToDisplay.map((restaurant, index) => {
                                if (restaurant.restaurant_name.includes(searchQuery)) {
                                    return (
                                        <View key={index} style={[ t.flex, t.flexRow, tw.wFull, t.borderGray400, t.borderT ]}>

                                            <View style={[[ t.flex, t.flexCol, t.justifyCenter, t.itemsCenter ], { width: "90%" }]} >
                                                <TouchableHighlight onPress={() => navigation.navigate("Restaurant", { user_id: auth.userId, restaurant_id: restaurant.restaurant_id })} style={[ t.flex, t.justifyCenter, tw.wFull, tailwind.roundedLg, tw.pY4 ]} underlayColor="#ccc">
                                                    <Text style={[ tw.h6, t.textLeft, t.textBlack, t.fontBold, tw.pX4 ]}>{restaurant.restaurant_name}</Text>
                                                </TouchableHighlight>
                                            </View>
    
                                            <View style={[[ t.flex, t.flexCol, t.justifyCenter, t.itemsCenter ], { width: "10%" }]}>
                                                <TouchableHighlight style={[[ t.flex, t.justifyCenter, t.itemsCenter, tw.wFull, tailwind.roundedLg, tw.pY4 ]]} onPress={() => openModalAndSendRestaurant(restaurant)} underlayColor="#ffdd88">
                                                    <Text style={[ tw.h6, t.textCenter, t.textBlack ]}>
                                                        {/* {(user_id !== restaurant.creator_id) && <Icon name="plus" size={20} />} */}
                                                        <Icon name="plus" size={20} />
                                                    </Text>
                                                </TouchableHighlight>
                                            </View>
                                        </View>
                                    )
                                }
                            })}
                            {!restaurantsToDisplay || (restaurantsToDisplay.length == 0) && <View>
                                <Text style={[ t.textGray500, t.textCenter, tw.mY3 ]}>
                                    Ningún restaurante encaja con tu búsqueda.
                                </Text>
                            </View>}
                        </View>}
                    </View>

                    <ModalTemplate actionButtonBorder={tw.borderOrange400} actionButtonColor={tw.bgOrange400} animationForModal="fade" isVisible={modalVisibility} onClose={() => setModalVisibility(false)} onTasksAfterAction={null} restaurantId={restaurantIdToSendRequestTo} textForButton="Enviar" textForModal="¿Quieres solicitar unirte a este restaurante?" underlayColor="#fc5" userId={auth.userId} />
            </ScrollView>
        )
    }
    
}