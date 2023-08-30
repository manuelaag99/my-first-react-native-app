import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { t, tw } from "react-native-tailwindcss";
import { supabase } from "../supabase/client";

export default function RestaurantTeamScreen ({ navigation, route }) {
    const [restaurantManager, setRestaurantManager] = useState();
    const [restaurantEmployeesArray, setRestaurantEmployeesArray] = useState();

    const { restaurant_id } = route.params;

    async function fetchRestaurantTeam () {
        try {
            const { data, error } = await supabase.from("ALO-restaurants").select("*").eq("restaurant_id", restaurant_id);
            if (error) console.log(error);
            setRestaurantManager();
            setRestaurantEmployeesArray();
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchRestaurantTeam();
    }, [])

    if (!restaurantManager || !restaurantEmployeesArray) {
        return <ActivityIndicator style={[ tw.mT10]} size="large" color="#000" />
    } else if (restaurantManager && restaurantEmployeesArray) {
        return (
            <ScrollView>
                <View style={[ t.flex, t.flexCol, tw.mY2, tw.pX4, tw.wFull ]}>
                    {restaurantManager && <View style={[ t.flex, t.flexCol, tw.wFull ]}>
                        <Text style={[ tw.h12, t.textLeft, t.textBlack, t.fontBold ]}>NOMBRE</Text>
                        <Text style={[ tw.h12, t.textLeft, t.textGray600, t.italic ]}>Administrador</Text>
                    </View>}

                    <View style={[ t.flex, t.flexCol, tw.wFull ]}>
                        <Text style={[ tw.h12, t.textLeft, t.textBlack, t.fontBold ]}>NOMBRE</Text>
                        <Text style={[ tw.h12, t.textLeft, t.textGray600, t.italic ]}>Administrador</Text>
                    </View>
    
                </View> 
            </ScrollView>
        )
    }
}