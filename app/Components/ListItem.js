import { useContext, useEffect, useState } from "react";
import { Text, TouchableHighlight, View } from "react-native";
import { supabase } from "../supabase/client";
import { t, tw } from "react-native-tailwindcss";
import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthContext } from "../Context/AuthContext";

export default function ListItem ({ buttonOne, buttonTwo, index, item, itemClassnames, itemElementClassnames, navigation }) {
    const auth = useContext(AuthContext);
    const [restaurantInfo, setRestaurantInfo] = useState();
    const [restaurantAdmins, setRestaurantAdmins] = useState();
    async function fetchRestaurantInfo () {
        try {
            const { data, error } = await supabase.from("ALO-restaurants").select("*").eq("restaurant_id", item.restaurant_id);
            if (error) console.log(error);
            setRestaurantInfo(data[0]);
        } catch (err) {
            console.log(err);
        }
    }
    async function fetchRestaurantAdmins () {
        try {
            const { data, error } = await supabase.from("ALO-admins").select("user_id").eq("restaurant_id", item.restaurant_id);
            if (error) console.log(error);
            setRestaurantAdmins(data);
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        fetchRestaurantAdmins();
        fetchRestaurantInfo();
    }, [])

    if (restaurantAdmins && restaurantInfo) {
        return (<View key={index} style={[[ tw.flex, tw.flexRow, tw.pY2, tw.wFull ], itemClassnames]}>
            <View style={[[ tw.flex, tw.flexCol ], itemElementClassnames]}>
                <Text style={[ tw.fontBold ]}>
                    {restaurantInfo.restaurant_name}
                </Text>
                {restaurantAdmins && (restaurantAdmins.length = 1) && <Text style={[ t.textGray600 ]}>
                    {restaurantAdmins.length} administrador, eres tú.
                </Text>}
                {restaurantAdmins && (restaurantAdmins.length = 1) && <Text style={[ t.textRed500 ]}>
                    Si no nombras a otro administrador, toda la información de este restaurante y lo asociado a él se eliminará permanentemente.
                </Text>}
                {restaurantAdmins && (restaurantAdmins.length > 1) && <Text style={[ t.textGray600 ]}>
                    {restaurantAdmins.length} administradores.
                </Text>}
                {restaurantAdmins && (restaurantAdmins.length > 1) && <Text style={[ t.textGreen500 ]}>
                    Si eliminas tu cuenta, aún existirá información de este restaurante porque hay al menos 1 administrador más.
                </Text>}
            </View>
            {buttonOne && <TouchableHighlight onPress={() => navigation.navigate("Restaurant", { restaurant_id: restaurantInfo.restaurant_id, user_id: auth.userId })} underlayColor="#ccc" style={[ tw.w1_5, tw.itemsCenter, tw.justifyCenter ]}>
                <Text style={[ t.textBlack ]}>
                    <Icon name="facebook" size={25} />
                </Text>
            </TouchableHighlight>}
        </View>)
    }
}