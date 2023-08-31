import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableHighlight, View } from "react-native";
import { t, tw } from "react-native-tailwindcss";
import { supabase } from "../supabase/client";
import Icon from 'react-native-vector-icons/FontAwesome';

export default function RestaurantTeamScreen ({ navigation, route }) {
    const [restaurantManager, setRestaurantManager] = useState({ manager_id: "", manager_name: "" });
    const [restaurantEmployeesArray, setRestaurantEmployeesArray] = useState();
    const [restaurantEmployeesWithNamesArray, setRestaurantEmployeesWithNamesArray] = useState();
    const [allUsers, setAllUsers] = useState();

    const { restaurant_id } = route.params;

    async function fetchRestaurantTeam () {
        try {
            const { data, error } = await supabase.from("ALO-restaurants").select("*").eq("restaurant_id", restaurant_id);
            if (error) console.log(error);
            setRestaurantManager({ ...restaurantManager, manager_id: data[0].creator_id});
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
        if (restaurantManager && allUsers) {
            setRestaurantManager({ ...restaurantManager, manager_name: allUsers.filter(user => user.user_id === restaurantManager.manager_id)[0].user_display_name})
        }
    }

    console.log(restaurantManager)

    useEffect(() => {
        fetchRestaurantTeam();
    }, [])

    useEffect(() => {
        populateEmployeesArray();
    }, [allUsers])

    console.log(restaurantEmployeesWithNamesArray)

    if (!restaurantManager || !restaurantEmployeesWithNamesArray) {
        return <ActivityIndicator style={[ tw.mT10]} size="large" color="#000" />
    } else if (restaurantManager && restaurantEmployeesWithNamesArray) {
        return (
            <ScrollView>
                <View style={[ t.flex, t.flexCol, tw.mY2, tw.pX6, tw.wFull ]}>
                    {restaurantManager && <View style={[ t.flex, t.flexCol, tw.wFull, tw.pY2, tw.pX1, tw.mY4 ]}>
                        <Text style={[ tw.h6, t.textLeft, t.textBlack, t.fontBold ]}>{restaurantManager.manager_name}</Text>
                        <Text style={[ tw.h6, t.textLeft, t.textGray600, t.italic ]}>Administrador</Text>
                    </View>}

                    {restaurantEmployeesWithNamesArray.map((employee, index) => {
                        return (
                            <View key={index} style={[ t.flex, t.flexRow, tw.wFull, tw.pX1, t.borderT, t.borderGray400 ]}>
                                <View style={[ t.flex, t.flexCol, tw.w4_6, tw.pY2 ]}>
                                    <View style={[ t.flex, t.flexRow, tw.wFull ]}>
                                        <Text style={[ tw.h6, t.textLeft, t.textBlack, t.fontBold ]}>{employee.employee_name}</Text>
                                    </View>
                                    <View style={[ t.flex, t.flexRow, tw.wFull ]}>
                                        <Text style={[ tw.h6, t.textLeft, t.textGray600, t.italic ]}>Empleado</Text>
                                        {employee.employee_position && <Text style={[ tw.h6, t.textLeft, t.textGray600, t.italic ]}> ({employee.employee_position})</Text>}
                                    </View>
                                </View>
                                <TouchableHighlight onPress={() => console.log("delete")} style={[ t.flex, t.justifyCenter, t.itemsCenter, tw.w1_6]} underlayColor="#99f">
                                    <Icon name="clipboard" size={25} />
                                </TouchableHighlight>
                                <TouchableHighlight onPress={() => console.log("delete")} style={[ t.flex, t.justifyCenter, t.itemsCenter, tw.w1_6]} underlayColor="#f99">
                                    <Icon name="user" size={25} />
                                </TouchableHighlight>
                            </View>
                        )
                    })}
                </View>
            </ScrollView>
        )
    }
}