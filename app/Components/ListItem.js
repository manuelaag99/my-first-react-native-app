import { useContext, useEffect, useState } from "react";
import { Text, TouchableHighlight, View } from "react-native";
import { supabase } from "../supabase/client";
import { t, tw } from "react-native-tailwindcss";
import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthContext } from "../Context/AuthContext";

export default function ListItem ({ buttonOne, buttonOneAction, buttonTwo, buttonTwoAction, iconSize, index, item, itemClassnames, itemElementAction, listName }) {
    const auth = useContext(AuthContext);
    const [firstText, setFirstText] = useState({ content: "", style: "" });
    const [secondText, setSecondText] = useState({ content: "", style: "" });
    const [thirdText, setThirdText] = useState({ content: "", style: "" });
    const [isButtonOneVisible, setIsButtonOneVisible] = useState(true);
    const [isButtonTwoVisible, setIsButtonTwoVisible] = useState(true);
    const [classnames, setClassnames] = useState({ itemElementClassnames: [], buttonOneClassnames: [], buttonTwoClassnames: [] });

    // this section is for the list of restaurants for deleting user account 
    const [restaurantInfo, setRestaurantInfo] = useState();
    const [restaurantAdmins, setRestaurantAdmins] = useState();
    async function fetchRestaurantAdminsAndInfo () {
        try {
            const { data, error } = await supabase.from("ALO-restaurants").select("*").eq("restaurant_id", item.restaurant_id);
            if (error) console.log(error);
            setRestaurantInfo(data[0]);
        } catch (err) {
            console.log(err);
        }
        try {
            const { data, error } = await supabase.from("ALO-admins").select("user_id").eq("restaurant_id", item.restaurant_id);
            if (error) console.log(error);
            setRestaurantAdmins(data);
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        if (listName === "restaurants in 'delete user account' screen") {
            fetchRestaurantAdminsAndInfo();
        }
    }, [])
    useEffect(() => {
        if (item && restaurantAdmins && restaurantInfo) {
            setFirstText({ content: restaurantInfo.restaurant_name, style: [  t.textLeft, t.fontBold, t.textBlack ]});
            restaurantAdmins && (restaurantAdmins.length = 1) && setSecondText({ content: restaurantAdmins.length + " administrador, eres tú.", style: [ t.textLeft, t.fontNormal, t.textGray600 ]});
            restaurantAdmins && (restaurantAdmins.length > 1) && setSecondText({ content: restaurantAdmins.length + " administradores.", style: [ t.textLeft, t.fontNormal, t.textGray600 ]});
            restaurantAdmins && (restaurantAdmins.length = 1) && setThirdText({ content: "Si no nombras a otro administrador, toda la información de este restaurante y lo asociado a él se eliminará permanentemente.", style: [t.textRed500] });
            restaurantAdmins && (restaurantAdmins.length > 1) && setThirdText({ content: "Si eliminas tu cuenta, aún existirá información de este restaurante porque hay al menos 1 administrador más.", style: [t.textGreen500] });
            setClassnames({ itemElementClassnames: [ tw.w4_5, tw.pX4 ], buttonOneClassnames: [ tw.w1_5 ] });
        }
    }, [restaurantAdmins, restaurantInfo])


    // this section is for the list of requests
    const [userRequests, setUserRequests] = useState();
    async function fetchUserRequests () {
        try {
            const { data, error } = await supabase.from("ALO-requests").select("*").eq("user_id", auth.userId).eq("request_status", "pending");
            if (error) console.log(error);
            setUserRequests(data);
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        if ((listName === "users in 'requests' screen") && (item)) {
            setFirstText({ content: item.user_display_name , style: [  t.textLeft, t.fontBold, t.textBlack ]});
            setSecondText({ content: item.restaurant_name , style: [  t.textLeft, t.fontNormal, t.textGray500, t.italic ]});
            setClassnames({ itemElementClassnames: [ tw.w4_6, tw.pY3 ], buttonOneClassnames: [ tw.w1_6 ], buttonTwoClassnames: [ tw.w1_6 ] })
        }
    }, [item])
    useEffect(() => {
        if (listName === "users in 'requests' screen" || listName === "restaurants in 'restaurant search' screen") {
            fetchUserRequests();
        }
    }, [])

    
    // this section is for the list of restaurants when searching
    const [restaurantsThatTheUserIsAnEmployeeOf, setRestaurantsThatTheUserIsAnEmployeeOf] = useState();
    async function fetchRestaurantsThatTheUserIsAnEmployeeOf () {
        try {
            const { data, error } = await supabase.from("ALO-employees").select("*").eq("user_id", auth.userId);
            if (error) console.log(error);
            setRestaurantsThatTheUserIsAnEmployeeOf(data);
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        if (listName === "restaurants in 'restaurant search' screen") {
            fetchRestaurantsThatTheUserIsAnEmployeeOf();

        }
    }, [])
    useEffect(() => {
        if (restaurantsThatTheUserIsAnEmployeeOf && (restaurantsThatTheUserIsAnEmployeeOf.length > 0)) {
            restaurantsThatTheUserIsAnEmployeeOf.map((restaurant) => {
                if (restaurant.restaurant_id === item.restaurant_id) {
                    setIsButtonOneVisible(false);
                }
            })
        }
    }, [restaurantsThatTheUserIsAnEmployeeOf])

    const [restaurantsThatTheUserIsAnAdminOf, setRestaurantsThatTheUserIsAnAdminOf] = useState();
    async function fetchRestaurantsThatTheUserIsAnAdminOf () {
        try {
            const { data, error } = await supabase.from("ALO-admins").select("*").eq("user_id", auth.userId);
            if (error) console.log(error);
            setRestaurantsThatTheUserIsAnAdminOf(data);
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        if (listName === "restaurants in 'restaurant search' screen") {
            fetchRestaurantsThatTheUserIsAnAdminOf();
        }
    }, [])
    useEffect(() => {
        if (restaurantsThatTheUserIsAnAdminOf && (restaurantsThatTheUserIsAnAdminOf.length > 0)) {
            restaurantsThatTheUserIsAnAdminOf.map((restaurant) => {
                if (restaurant.restaurant_id === item.restaurant_id) {
                    setIsButtonOneVisible(false);
                }
            })
        }
    }, [restaurantsThatTheUserIsAnAdminOf])
    useEffect(() => {
        if (userRequests && userRequests.length > 0) {
            userRequests.map((request) => {
                if (request.restaurant_id === item.restaurant_id) {
                    setIsButtonOneVisible(false);
                }
            })
        }
    }, [userRequests])

    useEffect(() => {
        if ((listName === "restaurants in 'restaurant search' screen") && (item)) {
            setFirstText({ content: item.restaurant_name , style: [ t.textLeft, t.fontBold, t.textBlack ]});
            isButtonOneVisible && setClassnames({ itemElementClassnames: [ tw.w4_5, tw.pY4 ], buttonOneClassnames: tw.w1_5 });
            !isButtonOneVisible && setClassnames({ itemElementClassnames: [ tw.wFull, tw.pY4 ], buttonOneClassnames: null });
        }
    }, [item])

    if ((listName === "restaurants in 'delete user account' screen" && restaurantAdmins && restaurantInfo) || ((listName === "restaurants in 'restaurant search' screen") && userRequests) || ((listName === "users in 'requests' screen") && userRequests)) {
        return (<View key={index} style={[[ tw.flex, tw.flexRow, tw.wFull ], itemClassnames]}>
            <TouchableHighlight onPress={itemElementAction} style={[[ tw.flex, tw.flexCol, tw.pY2, tw.pX2 ], classnames.itemElementClassnames]} underlayColor="#ccc" >
                <View>
                    {(firstText.content !== "") && <Text style={ firstText.style }>{firstText.content}</Text>}
                    {(secondText.content !== "") && <Text style={ secondText.style }>{secondText.content}</Text>}
                    {(thirdText.content !== "") && <Text style={ thirdText.style }>{thirdText.content}</Text>}
                </View>
            </TouchableHighlight>
            {buttonOne && isButtonOneVisible && <TouchableHighlight onPress={buttonOneAction} style={[[ tw.itemsCenter, tw.justifyCenter, tw.pY2 ], classnames.buttonOneClassnames ]} underlayColor="#ccc" >
                <Text style={[ t.textBlack ]}><Icon name={buttonOne} size={iconSize} /></Text>
            </TouchableHighlight>}
            {buttonTwo && isButtonTwoVisible && <TouchableHighlight onPress={buttonTwoAction} style={[[ tw.itemsCenter, tw.justifyCenter ], classnames.buttonTwoClassnames ]} underlayColor="#ccc" >
                <Text style={[ t.textBlack ]}><Icon name={buttonTwo} size={iconSize} /></Text>
            </TouchableHighlight>}
        </View>)
    }
}