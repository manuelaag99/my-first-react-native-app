import { useContext, useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { AuthContext } from "../Context/AuthContext";
import { ActivityIndicator, Text, TouchableHighlight, View } from "react-native";
import { t, tw } from "react-native-tailwindcss";
import { v4 as uuidv4 } from "uuid";
import Icon from 'react-native-vector-icons/FontAwesome';
import ListItem from "../Components/ListItem";

export default function RequestsScreen ({ navigation, route }) {
    const auth = useContext(AuthContext);
    const [allUsers, setAllUsers] = useState();
    const [userRestaurants, setUserRestaurants] = useState();
    const [requests, setRequests] = useState();
    const [userRequests, setUserRequests] = useState([]);
    const [userRequestsToDisplay, setUserRequestsToDisplay] = useState([]);

    async function fetchAllUsers () {
        try {
            const { data, error } = await supabase.from("ALO-users-db").select("*");
            if (error) console.log(error);
            setAllUsers(data);
        } catch (err) {
            console.log(err);
        }
    }
    async function fetchRestaurants () {
        try {
            const { data, error } = await supabase.from("ALO-restaurants").select("*").eq("creator_id", auth.userId);
            if (error) console.log(error);
            setUserRestaurants(data);
        } catch (err) {
            console.log(err);
        }
    }
    async function fetchAllRequests () {
        try {
            const { data, error } = await supabase.from("ALO-requests").select("*").eq("request_status", "pending");
            if (error) console.log(error);
            setRequests(data);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchAllUsers();
        fetchRestaurants();
        fetchAllRequests();
    }, [])

    function fetchAgain () {
        fetchAllRequests();
        filterUserRequests();
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

    let newEmployeeId;
    async function makeUserAnEmployee (request) {
        newEmployeeId = uuidv4();
        try {
            const { error } = await supabase.from("ALO-employees").insert({ employee_id: newEmployeeId, restaurant_id: request.restaurant_id, user_id: request.user_id })
            if (error) console.log(error);
        } catch (err) {
            console.log(err);
        }
        try {
            const { error } = await supabase.from("ALO-requests").update({ request_status: "Approved" }).eq("request_id", request.request_id);
            if (error) console.log(error);
        } catch (err) {
            console.log(err);
        }
        fetchAgain();
    }

    if (!userRequests) {
        return (
            <View>
                <ActivityIndicator style={[ tw.mT10]} size="large" color="#000" />
            </View>
        )
    } else if (userRequests) {
        if (userRequests.length < 1) {
            return (
                <View style={[ tw.mY6, tw.pX5, tw.flex, tw.justifyCenter, tw.itemsCenter ]}>
                    <Text style={[ t.textCenter ]}>
                        No tienes solicitudes pendientes.
                    </Text>
                </View>
            )
        } else if (userRequests.length > 0) {
            return (
                <View style={[ tw.mY3, tw.pX5 ]}>
                    {userRequestsToDisplay.map((request, index) => {
                        return (
                            <ListItem buttonOne="check" buttonOneAction={() => makeUserAnEmployee(request)} buttonOneClassnames={[ tw.w1_6 ]} buttonTwo="ban" buttonTwoAction={() => console.log("delete")} buttonTwoClassnames={[ tw.w1_6 ]} iconSize={20} index={index} item={request} itemClassnames={[ tw.borderT, tw.borderGray400 ]} itemElementAction={null} itemElementClassnames={[ tw.w2_3, tw.pY3 ]} key={index} listName="users in 'requests' screen" />
                        )
                    })}
                </View>
            )
        }
    }
}