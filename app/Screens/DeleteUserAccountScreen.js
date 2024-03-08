import { ActivityIndicator, ScrollView, Text, TouchableHighlight, View } from "react-native";
import { supabase } from "../supabase/client";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import ListItem from "../Components/ListItem";
import { t, tw, tailwind } from "react-native-tailwindcss";

export default function DeleteUserAccountScreen ({ navigation, route }) {
    const auth = useContext(AuthContext);
    
    const [restaurantsThatTheUserIsAnAdminOf, setRestaurantsThatTheUserIsAnAdminOf] = useState();
    const [allOtherAdmins, setAllOtherAdmins] = useState();
    const [restaurantsThatTheUserIsAnEmployeeOf, setRestaurantsThatTheUserIsAnEmployeeOf] = useState();
    async function fetchAdmins () {
        try {
            const { data, error } = await supabase.from("ALO-admins").select("*").eq("user_id", auth.userId);
            if (error) console.log(error);
            setRestaurantsThatTheUserIsAnAdminOf(data);
        } catch (err) {
            console.log(err);
        }
        try {
            const { data, error } = await supabase.from("ALO-admins").select("*").neq("user_id", auth.userId);
            if (error) console.log(error);
            setAllOtherAdmins(data);
        } catch (err) {
            console.log(err);
        }
        try {
            const { data, error } = await supabase.from("ALO-employees").select("*").eq("user_id", auth.userId);
            setRestaurantsThatTheUserIsAnEmployeeOf(data);
            if (error) console.log(error);
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        fetchAdmins();
    }, [])

    const [adminsWithOnlyOneAdministrator, setAdminsWithOnlyOneAdministrator] = useState([]);
    const [adminsWithMoreThanOneAdministrator, setAdminsWithMoreThanOneAdministrator] = useState([]);
    let updatedArray
    useEffect(() => {
        if (restaurantsThatTheUserIsAnAdminOf && allOtherAdmins) {
            restaurantsThatTheUserIsAnAdminOf.map((userAdmin) => {
                allOtherAdmins.map((otherAdmin) => {
                    if (userAdmin.restaurant_id === otherAdmin.restaurant_id) {
                        setAdminsWithOnlyOneAdministrator((prevArray) => [])
                        setAdminsWithMoreThanOneAdministrator((prevArray) => [...prevArray, userAdmin ])
                    }
                })
            })
            restaurantsThatTheUserIsAnAdminOf.map((userAdmin) => {
                updatedArray = allOtherAdmins.filter(otherAdmin => otherAdmin.restaurant_id !== userAdmin.restaurant_id);
            })
            setAdminsWithOnlyOneAdministrator(updatedArray);
        }
    }, [allOtherAdmins, restaurantsThatTheUserIsAnAdminOf])


    




    function deleteIndividualRestaurantInfoFromDataBase () {
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


    if (!restaurantsThatTheUserIsAnAdminOf || !restaurantsThatTheUserIsAnEmployeeOf) {
        return (
            <View>
                <ActivityIndicator style={[ tw.mT10 ]} size="large" color="#000" />
            </View>
        )
    } else {
        return (
            <ScrollView>
                <View style={[ tw.flex, tw.flexCol, t.pX5, t.pB10, tw.hScreen, tw.wScreen, t.bgWhite ]}>
                    <View style={[ tw.flex, tw.flexCol, tw.mY3 ]}>
                        <View style={[ tw.mY6, tw.pX5, tw.flex, tw.justifyCenter, tw.itemsCenter ]}>
                            <Text style={[ t.textCenter, tw.mT3 ]}>
                                Si quieres eliminar tu cuenta, considera la información asociada con ella. Te la recordamos a continuación.
                            </Text>
                        </View>

                        <View style={[ tw.flex, tw.justifyCenter, tw.itemsCenter, tw.pX4, tw.mY4 ]}>
                            <Text style={[ t.textCenter, tw.fontBold ]}>
                                Mis restaurantes
                            </Text>
                            <View style={[ tw.bgBlack, tw.borderB, tw.h0, tw.wFull, tw.mT2 ]}></View>
                            {restaurantsThatTheUserIsAnAdminOf && (restaurantsThatTheUserIsAnAdminOf.length > 0) && restaurantsThatTheUserIsAnAdminOf.map((admin, index) => {
                                return (
                                    <ListItem buttonOne={"facebook"} buttonOneAction={() => navigation.navigate("Restaurant", { restaurant_id: admin.restaurant_id, user_id: auth.userId })} buttonTwo={"ban"} iconSize={25} item={admin} index={index} itemClassnames={null} itemElementAction={() => navigation.navigate("Restaurant", { user_id: auth.userId, restaurant_id: admin.restaurant_id })} key={index} listName="restaurants that the user is an admin of in 'delete user account' screen" />
                                )
                            })}
                            {restaurantsThatTheUserIsAnAdminOf && (restaurantsThatTheUserIsAnAdminOf.length < 1) && <Text style={[ tw.wFull, t.textCenter, tw.mT4, tw.pX4 ]}>
                                No hay restaurantes.
                            </Text>}
                        </View>

                        <View style={[ tw.flex, tw.justifyCenter, tw.itemsCenter, tw.pX4, tw.mY4 ]}>
                            <Text style={[ t.textCenter, tw.fontBold ]}>
                                Restaurantes en los que trabajo
                            </Text>
                            <View style={[ tw.bgBlack, tw.borderB, tw.h0, tw.wFull, tw.mT2 ]}></View>
                            {restaurantsThatTheUserIsAnEmployeeOf && (restaurantsThatTheUserIsAnEmployeeOf.length > 0) && restaurantsThatTheUserIsAnEmployeeOf.map((employee, index) => {
                                return (
                                    <ListItem buttonOne={"facebook"} buttonOneAction={() => navigation.navigate("Restaurant", { restaurant_id: employee.restaurant_id, user_id: auth.userId })} buttonTwo={null} iconSize={25} item={employee} index={index} itemClassnames={null} itemElementAction={() => navigation.navigate("Restaurant", { user_id: auth.userId, restaurant_id: employee.restaurant_id })} key={index} listName="restaurants that the user is an employee of in 'delete user account' screen" />
                                )
                            })}
                            {restaurantsThatTheUserIsAnEmployeeOf && (restaurantsThatTheUserIsAnEmployeeOf.length < 1) && <Text style={[ tw.wFull, t.textCenter, tw.mT4, tw.pX4 ]}>
                                No hay restaurantes.
                            </Text>}
                        </View> 

                    </View>
                    {(adminsWithOnlyOneAdministrator && (adminsWithOnlyOneAdministrator.length > 0)) && <View style={[ tw.flex, tw.mY3, tw.pX4]}>
                        <Text style={[ t.textCenter, t.textRed500]}>
                            No podrás eliminar tu cuenta a menos a que todos tus restaurantes sin otros administradores hayan sido eliminados. Considera nombrar a más administradores o elimina los restaurantes manualmente.
                        </Text>
                    </View>}
                    <View style={[ tw.mY3 ]}>
                        <TouchableHighlight disabled={(adminsWithOnlyOneAdministrator && (adminsWithOnlyOneAdministrator.length > 0))} onPress={deleteUserInfoFromDataBase} style={[[ t.flex, t.justifyCenter, t.itemsCenter, tw.pX3, tw.pY4, tw.mY3, tw.wFull, tailwind.roundedLg, tailwind.shadow2xl, (!(adminsWithOnlyOneAdministrator && (adminsWithOnlyOneAdministrator.length > 0)) ? t.bgRed700 : t.bgRed300 ) ]]} underlayColor="#f11">
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