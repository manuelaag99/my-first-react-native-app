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
            setRestaurantManager(data[0].creator_id);
            // setRestaurantEmployeesArray();
        } catch (err) {
            console.log(err);
        }
    }

    const EMPLOYEESARRAY = [
        { employee_name: "Luis Fdz", employee_id: "af921f7d-079b-43cc-a360-5a001e2345a3" },
        { employee_name: "Jimmy McGill", employee_id: "89ebd3e4-e391-417a-a8e4-2d90b50eafda" },
        { employee_name: "Chuck", employee_id: "c69313f0-d067-4d7c-af01-83167b055aa8" }
    ]

    useEffect(() => {
        fetchRestaurantTeam();
        setRestaurantEmployeesArray(EMPLOYEESARRAY)
    }, [])

    if (!restaurantManager || !restaurantEmployeesArray) {
        return <ActivityIndicator style={[ tw.mT10]} size="large" color="#000" />
    } else if (restaurantManager && restaurantEmployeesArray) {
        return (
            <ScrollView>
                <View style={[ t.flex, t.flexCol, tw.mY2, tw.pX6, tw.wFull ]}>
                    {restaurantManager && <View style={[ t.flex, t.flexCol, tw.wFull, tw.pY2, tw.mY4 ]}>
                        <Text style={[ tw.h6, t.textLeft, t.textBlack, t.fontBold ]}>NOMBRE</Text>
                        <Text style={[ tw.h6, t.textLeft, t.textGray600, t.italic ]}>Administrador</Text>
                    </View>}

                    {restaurantEmployeesArray.map((employee, index) => {
                        return (
                            <View key={index} style={[ t.flex, t.flexCol, tw.wFull, tw.pY2, t.borderT, t.borderGray400 ]}>
                                <Text style={[ tw.h6, t.textLeft, t.textBlack, t.fontBold ]}>{employee.employee_name}</Text>
                                <Text style={[ tw.h6, t.textLeft, t.textGray600, t.italic ]}>Empleado</Text>
                            </View>
                        )
                    })}
                </View>
            </ScrollView>
        )
    }
}