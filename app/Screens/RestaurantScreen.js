import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableHighlight, View } from "react-native";
import { t, tw, tailwind } from "react-native-tailwindcss";
import ModalTemplate from "../Components/ModalTemplate";
import NewItem from "../Components/NewItem";
import { supabase } from "../supabase/client";
import { AuthContext } from "../Context/AuthContext";

export default function RestaurantScreen ({ route, navigation }) {
    const auth = useContext(AuthContext);
    const [modalVisibility, setModalVisibility] = useState(false);
    const [newItemVisibility, setNewItemVisibility] = useState(false);
    const [updateRestaurantVisibility, setUpdateRestaurantVisibility] = useState(false);

    const { user_id, restaurant_id } = route.params

    const [restaurantInfo, setRestaurantInfo] = useState();
    async function fetchRestaurantInfo () {
        try {
            const { data, error } = await supabase.from("ALO-restaurants").select("*").eq("restaurant_id", restaurant_id);
            if (error) console.log(error);
            console.log(data)
            setRestaurantInfo(data[0]);
        } catch (err) {
            console.log(err);
        }
    }

    const [restaurantCreatorInfo, setRestaurantCreatorInfo] = useState();
    async function fetchRestaurantCreatorInfo() {
        try {
            const { data, error } = await supabase.from("ALO-users-db").select("*").eq("user_id", restaurantInfo.creator_id);
            if (error) console.log(error);
            console.log(data)
            setRestaurantCreatorInfo(data[0]);
        } catch (err) {
            console.log(err);
        }
    }

    const [restaurantEmployees, setRestaurantEmployees] = useState();
    const [restaurantAdministratorsArray, setRestaurantAdministratorsArray] = useState();
    async function fetchRestaurantEmployeesAndAdministrators() {
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
            console.log(data)
            setRestaurantEmployees(data);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchRestaurantInfo();
    }, [])

    useEffect(() => {
        if (restaurantInfo) {
            fetchRestaurantCreatorInfo();
            fetchRestaurantEmployeesAndAdministrators();
        }
    }, [restaurantInfo])

    const [isUserEmployee, setIsUserEmployee] = useState()
    useEffect(() => {
        if (restaurantEmployees && restaurantEmployees.length > 0) {
            restaurantEmployees.map((employee) => {
                if (employee.employee_id === user_id) {
                    setIsUserEmployee(true);
                } else {
                    setIsUserEmployee(false);
                }
            })
        }
    }, [restaurantEmployees, ])
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

    function navigateAfterDeletingRestaurant () {
        navigation.navigate("User");
    }

    function fetchAgain () {
        fetchRestaurantInfo();
    }

    if (!restaurantInfo || !restaurantCreatorInfo || !restaurantEmployees) {
        return (
            <ActivityIndicator style={[ tw.mT10]} size="large" color="#000" />
        )
    } else if (restaurantInfo && restaurantCreatorInfo && restaurantEmployees) {
        return (
            <ScrollView style={[ t.bgGray200 ]}>
                <View style={[ t.flex, t.flexCol, tw.justifyStart, t.pX5, tw.hFull, tw.wFull, tw.overflowHidden, tw.pY5 ]}>
                    <View style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, tw.mXAuto, tw.pY4, tw.mY4, tw.pX6 ]}>
                        <Text style={[ tw.wFull, t.textCenter, t.fontBold, t.text5xl, tw.pY4 ]}>
                            {restaurantInfo.restaurant_name}
                        </Text>
                        {restaurantInfo.restaurant_description && <Text style={[ tw.wFull, t.textCenter, t.text2xl, t.textGray500, tw.pB3 ]}>
                            {restaurantInfo.restaurant_description}
                        </Text>}
                        <Text style={[ tw.wFull, t.textCenter, t.fontBold, t.textGray500, t.textBase ]}>
                            creado por {restaurantCreatorInfo.user_display_name}
                        </Text>
                        <Text style={[ tw.wFull, t.textCenter, t.fontBold, t.textGray500, t.textBase, tw.mY2 ]}>
                            {isUserAnAdministrator && "Eres administrador."}
                            {isUserEmployee && "Eres empleado."}
                        </Text>
                    </View>
    
                    {(!isUserAnAdministrator) && <TouchableHighlight underlayColor="#ffdd88" onPress={() => console.log("send employee request")} style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, t.bgOrange400, tw.border, tw.borderGray200, tw.mXAuto, tw.pY6, tw.mY6, tailwind.roundedLg ]}>
                        <Text style={[ t.textCenter, t.fontBold, t.textWhite ]}>
                            Soy empleado
                        </Text>
                    </TouchableHighlight>}

                    {((isUserAnAdministrator) || (isUserEmployee)) && <TouchableHighlight underlayColor="#ccc" onPress={() => setNewItemVisibility(true)} style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, t.bgWhite, tw.border, tw.borderGray200, tw.mXAuto, tw.pY6, tw.mY6, tailwind.roundedLg ]}>
                        <Text style={[ t.textCenter, t.fontBold, t.textBlack ]}>
                            + Agregar orden
                        </Text>
                    </TouchableHighlight>}
    
                    {((isUserAnAdministrator) || (isUserEmployee)) && <TouchableHighlight underlayColor="#ffeebb" onPress={() => navigation.navigate("Orders", { user_id: auth.userId, restaurant_id: restaurant_id })} style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, t.bgYellow500, tw.mXAuto, tw.pY6, tw.mY6, tailwind.roundedLg ]}>
                        <Text style={[ t.textCenter, t.fontBold, t.textWhite ]}>
                            Ver órdenes
                        </Text>
                    </TouchableHighlight>}
    
                    {((isUserAnAdministrator) || (isUserEmployee)) && <TouchableHighlight underlayColor="#CCE5FF" onPress={() => navigation.navigate("Menu", { user_id: auth.userId, restaurant_id: restaurant_id })} style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, t.bgBlue400, tw.mXAuto, tw.pY6, tw.mY6, tailwind.roundedLg ]}>
                        <Text style={[ t.textCenter, t.fontBold, t.textWhite ]}>
                            Ver Menú
                        </Text>
                    </TouchableHighlight>}

                    {(isUserAnAdministrator) && <TouchableHighlight underlayColor="#DDFFDD" onPress={() => navigation.navigate("Team", { restaurant_id: restaurant_id })} style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, t.bgGreen400, tw.mXAuto, tw.pY6, tw.mY6, tailwind.roundedLg ]}>
                        <Text style={[ t.textCenter, t.fontBold, t.textWhite ]}>
                            Ver Equipo
                        </Text>
                    </TouchableHighlight>}
    
                    {(isUserAnAdministrator) && <TouchableHighlight underlayColor="#ccc" onPress={() => setUpdateRestaurantVisibility(true)} style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, t.bgWhite, tw.border, tw.borderGray200, tw.mXAuto, tw.pY6, tw.mT20, tw.mB6, tailwind.roundedLg ]}>
                        <Text style={[ t.textCenter, t.fontBold, t.textBlack ]}>
                            Modificar restaurante
                        </Text>
                    </TouchableHighlight>}
                    
                    {(isUserAnAdministrator) && <TouchableHighlight underlayColor="#ff6666" onPress={() => setModalVisibility(true)} style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, t.bgRed700, tw.mXAuto, tw.pY6, tw.mY6, tailwind.roundedLg ]}>
                        <Text style={[ t.textCenter, t.fontBold, t.textWhite ]}>
                            Eliminar restaurante
                        </Text>
                    </TouchableHighlight>}
    
                    <NewItem dishesToUpdate={null} isUpdating={false} isVisible={newItemVisibility} itemId={null} itemToAdd="order" itemToUpdate={null} onClose={() => setNewItemVisibility(false)} restaurantId={restaurant_id} textForAddButton="AGREGAR" topText="Nueva orden" updateFetchedData={fetchAgain} userId={auth.userId} />
                    <NewItem dishesToUpdate={null} isUpdating={true} isVisible={updateRestaurantVisibility} itemId={restaurant_id} itemToAdd="restaurant" itemToUpdate={restaurantInfo} onClose={() => setUpdateRestaurantVisibility(false)} restaurantId={restaurant_id} textForAddButton="ACTUALIZAR" topText="Modificar restaurante" updateFetchedData={fetchAgain} userId={auth.userId} />
                    <ModalTemplate actionButtonBorder={tw.borderRed700} actionButtonColor={tw.bgRed700} isVisible={modalVisibility} onClose={() => setModalVisibility(false)} onTasksAfterAction={navigateAfterDeletingRestaurant} restaurantId={restaurant_id} textForButton="Eliminar" textForModal="¿Quieres eliminar este restaurante? Esto es permanente." userId={auth.userId} />
                </View>
            </ScrollView>
        )
    }
}