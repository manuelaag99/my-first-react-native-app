import { Modal, Text, TouchableHighlight, View } from "react-native";
import { t, tailwind, tw } from "react-native-tailwindcss";
import { supabase } from "../supabase/client";
import { v4 as uuidv4 } from "uuid";

export default function ModalTemplate ({ actionButtonBorder, actionButtonColor, animationForModal, isVisible, item, onClose, onTasksAfterAction, orderToDelete, restaurantId, textForButton, textForModal, underlayColor, userId }) {

    let request_id;
    async function sendRequest () {
        request_id = uuidv4();
        try {
            const { data, error } = await supabase.from("ALO-requests").insert({ user_id: userId, restaurant_id: restaurantId, request_id: request_id, request_status: "pending" });
            if (error) console.log(error)
            onClose();
            onTasksAfterAction();
        } catch (err) {
            console.log(err);
        }
    }

    async function deleteRestaurant () {
        try {
            const { error } = await supabase.from("ALO-restaurants").delete().eq("restaurant_id", restaurantId);
            if (error) console.log(error);
            onClose();
            onTasksAfterAction();
        } catch (err) {
            console.log(err);
        }
        try {
            const { error } = await supabase.from("ALO-admins").delete().eq("restaurant_id", restaurantId);
            if (error) console.log(error);
            onClose();
            onTasksAfterAction();
        } catch (err) {
            console.log(err);
        }
        try {
            const { error } = await supabase.from("ALO-employees").delete().eq("restaurant_id", restaurantId);
            if (error) console.log(error);
            onClose();
            onTasksAfterAction();
        } catch (err) {
            console.log(err);
        }
        try {
            const { error } = await supabase.from("ALO-requests").delete().eq("restaurant_id", restaurantId);
            if (error) console.log(error);
            onClose();
            onTasksAfterAction();
        } catch (err) {
            console.log(err);
        }
        try {
            const { error } = await supabase.from("ALO-restaurant-orders").delete().eq("restaurant_id", restaurantId);
            if (error) console.log(error);
            onClose();
            onTasksAfterAction();
        } catch (err) {
            console.log(err);
        }
        try {
            const { error } = await supabase.from("ALO-restaurant-menu-items").delete().eq("restaurant_id", restaurantId);
            if (error) console.log(error);
            onClose();
            onTasksAfterAction();
        } catch (err) {
            console.log(err);
        }
        try {
            const { error } = await supabase.from("ALO-orders-dishes").delete().eq("restaurant_id", restaurantId);
            if (error) console.log(error);
            onClose();
            onTasksAfterAction();
        } catch (err) {
            console.log(err);
        }
    }

    async function deleteMenu () {
        try {
            const { data, error } = await supabase.from("ALO-restaurant-menu-items").delete("*").eq("restaurant_id", restaurantId);
            if (error) console.log(error)
            onClose();
            onTasksAfterAction();
        } catch (err) {
            console.log(err)
        }
    }

    async function clearDishesData () {
        try {
            const { error } = await supabase.from("ALO-orders-dishes").delete("*").eq("restaurant_id", restaurantId);
            if (error) console.log(error);
        } catch (err) {
            console.log(err);
        }
    }

    async function clearOrdersData () {
        try {
            const { error } = await supabase.from("ALO-restaurant-orders").delete("*").eq("restaurant_id", restaurantId);
            if (error) console.log(error);
            onClose();
            onTasksAfterAction();
        } catch (err) {
            console.log(err);
        }
    }

    async function deleteSpecificOrder () {
        try {
            const { error } = await supabase.from("ALO-orders-dishes").delete("*").eq("order_id", orderToDelete.order_id);
            if (error) console.log(error);
        } catch (err) {
            console.log(err);
        }
        try {
            const { error } = await supabase.from("ALO-restaurant-orders").delete("*").eq("order_id", orderToDelete.order_id);
            if (error) console.log(error);
            onClose();
            onTasksAfterAction();
        } catch (err) {
            console.log(err);
        }
    }

    let newAdminId;
    async function makeEmployeeAnAdministrator () {
        newAdminId = uuidv4();
        try {
            const { error } = await supabase.from("ALO-admins").insert({ administrator_id: newAdminId, restaurant_id: item.restaurant_id, user_id: item.user_id });
            if (error) console.log(error);
        } catch (err) {
            console.log(err);
        }
        try {
            const { error } = await supabase.from("ALO-employees").delete().eq("user_id", item.user_id).eq("restaurant_id", item.restaurant_id);
            if (error) console.log(error);
            onClose();
            onTasksAfterAction();
        } catch (err) {
            console.log(err);
        }
    }
    async function deleteEmployee () {
        try {
            const { error } = await supabase.from("ALO-employees").delete().eq("user_id", item.user_id).eq("restaurant_id", item.restaurant_id);
            if (error) console.log(error);
            onClose();
            onTasksAfterAction();
        } catch {
            console.log(err);
        }
    }

    let newEmployeeId;
    async function makeAdministratorAnEmployee () {
        newEmployeeId = uuidv4();
        try {
            const { error } = await supabase.from("ALO-employees").insert({ employee_id: newEmployeeId, restaurant_id: item.restaurant_id, user_id: item.user_id });
            if (error) console.log(error);
        } catch (err) {
            console.log(err);
        }
        try {
            const { error } = await supabase.from("ALO-admins").delete().eq("user_id", item.user_id).eq("restaurant_id", item.restaurant_id);
            if (error) console.log(error);
            onClose();
            onTasksAfterAction();
        } catch (err) {
            console.log(err);
        }
    }
    async function deleteAdmin () {
        try {
            const { error } = await supabase.from("ALO-admins").delete().eq("user_id", item.user_id).eq("restaurant_id", item.restaurant_id);
            if (error) console.log(error);
            onClose();
            onTasksAfterAction();
        } catch {
            console.log(err);
        }
    }

    function actionButtonHandle () {
        if (textForModal === "¿Quieres solicitar unirte a este restaurante?") {
            sendRequest();
        } else if (textForModal === "¿Quieres eliminar este restaurante? Esto es permanente y borrará todo el menu, todas las ordenes, todos los empleados y administradores, y las solicitudes.") {
            deleteRestaurant();
        } else if (textForModal === "¿Quieres borrar el menú? Esto es permanente.") {
            deleteMenu();
        } else if (textForModal === "¿Quieres borrar la lista de órdenes? Esto es permanente.") {
            clearDishesData();
            clearOrdersData();
        } else if (textForModal === "¿Quieres borrar esta orden? Esto es permanente.") {
            deleteSpecificOrder();
        } else if (textForModal === "¿Quieres eliminar tu cuenta? Esto es permanente.") {
            console.log("delete account")
        } else if (textForModal === "¿Quieres eliminar a este administrador?") {
            deleteAdmin();
        } else if (textForModal === "¿Quieres eliminar a este empleado?") {
            deleteEmployee();
        } else if (textForModal === "¿Quieres convertir a este empleado en administrador?") {
            makeEmployeeAnAdministrator();
        } else if (textForModal === "¿Quieres convertir a este administrador en empleado?") {
            makeAdministratorAnEmployee();
        }
    }

    return (
        <Modal animationType={animationForModal || "fade"} onRequestClose={onClose} transparent={true} visible={isVisible}>
            <View style={[[ t.flex, t.flexCol, tw.justifyCenter, tw.pX6, tw.wFull, tw.hFull ], { backgroundColor: "#00000075"}]}>
                <View style={[ t.flex, t.flexCol, tw.h50, tw.wFull, tw.bgWhite, tw.border, tw.borderGray300, tw.pT4, tw.pB8, tailwind.roundedLg, t.shadow2xl ]}>
                    <View style={[ t.flex, t.flexCol, tw.wFull, tw.hAuto, tw.justifyCenter ]}>
                        <Text style={[ t.textCenter, tw.pX4, tw.wFull, t.flex, t.flexCol, tw.justifyCenter ]}>
                            {textForModal}
                        </Text>
                    </View>
                    <View style={[ t.flex, t.flexRow, tw.wFull, tw.h12, tw.justifyAround, tw.mT4 ]}>
                        <TouchableHighlight underlayColor={underlayColor || "#ff6666"} style={[ tw.w1_3, t.flex, t.flexCol, tw.justifyCenter, tw.border, tailwind.roundedLg, actionButtonColor, actionButtonBorder ]} onPress={actionButtonHandle}>
                            <Text style={[ t.textCenter, t.fontBold, t.textWhite ]}>{textForButton}</Text>
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor="#ccc" style={[ tw.w1_3, t.flex, t.flexCol, tw.justifyCenter, tw.border, tw.borderGray200, tailwind.roundedLg ]} onPress={onClose}>
                            <Text style={[ t.textCenter, t.fontBold ]}>Cancelar</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        </Modal>
    )
}