import { useContext, useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { AuthContext } from "../Context/AuthContext";
import { ActivityIndicator, Text, TouchableHighlight, View } from "react-native";
import { t, tw } from "react-native-tailwindcss";
import { v4 as uuidv4 } from "uuid";
import Icon from 'react-native-vector-icons/FontAwesome';
import ListItem from "../Components/ListItem";
import ModalTemplate from "../Components/ModalTemplate";

export default function RequestsScreen ({ navigation, route }) {
    const auth = useContext(AuthContext);
    const [allUsers, setAllUsers] = useState();
    const [userRestaurants, setUserRestaurants] = useState();
    const [requests, setRequests] = useState();
    const [userRequests, setUserRequests] = useState([]);
    const [userRequestsToDisplay, setUserRequestsToDisplay] = useState([]);

    async function fetchData () {
        try {
            const { data, error } = await supabase.from("ALO-users-db").select("*");
            if (error) console.log(error);
            setAllUsers(data);
        } catch (err) {
            console.log(err);
        }
        try {
            const { data, error } = await supabase.from("ALO-restaurants").select("*").eq("creator_id", auth.userId);
            if (error) console.log(error);
            setUserRestaurants(data);
        } catch (err) {
            console.log(err);
        }
        try {
            const { data, error } = await supabase.from("ALO-requests").select("*").eq("request_status", "pending");
            if (error) console.log(error);
            setRequests(data);
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        fetchData();
    }, [])

    function fetchAgain () {
        setRequests();
        setUserRequests([])
        fetchData();
    }

    function filterUserRequests () {
        if (userRestaurants && requests && allUsers) {
            requests.map((request) => {
                userRestaurants.map((userRestaurant) => {
                    if (request.restaurant_id === userRestaurant.restaurant_id) {
                        allUsers.map((user) => {
                            if (user.user_id === request.user_id) {
                                setUserRequests((prevArray) => [...prevArray, { created_at: request.created_at, request_id: request.request_id, request_message: request.request_message, request_status: request.request_status, restaurant_id: request.restaurant_id, restaurant_name: userRestaurant.restaurant_name, user_display_name: user.user_display_name, user_id: request.user_id }])
                            }
                        })
                    }
                })
            })
        }
    }

    useEffect(() => {
        filterUserRequests();
    }, [userRestaurants, requests, allUsers])

    useEffect(() => {
        function removeDuplicates() {
            const uniqueArray = userRequests.reduce((acc, currentObj) => {
                const isDuplicate = acc.some(existingObj => existingObj.request_id === currentObj.request_id);
                if (!isDuplicate) {
                    acc.push(currentObj);
                }
                return acc;
            }, []);
            setUserRequestsToDisplay(uniqueArray);
        }
        removeDuplicates();
    }, [userRequests])

    const [isModalTemplateVisible, setIsModalTemplateVisible] = useState(false);
    const [itemToSend, setItemToSend] = useState();
    const [textForModalTemplate, setTextForModalTemplate] = useState();
    const [textForModalTemplateButton, setTextForModalTemplateButton] = useState();

    function openModalToMakeUserAnEmployee (request) {
        setItemToSend(request);
        setTextForModalTemplate("¿Quieres agregar a este usuario a tu restaurante?");
        setTextForModalTemplateButton("Sí, confirmo");
        setIsModalTemplateVisible(true);
    }

    function openModalToRejectUser (request) {
        setItemToSend(request);
        setTextForModalTemplate("¿Quieres rechazar la solicitud de este usuario?");
        setTextForModalTemplateButton("Sí, confirmo");
        setIsModalTemplateVisible(true);
    }

    if (!userRequestsToDisplay) {
        return (
            <View>
                <ActivityIndicator style={[ tw.mT10]} size="large" color="#000" />
            </View>
        )
    } else if (userRequestsToDisplay) {
        if (userRequestsToDisplay.length < 1) {
            return (
                <View style={[ tw.mY6, tw.pX5, tw.flex, tw.justifyCenter, tw.itemsCenter ]}>
                    <Text style={[ t.textCenter ]}>
                        No tienes solicitudes pendientes.
                    </Text>
                </View>
            )
        } else if (userRequestsToDisplay.length > 0) {
            return (
                <>
                    <View style={[ tw.mY3, tw.pX5 ]}>
                        {userRequestsToDisplay.map((request, index) => {
                            return (
                                <ListItem buttonOne="check" buttonOneAction={() => openModalToMakeUserAnEmployee(request)} buttonTwo="ban" buttonTwoAction={() => openModalToRejectUser(request)} iconSize={20} index={index} item={request} itemClassnames={[ tw.borderT, tw.borderGray400 ]} itemElementAction={null} key={index} listName="users in 'requests' screen" />
                            )
                        })}
                    </View>
                    <ModalTemplate actionButtonBorder={tw.borderOrange400} actionButtonColor={tw.bgOrange400} animationForModal="fade" isVisible={isModalTemplateVisible} item={itemToSend} onClose={() => setIsModalTemplateVisible(false)} onTasksAfterAction={fetchAgain} restaurantId={null} textForButton={textForModalTemplateButton} textForModal={textForModalTemplate} underlayColor="#fc5" userId={auth.userId} />
                </>
            )
        }
    }
}