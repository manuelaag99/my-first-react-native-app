import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableHighlight, View } from "react-native";
import { t, tw, tailwind } from "react-native-tailwindcss";
import ModalTemplate from "../Components/ModalTemplate";
import NewItem from "../Components/NewItem";
import { supabase } from "../supabase/client";
import { AuthContext } from "../Context/AuthContext";

export default function RestaurantScreen ({ route, navigation }) {
    const auth = useContext(AuthContext);
    const [newItemVisibility, setNewItemVisibility] = useState(false);
    const [updateRestaurantVisibility, setUpdateRestaurantVisibility] = useState(false);

    const { user_id, restaurant_id } = route.params

    const [restaurantInfo, setRestaurantInfo] = useState();
    const [restaurantEmployeesArray, setRestaurantEmployeesArray] = useState();
    const [restaurantAdministratorsArray, setRestaurantAdministratorsArray] = useState();
    const [userRequests, setUserRequests] = useState();
    async function fetchData () {
        try {
            const { data, error } = await supabase.from("ALO-restaurants").select("*").eq("restaurant_id", restaurant_id);
            if (error) console.log(error);
            console.log(data)
            setRestaurantInfo(data[0]);
        } catch (err) {
            console.log(err);
        }
        
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
            setRestaurantEmployeesArray(data);
        } catch (err) {
            console.log(err);
        }
        try {
            const { data, error } = await supabase.from("ALO-requests").select("*").eq("user_id", auth.userId).eq("request_status", "pending");
            if (error) console.log(error);
            setUserRequests(data);
        } catch (err) {
            console.log(err);
        }
    }

    const [restaurantCreatorInfo, setRestaurantCreatorInfo] = useState();
    async function fetchRestaurantCreatorInfo () {
        try {
            const { data, error } = await supabase.from("ALO-users-db").select("*").eq("user_id", restaurantInfo.creator_id);
            if (error) console.log(error);
            console.log(data)
            setRestaurantCreatorInfo(data[0]);
        } catch (err) {
            console.log(err);
        }
    }


    const [hasUserSentRequest, setHasUserSentRequest] = useState(false);
    useEffect(() => {
        if (userRequests && userRequests.length > 0) {
            userRequests.map((request) => {
                if (request.restaurant_id === restaurant_id) {
                    setHasUserSentRequest(true);
                }
            })
        }
    }, [userRequests])

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        if (restaurantInfo) {
            fetchRestaurantCreatorInfo();
        }
    }, [restaurantInfo])

    const [isUserAnAdministrator, setIsUserAnAdministrator] = useState();
    useEffect(() => {
        if (restaurantAdministratorsArray && restaurantAdministratorsArray.length > 0) {
            restaurantAdministratorsArray.map((administrator) => {
                if (administrator.user_id === auth.userId) {
                    setIsUserAnAdministrator(true);
                }
            })
        }
    }, [restaurantAdministratorsArray])
    const [isUserAnEmployee, setisUserAnEmployee] = useState()
    useEffect(() => {
        if (restaurantEmployeesArray && restaurantEmployeesArray.length > 0) {
            restaurantEmployeesArray.map((employee) => {
                if (employee.user_id === auth.userId) {
                    setisUserAnEmployee(true);
                }
            })
        }
    }, [restaurantEmployeesArray])

    function navigateAfterDeletingRestaurant () {
        navigation.navigate("User");
    }

    function fetchAgain () {
        fetchData();
    }

    const [isModalTemplateVisible, setIsModalTemplateVisible] = useState(false);
    const [restaurantIdToSendRequestTo, setRestaurantIdToSendRequestTo] = useState();
    const [textForModalTemplate, setTextForModalTemplate] = useState();
    const [textForModalTemplateButton, setTextForModalTemplateButton] = useState();
    function openModalToSendRequest (restaurant_id) {
        setRestaurantIdToSendRequestTo(restaurant_id);
        setTextForModalTemplate("¿Quieres solicitar unirte a este restaurante?");
        setTextForModalTemplateButton("Sí, enviar");
        setIsModalTemplateVisible(true);
    }
    
    function openModalToDeleteRestaurant (restaurant_id) {
        setRestaurantIdToSendRequestTo(restaurant_id);
        setTextForModalTemplate("¿Quieres eliminar este restaurante? Esto es permanente y borrará todo el menu, todas las ordenes, todos los empleados y administradores, y las solicitudes.");
        setTextForModalTemplateButton("Sí, eliminar");
        setIsModalTemplateVisible(true);
    }

    if (!restaurantInfo || !restaurantCreatorInfo || !restaurantEmployeesArray || !restaurantAdministratorsArray || !userRequests) {
        return (
            <ActivityIndicator style={[ tw.mT10]} size="large" color="#000" />
        )
    } else if (restaurantInfo && restaurantCreatorInfo && restaurantEmployeesArray && restaurantAdministratorsArray && userRequests) {
        return (
            <ScrollView style={[ t.bgGray200 ]}>
                <View style={[ t.flex, t.flexCol, tw.justifyStart, t.pX5, tw.hFull, tw.wFull, tw.overflowHidden, tw.pT5, tw.pB20 ]}>
                    <View style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, tw.mXAuto, tw.pY4, tw.pX6 ]}>
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
                            {isUserAnEmployee && "Eres empleado."}
                        </Text>
                    </View>
    
                    {(!isUserAnAdministrator) && (!isUserAnEmployee) && (!hasUserSentRequest) && <TouchableHighlight underlayColor="#ffdd88" onPress={() => openModalToSendRequest(restaurant_id)} style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, t.bgOrange400, tw.border, tw.borderGray200, tw.mXAuto, tw.pY6, tailwind.roundedLg ]}>
                        <Text style={[ t.textCenter, t.fontBold, t.textWhite ]}>
                            Enviar solicitud a este restaurante
                        </Text>
                    </TouchableHighlight>}

                    {(!isUserAnAdministrator) && (!isUserAnEmployee) && (hasUserSentRequest) && <View style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, tw.mXAuto ]}>
                        <Text style={[ t.textCenter, t.fontBold, t.textBlack ]}>
                            Ya enviaste solicitud para trabajar aquí.
                        </Text>
                    </View>}

                    {((isUserAnAdministrator) || (isUserAnEmployee)) && <TouchableHighlight underlayColor="#ccc" onPress={() => setNewItemVisibility(true)} style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, t.bgWhite, tw.border, tw.borderGray200, tw.mXAuto, tw.pY6, tw.mY6, tailwind.roundedLg ]}>
                        <Text style={[ t.textCenter, t.fontBold, t.textBlack ]}>
                            + Agregar orden
                        </Text>
                    </TouchableHighlight>}
    
                    {((isUserAnAdministrator) || (isUserAnEmployee)) && <TouchableHighlight underlayColor="#ffeebb" onPress={() => navigation.navigate("Orders", { user_id: auth.userId, restaurant_id: restaurant_id })} style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, t.bgYellow500, tw.mXAuto, tw.pY6, tw.mY6, tailwind.roundedLg ]}>
                        <Text style={[ t.textCenter, t.fontBold, t.textWhite ]}>
                            Ver órdenes
                        </Text>
                    </TouchableHighlight>}
    
                    {((isUserAnAdministrator) || (isUserAnEmployee)) && <TouchableHighlight underlayColor="#CCE5FF" onPress={() => navigation.navigate("Menu", { user_id: auth.userId, restaurant_id: restaurant_id })} style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, t.bgBlue400, tw.mXAuto, tw.pY6, tw.mY6, tailwind.roundedLg ]}>
                        <Text style={[ t.textCenter, t.fontBold, t.textWhite ]}>
                            Ver Menú
                        </Text>
                    </TouchableHighlight>}

                    {(isUserAnAdministrator) && <TouchableHighlight underlayColor="#DDFFDD" onPress={() => navigation.navigate("Team", { restaurant_id: restaurant_id })} style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, t.bgGreen400, tw.mXAuto, tw.pY6, tw.mY6, tailwind.roundedLg ]}>
                        <Text style={[ t.textCenter, t.fontBold, t.textWhite ]}>
                            Ver Equipo
                        </Text>
                    </TouchableHighlight>}

                    {(isUserAnAdministrator) && <View style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, tw.mXAuto, tw.pY4, tw.mY4, tw.pX6 ]}>
                        <Text style={[ tw.wFull, t.textCenter, t.fontBold, t.textGray500, t.textBase ]}>
                            -- Opciones de restaurante --
                        </Text>
                    </View>}
    
                    {(isUserAnAdministrator) && <TouchableHighlight underlayColor="#ccc" onPress={() => setUpdateRestaurantVisibility(true)} style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, t.bgWhite, tw.border, tw.borderGray200, tw.mXAuto, tw.pY6, tw.mY6, tailwind.roundedLg ]}>
                        <Text style={[ t.textCenter, t.fontBold, t.textBlack ]}>
                            Modificar restaurante
                        </Text>
                    </TouchableHighlight>}
                    
                    {(isUserAnAdministrator) && <TouchableHighlight underlayColor="#ff6666" onPress={() => openModalToDeleteRestaurant(restaurant_id)} style={[ t.flex, t.flexCol, tw.justifyCenter, tw.wFull, t.bgRed700, tw.mXAuto, tw.pY6, tw.mY6, tailwind.roundedLg ]}>
                        <Text style={[ t.textCenter, t.fontBold, t.textWhite ]}>
                            Eliminar restaurante
                        </Text>
                    </TouchableHighlight>}
    
                    <NewItem dishesToUpdate={null} isUpdating={false} isVisible={newItemVisibility} itemId={null} itemToAdd="order" itemToUpdate={null} onClose={() => setNewItemVisibility(false)} restaurantId={restaurant_id} textForAddButton="AGREGAR" topText="Nueva orden" updateFetchedData={fetchAgain} userId={auth.userId} />
                    <NewItem dishesToUpdate={null} isUpdating={true} isVisible={updateRestaurantVisibility} itemId={restaurant_id} itemToAdd="restaurant" itemToUpdate={restaurantInfo} onClose={() => setUpdateRestaurantVisibility(false)} restaurantId={restaurant_id} textForAddButton="ACTUALIZAR" topText="Modificar restaurante" updateFetchedData={fetchAgain} userId={auth.userId} />
                    <ModalTemplate actionButtonBorder={tw.borderRed700} actionButtonColor={tw.bgRed700} animationForModal="fade" isVisible={isModalTemplateVisible} onClose={() => setIsModalTemplateVisible(false)} onTasksAfterAction={navigateAfterDeletingRestaurant} restaurantId={restaurant_id} textForButton={textForModalTemplateButton} textForModal={textForModalTemplate} underlayColor="#f00" userId={auth.userId} />
                    <ModalTemplate actionButtonBorder={tw.borderOrange400} actionButtonColor={tw.bgOrange400} animationForModal="fade" isVisible={isModalTemplateVisible} onClose={() => setIsModalTemplateVisible(false)} onTasksAfterAction={fetchAgain} restaurantId={restaurantIdToSendRequestTo} textForButton={textForModalTemplateButton} textForModal={textForModalTemplate} underlayColor="#fc5" userId={auth.userId} />
                </View>
            </ScrollView>
        )
    }
}