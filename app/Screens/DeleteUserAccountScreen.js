import { ActivityIndicator, ScrollView, Text, TouchableHighlight, View } from "react-native";
import { supabase } from "../supabase/client";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import ListItem from "../Components/ListItem";
import { t, tw, tailwind } from "react-native-tailwindcss";

export default function DeleteUserAccountScreen ({ navigation, route }) {
    const auth = useContext(AuthContext);
    
    const [allUserAdmins, setAllUserAdmins] = useState();
    async function fetchAdmins () {
        try {
            const { data, error } = await supabase.from("ALO-admins").select("*").eq("user_id", auth.userId);
            if (error) console.log(error);
            setAllUserAdmins(data);
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        fetchAdmins();
    }, [])

    const [userRestaurants, setUserRestaurants] = useState();
    async function fetchUserRestaurants () {
        try {
            const { data, error } = await supabase.from("ALO-admins").select("restaurant_id").eq("user_id", auth.userId);
            if (error) console.log(error);
            setUserRestaurants(data);
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        fetchUserRestaurants();
    }, [])

    console.log(userRestaurants)

    function deleteIndividualRestaurantInfoFromDataBase () {
        console.log("yeah")
        // try {
        //     const { error } = await supabase.from("ALO-restaurants").delete().eq("restaurant_id", admin.restaurant_id);
        //     if (error) console.log(error);
        // } catch (err) {
        //     console.log(err);
        // }
        // try {
        //     const { error } = await supabase.from("ALO-restaurant-orders").delete().eq("restaurant_id", admin.restaurant_id);
        //     if (error) console.log(error);
        // } catch (err) {
        //     console.log(err);
        // }
        // try {
        //     const { error } = await supabase.from("ALO-restaurant-menu-items").delete().eq("restaurant_id", admin.restaurant_id);
        //     if (error) console.log(error);
        // } catch (err) {
        //     console.log(err);
        // }
        // try {
        //     const { error } = await supabase.from("ALO-orders-dishes").delete().eq("restaurant_id", admin.restaurant_id);
        //     if (error) console.log(error);
        // } catch (err) {
        //     console.log(err);
        // }
    }
    let restaurantstodelete = "d90ecd09-266e-4796-be1f-f7a7133c074e"
    async function deleteAllUserRestaurantsInfoFromDataBase () {
        allUserAdmins.forEach(element => {
            console.log(element)
        });
        try {
            const { error } = await supabase.from("ALO-restaurants").delete().eq("restaurant_id", restaurantstodelete);
            if (error) console.log(error);
        } catch (err) {
            console.log(err);
        }
    }

    async function deleteUserInfoFromDataBase () {
        try {
            const { error } = await supabase.from("ALO-users-db").delete().eq("user_id", auth.userId);
            if (error) console.log(error);
        } catch (err) {
            console.log(err);
        }
        try {
            const { error } = await supabase.from("ALO-admins").delete().eq("user_id", auth.userId);
            if (error) console.log(error);
        } catch (err) {
            console.log(err);
        }
        try {
            const { error } = await supabase.from("ALO-employees").delete().eq("user_id", auth.userId);
            if (error) console.log(error);
        } catch (err) {
            console.log(err);
        }
        try {
            const { error } = await supabase.from("ALO-requests").delete().eq("user_id", auth.userId);
            if (error) console.log(error);
        } catch (err) {
            console.log(err);
        }
    }

    if (!allUserAdmins) {
        return (
            <View>
                <ActivityIndicator style={[ tw.mT10]} size="large" color="#000" />
            </View>
        )
    } else {
        return (
            <ScrollView>
                <View style={[ tw.flex, tw.flexCol, t.pX5, t.pB10, tw.hScreen, tw.wScreen, t.bgWhite ]}>
                    <View style={[ tw.flex, tw.flexCol, tw.mY3 ]}>
                        <View style={[ tw.mY6, tw.pX5, tw.flex, tw.justifyCenter, tw.itemsCenter ]}>
                            <Text style={[ t.textCenter, tw.fontBold ]}>
                                Mis restaurantes
                            </Text><Text style={[ t.textCenter, tw.mT3 ]}>
                                Si quieres eliminar tu cuenta, considera la información asociada con ella. Te la recordamos a continuación.
                            </Text>
                        </View>
                        {allUserAdmins && (allUserAdmins.length > 0) && allUserAdmins.map((admin, index) => {
                            return (
                                <ListItem buttonOne={true} key={index} item={admin} index={index} itemClassnames={null} itemElementClassnames={[tw.w4_5, tw.pR5]} navigation={navigation} />
                            )
                        })}
                    </View>
                    <View style={[ tw.mT5 ]}>
                        <TouchableHighlight onPress={deleteUserInfoFromDataBase} style={[ t.flex, t.justifyCenter, t.itemsCenter, tw.pX3, tw.pY4, tw.mY3, tw.wFull, tailwind.roundedLg, tailwind.shadow2xl, t.bgRed700]} underlayColor="#f11">
                            <Text style={[ t.textWhite ]}>
                                Borrar mi cuenta permanentemente
                            </Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </ScrollView>
        )
    }
}