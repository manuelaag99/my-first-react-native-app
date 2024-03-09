import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { t, tw } from "react-native-tailwindcss";
import { supabase } from "../supabase/client";
import { AuthContext } from "../Context/AuthContext";
import ListItem from "../Components/ListItem";
import ErrorModal from "../Components/ErrorModal";
import ModalTemplate from "../Components/ModalTemplate";

export default function RestaurantTeamScreen ({ navigation, route }) {
    const auth = useContext(AuthContext);
    const [restaurantAdministratorsArray, setRestaurantAdministratorsArray] = useState();
    const [restaurantAdministratorsWithNamesArray, setRestaurantAdministratorsWithNamesArray] = useState();
    const [restaurantEmployeesArray, setRestaurantEmployeesArray] = useState();
    const [restaurantEmployeesWithNamesArray, setRestaurantEmployeesWithNamesArray] = useState();
    const [allUsers, setAllUsers] = useState();
    const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
    const [errorModalText, setErrorModalText] = useState();

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

    function fetchAgain () {
        fetchRestaurantTeam();
    }

    useEffect(() => {
        populateEmployeesAndAdministratorsArray();
    }, [allUsers])


    const [isModalTemplateVisible, setIsModalTemplateVisible] = useState(false);
    const [itemToSend, setItemToSend] = useState();
    const [textForModalTemplate, setTextForModalTemplate] = useState();
    const [textForModalTemplateButton, setTextForModalTemplateButton] = useState();

    function openModalToMakeEmployeeAnAdministrator (employee) {
        console.log(employee)
        setItemToSend(employee);
        setTextForModalTemplate("¿Quieres convertir a este empleado en administrador?");
        setTextForModalTemplateButton("Sí, convertir");
        setIsModalTemplateVisible(true)
    }
    function openModalToDeleteEmployee (employee) {
        setItemToSend(employee);
        setTextForModalTemplate("¿Quieres eliminar a este empleado?");
        setTextForModalTemplateButton("Si, eliminar")
        setIsModalTemplateVisible(true);
    }
    
    function openModalToMakeAdministratorAnEmployee (administrator) {
        if (restaurantAdministratorsWithNamesArray && (restaurantAdministratorsWithNamesArray.length > 1)) {
            setItemToSend(administrator);
            setTextForModalTemplate("¿Quieres convertir a este administrador en empleado?");
            setTextForModalTemplateButton("Sí, convertir");
            setIsModalTemplateVisible(true)
        } else {
            setErrorModalText("Un restaurante no puede quedarse sin administradores.");
            setIsErrorModalVisible(true);
        }
    }
    function openModalToDeleteAdmin (administrator) {
        if (restaurantAdministratorsWithNamesArray && (restaurantAdministratorsWithNamesArray.length > 1)) {
            setItemToSend(administrator);
            setTextForModalTemplate("¿Quieres eliminar a este administrador?");
            setTextForModalTemplateButton("Si, eliminar")
            setIsModalTemplateVisible(true);
        } else {
            setErrorModalText("Un restaurante no puede quedarse sin administradores.");
            setIsErrorModalVisible(true);
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
                            <ListItem buttonOne="clipboard" buttonOneAction={() => openModalToMakeAdministratorAnEmployee(administrator)} buttonTwo="ban" buttonTwoAction={() => openModalToDeleteAdmin(administrator)} iconSize={25} index={index} item={administrator} itemClassnames={[ tw.borderT, tw.borderGray400 ]} itemElementAction={() => console.log("yeah")} key={index} listName="admin users in 'restaurant team' screen" />
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
                            <ListItem buttonOne="clipboard" buttonOneAction={() => openModalToMakeEmployeeAnAdministrator(employee)} buttonTwo="ban" buttonTwoAction={() => openModalToDeleteEmployee(employee)} iconSize={25} index={index} item={employee} itemClassnames={[ tw.borderT, tw.borderGray400 ]} itemElementAction={() => console.log("yeah")} key={index} listName="employee users in 'restaurant team' screen" />
                        )
                    })}
                    {restaurantEmployeesWithNamesArray && (restaurantEmployeesWithNamesArray.length < 1) && <View style={[ tw.mY2 ]}>
                        <Text style={[ t.textCenter, t.textGray500 ]}>
                            No hay empleados en este restaurante.
                        </Text>
                    </View>}
                </View>
                <ErrorModal animationForModal="fade" onClose={() => setIsErrorModalVisible(false)} isVisible={isErrorModalVisible} onPressingRedButton={() => setIsErrorModalVisible(false)} textForButton="Aceptar" textForModal={errorModalText} />
                <ModalTemplate actionButtonBorder={tw.borderOrange400} actionButtonColor={tw.bgOrange400} animationForModal="fade" isVisible={isModalTemplateVisible} item={itemToSend} onClose={() => setIsModalTemplateVisible(false)} onTasksAfterAction={fetchAgain} restaurantId={null} textForButton={textForModalTemplateButton} textForModal={textForModalTemplate} underlayColor="#fc5" userId={auth.userId} />
            </ScrollView>
        )
    }
}