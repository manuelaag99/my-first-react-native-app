import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableHighlight, View } from "react-native";
import { t, tw } from "react-native-tailwindcss";
import { supabase } from "../supabase/client";
import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthContext } from "../Context/AuthContext";

export default function RestaurantTeamScreen ({ navigation, route }) {
    const auth = useContext(AuthContext);
    const [restaurantAdministratorsArray, setRestaurantAdministratorsArray] = useState();
    const [restaurantAdministratorsWithNamesArray, setRestaurantAdministratorsWithNamesArray] = useState();
    const [restaurantEmployeesArray, setRestaurantEmployeesArray] = useState();
    const [restaurantEmployeesWithNamesArray, setRestaurantEmployeesWithNamesArray] = useState();
    const [allUsers, setAllUsers] = useState();

    const { restaurant_id } = route.params;

    async function fetchRestaurantTeam () {
        try {
            const { data, error } = await supabase.from("ALO-admins").select("*").eq("restaurant_id", restaurant_id);
            if (error) console.log(error);
            setRestaurantAdministratorsArray(data);
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

    function populateEmployeesAndAdministratorsArray() {
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
        if (restaurantAdministratorsArray) {
            restaurantAdministratorsArray.map((administrator) => {
                allUsers.map((user) => {
                    if (user.user_id === administrator.user_id) {
                        return administrator.administrator_name = user.user_display_name
                    }
                })
            })
            setRestaurantAdministratorsWithNamesArray(restaurantAdministratorsArray);
        }
    }

    const [isUserAnAdministrator, setIsUserAnAdministrator] = useState();
    useEffect(() => {
        if (restaurantAdministratorsArray && restaurantAdministratorsArray.length > 0) {
            restaurantAdministratorsArray.map((administrator) => {
                if (administrator.user_id === auth.userId) {
                    setIsUserAnAdministrator(true);
                } else {
                    setIsUserAnAdministrator(false);
                }
            })
        }
    }, [restaurantAdministratorsArray])

    useEffect(() => {
        fetchRestaurantTeam();
    }, [])

    useEffect(() => {
        populateEmployeesAndAdministratorsArray();
    }, [allUsers])

    console.log(restaurantAdministratorsArray)
    if (!restaurantEmployeesWithNamesArray || !restaurantEmployeesWithNamesArray) {
        return <ActivityIndicator style={[ tw.mT10]} size="large" color="#000" />
    } else if (restaurantEmployeesWithNamesArray && restaurantAdministratorsWithNamesArray) {
        return (
            <ScrollView>
                <View style={[ t.flex, t.flexCol, tw.mY2, tw.pX6, tw.wFull ]}>
                    <View style={[ tw.flex, tw.justifyCenter, tw.mY4 ]}>
                        <Text style={[ t.textGray600, t.textCenter ]}>
                            Administradores
                        </Text>
                    </View>
                    {restaurantAdministratorsWithNamesArray.map((administrator, index) => {
                        return (
                            <View key={index} style={[ t.flex, t.flexRow, tw.wFull, tw.pX1, t.borderT, t.borderGray400, tw.mB3  ]}>
                                <View style={[ t.flex, t.flexCol, tw.w4_6, tw.pY2 ]}>
                                    <View style={[ t.flex, t.flexRow, tw.wFull ]}>
                                        <Text style={[ tw.h6, t.textLeft, t.textBlack, t.fontBold ]}>{administrator.administrator_name}</Text>
                                    </View>
                                    <View style={[ t.flex, t.flexRow, tw.wFull ]}>
                                        <Text style={[ tw.h6, t.textLeft, t.textGray600, t.italic ]}>Administrador</Text>
                                    </View>
                                </View>
                                {(isUserAnAdministrator) && <TouchableHighlight onPress={() => console.log("delete")} style={[ t.flex, t.justifyCenter, t.itemsCenter, tw.w1_6]} underlayColor="#99f">
                                    <Icon name="clipboard" size={25} />
                                </TouchableHighlight>}
                                {(isUserAnAdministrator) && <TouchableHighlight onPress={() => console.log("delete")} style={[ t.flex, t.justifyCenter, t.itemsCenter, tw.w1_6]} underlayColor="#f99">
                                    <Icon name="user" size={25} />
                                </TouchableHighlight>}
                            </View>
                        )
                    })}

                    <View style={[ tw.flex, tw.justifyCenter, tw.mY4 ]}>
                        <Text style={[ t.textGray600, t.textCenter ]}>
                            Empleados
                        </Text>
                    </View>
                    {restaurantEmployeesWithNamesArray.map((employee, index) => {
                        return (
                            <View key={index} style={[ t.flex, t.flexRow, tw.wFull, tw.pX1, t.borderT, t.borderGray400, tw.mB3 ]}>
                                <View style={[ t.flex, t.flexCol, tw.w4_6, tw.pY2 ]}>
                                    <View style={[ t.flex, t.flexRow, tw.wFull ]}>
                                        <Text style={[ tw.h6, t.textLeft, t.textBlack, t.fontBold ]}>{employee.employee_name}</Text>
                                    </View>
                                    <View style={[ t.flex, t.flexRow, tw.wFull ]}>
                                        <Text style={[ tw.h6, t.textLeft, t.textGray600, t.italic ]}>Empleado</Text>
                                        {employee.employee_position && <Text style={[ tw.h6, t.textLeft, t.textGray600, t.italic ]}> ({employee.employee_position})</Text>}
                                    </View>
                                </View>
                                {(isUserAnAdministrator) && <TouchableHighlight onPress={() => console.log("delete")} style={[ t.flex, t.justifyCenter, t.itemsCenter, tw.w1_6]} underlayColor="#99f">
                                    <Icon name="clipboard" size={25} />
                                </TouchableHighlight>}
                                {(isUserAnAdministrator) && <TouchableHighlight onPress={() => console.log("delete")} style={[ t.flex, t.justifyCenter, t.itemsCenter, tw.w1_6]} underlayColor="#f99">
                                    <Icon name="user" size={25} />
                                </TouchableHighlight>}
                            </View>
                        )
                    })}
                </View>
            </ScrollView>
        )
    }
}