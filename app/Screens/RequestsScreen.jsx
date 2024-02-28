import { useContext, useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { AuthContext } from "../Context/AuthContext";
import { Text, TouchableHighlight, View } from "react-native";
import { t, tw } from "react-native-tailwindcss";
import Icon from 'react-native-vector-icons/FontAwesome';

export default function RequestsScreen ({ navigation, route }) {
    const auth = useContext(AuthContext);
    const [userRestaurants, setUserRestaurants] = useState();
    const [requests, setRequests] = useState();
    const [userRequests, setUserRequests] = useState([]);
    const [userRequestsToDisplay, setUserRequestsToDisplay] = useState([]);
    const [allUsers, setAllUsers] = useState();

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
            const { data, error } = await supabase.from("ALO-requests").select("*");
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

    useEffect(() => {
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
    }, [userRestaurants, requests, allUsers])

    useEffect(() => {
        function removeDuplicates() {
            const uniqueArray = userRequests.reduce((acc, currentObj) => {
                const isDuplicate = acc.some(existingObj => existingObj.user_id === currentObj.user_id);
                if (!isDuplicate) {
                    acc.push(currentObj);
                }
                return acc;
            }, []);
            setUserRequestsToDisplay(uniqueArray);
        }

        removeDuplicates();
    }, [userRequests])

    if (userRestaurants && requests) {
        return (
            <View style={[ tw.mY3, tw.pX5 ]}>
                {userRequestsToDisplay.map((request, index) => {
                    return (
                        <View key={index} style={[ t.flex, t.flexRow, tw.wFull, t.borderT, t.borderGray400  ]}>
                            <View style={[ t.flex, t.flexCol, tw.w4_6, tw.pY2, tw.pR2 ]}>
                                <View style={[ t.flex, t.flexRow, tw.wFull ]}>
                                    <Text style={[ tw.h6, t.textLeft, t.textBlack, t.fontBold ]}>{request.user_display_name}</Text>
                                </View>
                                <View style={[ t.flex, t.flexRow, tw.wFull ]}>
                                    <Text style={[ tw.h6, t.textLeft, t.textGray600, t.italic ]}>{request.restaurant_name}</Text>
                                </View>
                            </View>
                            <TouchableHighlight onPress={() => console.log("delete")} style={[ t.flex, t.justifyCenter, t.itemsCenter, tw.w1_6]} underlayColor="#99f">
                                <Icon name="check" size={25} />
                            </TouchableHighlight>
                            <TouchableHighlight onPress={() => console.log("delete")} style={[ t.flex, t.justifyCenter, t.itemsCenter, tw.w1_6]} underlayColor="#f99">
                                <Icon name="ban" size={25} />
                            </TouchableHighlight>
                        </View>
                    )    
                })}
            </View>
        )
    }
}