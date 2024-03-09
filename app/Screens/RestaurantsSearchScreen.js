import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableHighlight, View } from "react-native";
import { t, tailwind, tw } from "react-native-tailwindcss";
import Icon from 'react-native-vector-icons/FontAwesome';
import { supabase } from "../supabase/client";
import ModalTemplate from "../Components/ModalTemplate";
import { AuthContext } from "../Context/AuthContext";
import ListItem from "../Components/ListItem";

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

    function fetchAgain () {
        fetchAllRestaurants();
    }

    useEffect(() => {
        if (!searchQuery) {
            setRestaurantsToDisplay(allRestaurantsArray);
        } else if (searchQuery) {
            setRestaurantsToDisplay(allRestaurantsArray.filter((restaurant) => {
                return restaurant.restaurant_name.toLowerCase().includes(searchQuery.toLowerCase());
            }))
        }
    }, [searchQuery, allRestaurantsArray])

    const [searchButtonPressStatus, setSearchButtonPressStatus] = useState(false);

    const [isModalTemplateVisible, setIsModalTemplateVisible] = useState(false);
    const [restaurantIdToSendRequestTo, setRestaurantIdToSendRequestTo] = useState();
    const [textForModalTemplate, setTextForModalTemplate] = useState();
    const [textForModalTemplateButton, setTextForModalTemplateButton] = useState();
    function openModalToSendRequest (restaurant_id) {
        setRestaurantIdToSendRequestTo(restaurant_id);
        setTextForModalTemplate("¿Quieres solicitar unirte a este restaurante?");
        setTextForModalTemplateButton("Sí, enviar");
        setIsModalTemplateVisible(true);
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
                                return (
                                    <ListItem buttonOne="plus" buttonOneAction={() => openModalToSendRequest(restaurant.restaurant_id)} buttonTwo={null} buttonTwoAction={null} iconSize={20} item={restaurant} itemClassnames={null} itemElementAction={() => navigation.navigate("Restaurant", { restaurant_id: restaurant.restaurant_id, user_id: auth.userId })} index={index} key={index} listName="restaurants in 'restaurant search' screen" searchQuery={searchQuery} />
                                )
                            })}
                            {!restaurantsToDisplay || (restaurantsToDisplay.length == 0) && <View>
                                <Text style={[ t.textGray500, t.textCenter, tw.mY3 ]}>
                                    Ningún restaurante encaja con tu búsqueda.
                                </Text>
                            </View>}
                        </View>}
                    </View>

                    <ModalTemplate actionButtonBorder={tw.borderOrange400} actionButtonColor={tw.bgOrange400} animationForModal="fade" isVisible={isModalTemplateVisible} item={null} onClose={() => setIsModalTemplateVisible(false)} onTasksAfterAction={fetchAgain} restaurantId={restaurantIdToSendRequestTo} textForButton={textForModalTemplateButton} textForModal={textForModalTemplate} underlayColor="#fc5" userId={auth.userId} />
            </ScrollView>
        )
    }
    
}