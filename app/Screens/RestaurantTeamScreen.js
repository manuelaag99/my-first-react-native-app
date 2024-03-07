import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableHighlight, View } from "react-native";
import { t, tw } from "react-native-tailwindcss";
import { supabase } from "../supabase/client";
import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthContext } from "../Context/AuthContext";
import ListItem from "../Components/ListItem";
import { v4 as uuidv4 } from "uuid";
import ErrorModal from "../Components/ErrorModal";

export default function RestaurantTeamScreen ({ navigation, route }) {
    const auth = useContext(AuthContext);
    const [restaurantAdministratorsArray, setRestaurantAdministratorsArray] = useState();
    const [restaurantAdministratorsWithNamesArray, setRestaurantAdministratorsWithNamesArray] = useState();
    const [restaurantEmployeesArray, setRestaurantEmployeesArray] = useState();
    const [restaurantEmployeesWithNamesArray, setRestaurantEmployeesWithNamesArray] = useState();
    const [allUsers, setAllUsers] = useState();
    const [modalVisibility, setModalVisibility] = useState(false);

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

    let newAdminId;
    async function makeEmployeeAnAdministrator (employee) {
        newAdminId = uuidv4();
        try {
            const { error } = await supabase.from("ALO-admins").insert({ administrator_id: newAdminId, restaurant_id: restaurant_id, user_id: employee.user_id });
            if (error) console.log(error);
        } catch (err) {
            console.log(err);
        }
        try {
            const { error } = await supabase.from("ALO-employees").delete().eq("user_id", employee.user_id).eq("restaurant_id", employee.restaurant_id);
            if (error) console.log(error);
        } catch (err) {
            console.log(err);
        }
    }
    async function deleteEmployee (employee) {
        try {
            const { error } = await supabase.from("ALO-employees").delete().eq("user_id", employee.user_id).eq("restaurant_id", employee.restaurant_id);
            if (error) console.log(error);
        } catch {
            console.log(err);
        }
    }

    let newEmployeeId;
    async function makeAdministratorAnEmployee (administrator) {
        newEmployeeId = uuidv4();
        if (restaurantAdministratorsWithNamesArray && (restaurantAdministratorsWithNamesArray.length > 1)) {
            try {
                const { error } = await supabase.from("ALO-employees").insert({ employee_id: newEmployeeId, restaurant_id: restaurant_id, user_id: administrator.user_id });
                if (error) console.log(error);
            } catch (err) {
                console.log(err);
            }
            try {
                const { error } = await supabase.from("ALO-admins").delete().eq("user_id", administrator.user_id).eq("restaurant_id", administrator.restaurant_id);
                if (error) console.log(error);
            } catch (err) {
                console.log(err);
            }
        } else {
            setModalVisibility(true);
        }
    }
    
    async function deleteAdmin (administrator) {
        if (restaurantAdministratorsWithNamesArray && (restaurantAdministratorsWithNamesArray.length > 1)) {
            try {
                const { error } = await supabase.from("ALO-admins").delete().eq("user_id", administrator.user_id).eq("restaurant_id", administrator.restaurant_id);
                if (error) console.log(error);
            } catch {
                console.log(err);
            }
        } else {
            setModalVisibility(true);
        }
    }

    if (!restaurantEmployeesWithNamesArray || !restaurantEmployeesWithNamesArray) {
        return <ActivityIndicator style={[ tw.mT10]} size="large" color="#000" />
    } else if (restaurantEmployeesWithNamesArray && restaurantAdministratorsWithNamesArray) {
        return (
            <ScrollView>
                <View style={[ t.flex, t.flexCol, tw.mY2, tw.pX6, tw.wFull ]}>
                    <View style={[ tw.flex, tw.justifyCenter, tw.mY4 ]}>
                        <Text style={[ t.textGray700, t.textCenter ]}>
                            Administradores
                        </Text>
                    </View>

                    {restaurantAdministratorsWithNamesArray && (restaurantAdministratorsWithNamesArray.length > 0) && restaurantAdministratorsWithNamesArray.map((administrator, index) => {
                        return (
                            <ListItem buttonOne="clipboard" buttonOneAction={() => makeAdministratorAnEmployee(administrator)} buttonTwo="ban" buttonTwoAction={() => deleteAdmin(administrator)} iconSize={25} index={index} item={administrator} itemClassnames={[ tw.borderT, tw.borderGray400 ]} itemElementAction={() => console.log("yeah")} key={index} listName="admin users in 'restaurant team' screen" />
                        )
                    })}
                    {restaurantAdministratorsWithNamesArray && (restaurantAdministratorsWithNamesArray.length < 1) && <View style={[ tw.mY2 ]}>
                        <Text style={[ t.textCenter, t.textGray500 ]}>
                            No hay administradores en este restaurante.
                        </Text>
                    </View>}

                    <View style={[ tw.flex, tw.justifyCenter, tw.mY4 ]}>
                        <Text style={[ t.textGray700, t.textCenter ]}>
                            Empleados
                        </Text>
                    </View>
                    {restaurantEmployeesWithNamesArray && (restaurantEmployeesWithNamesArray.length > 0) && restaurantEmployeesWithNamesArray.map((employee, index) => {
                        return (
                            <ListItem buttonOne="clipboard" buttonOneAction={() => makeEmployeeAnAdministrator(employee)} buttonTwo="ban" buttonTwoAction={() => deleteEmployee(employee)} iconSize={25} index={index} item={employee} itemClassnames={[ tw.borderT, tw.borderGray400 ]} itemElementAction={() => console.log("yeah")} key={index} listName="employee users in 'restaurant team' screen" />
                        )
                    })}
                    {restaurantEmployeesWithNamesArray && (restaurantEmployeesWithNamesArray.length < 1) && <View style={[ tw.mY2 ]}>
                        <Text style={[ t.textCenter, t.textGray500 ]}>
                            No hay empleados en este restaurante.
                        </Text>
                    </View>}
                </View>
                <ErrorModal animationForModal="fade" onClose={() => setModalVisibility(false)} isVisible={modalVisibility} onPressingRedButton={() => setModalVisibility(false)} textForButton="Aceptar" textForModal="Un restaurante no puede quedarse sin administradores." />
            </ScrollView>
        )
    }
}