import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableHighlight, View } from "react-native";
import { t, tailwind, tw } from "react-native-tailwindcss";
import Icon from 'react-native-vector-icons/FontAwesome';
import { supabase } from "../supabase/client";
import ModalTemplate from "../Components/ModalTemplate";

export default function RestaurantsSearchScreen ({ navigation, route }) {
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
                                        <View key={index} style={[ t.flex, t.flexRow, tw.wFull, t.borderT, t.borderGray400 ]}>
                                            <TouchableHighlight onPress={() => console.log("press")} style={[[ t.flex, t.flexCol, tw.w4_5, tw.pY4, tw.pX1, tailwind.roundedLg ], { width: "90%" }]} underlayColor="#ccc">
                                                <View style={[ t.flex, t.flexRow, tw.wFull ]}>
                                                    <Text style={[ tw.h6, t.textLeft, t.textBlack, t.fontBold ]}>{restaurant.restaurant_name}</Text>
                                                </View>
                                            </TouchableHighlight>
                                            <TouchableHighlight onPress={() => setModalVisibility(true)} style={[[ t.flex, t.justifyCenter, t.itemsCenter, tw.w1_5, tailwind.roundedLg ], { width: "10%" }]} underlayColor="#ffdd88">
                                                {(user_id !== restaurant.creator_id) && <Icon name="plus" size={20} />}
                                            </TouchableHighlight>
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

                    <ModalTemplate actionButtonBorder={tw.borderRed700} actionButtonColor={tw.bgRed700} animationForModal="fade" isVisible={modalVisibility} onClose={() => setModalVisibility(false)} textForButton="Enviar" textForModal="¿Quieres solicitar unirte a este restaurante?" userId={user_id} />
            </ScrollView>
        )
    }
    
}