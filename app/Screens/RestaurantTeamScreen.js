import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { t, tw } from "react-native-tailwindcss";
import { supabase } from "../supabase/client";

export default function RestaurantTeamScreen ({ navigation, route }) {
    const [restaurantManager, setRestaurantManager] = useState();
    const [restaurantEmployeesArray, setRestaurantEmployeesArray] = useState();
    const [restaurantEmployeesWithNamesArray, setRestaurantEmployeesWithNamesArray] = useState();
    const [allUsers, setAllUsers] = useState();

    const { restaurant_id } = route.params;

    async function fetchRestaurantTeam () {
        try {
            const { data, error } = await supabase.from("ALO-restaurants").select("*").eq("restaurant_id", restaurant_id);
            if (error) console.log(error);
            setRestaurantManager(data[0].creator_id);
        } catch (err) {
            console.log(err);
        }
        try {
            const { data, error } = await supabase.from("ALO-employees").select("*").eq("restaurant_id", restaurant_id);
            if (error) console.log(error);
            setRestaurantEmployeesArray(data);
        } catch (err) {
            console.log(err);
        }
        try {
            const { data, error } = await supabase.from("ALO-users-db").select("*");
            if (error) console.log(error);
            setAllUsers(data);
        } catch (err) {
            console.log(err);
        }
    }

    // let restaurantEmployeesWithName;
    function populateEmployeesArray() {
        if (restaurantEmployeesArray) {
            restaurantEmployeesArray.map((employee) => {
                allUsers.map((user) => {
                    if (user.user_id === employee.user_id) {
                        return employee.employee_name = user.user_display_name
                    }
                })
            })
            setRestaurantEmployeesWithNamesArray(restaurantEmployeesArray);
        }
    }

    useEffect(() => {
        fetchRestaurantTeam();
    }, [])

    useEffect(() => {
        populateEmployeesArray();
    }, [allUsers])

    if (!restaurantManager || !restaurantEmployeesWithNamesArray) {
        return <ActivityIndicator style={[ tw.mT10]} size="large" color="#000" />
    } else if (restaurantManager && restaurantEmployeesWithNamesArray) {
        return (
            <ScrollView>
                <View style={[ t.flex, t.flexCol, tw.mY2, tw.pX6, tw.wFull ]}>
                    {restaurantManager && <View style={[ t.flex, t.flexCol, tw.wFull, tw.pY2, tw.mY4 ]}>
                        <Text style={[ tw.h6, t.textLeft, t.textBlack, t.fontBold ]}>NOMBRE</Text>
                        <Text style={[ tw.h6, t.textLeft, t.textGray600, t.italic ]}>Administrador</Text>
                    </View>}

                    {restaurantEmployeesWithNamesArray.map((employee, index) => {
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