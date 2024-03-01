import { useContext, useEffect, useState } from "react";
import { Text, TouchableHighlight, View } from "react-native";
import { supabase } from "../supabase/client";
import { t, tw } from "react-native-tailwindcss";
import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthContext } from "../Context/AuthContext";

export default function ListItem ({ buttonOne, buttonOneAction, buttonOneClassnames, buttonTwo, buttonTwoAction, buttonTwoClassnames, index, item, itemClassnames, itemElementClassnames, listName, navigation }) {
    const auth = useContext(AuthContext);
    const [firstText, setFirstText] = useState({ content: "", style: "" });
    const [secondText, setSecondText] = useState({ content: "", style: "" });
    const [thirdText, setThirdText] = useState({ content: "", style: "" });

    // this section is for the list of restaurants for deleting user account 
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
        if (listName === "restaurants in 'delete user account' screen") {
            fetchRestaurantAdmins();
            fetchRestaurantInfo();
        }
    }, [])

    useEffect(() => {
        if (restaurantAdmins && restaurantInfo) {
            setFirstText({ content: restaurantInfo.restaurant_name, style: [  t.textLeft, t.fontBold, t.textBlack ]});
            restaurantAdmins && (restaurantAdmins.length = 1) && setSecondText({ content: restaurantAdmins.length + " administrador, eres tú.", style: [ t.textLeft, t.fontNormal, t.textGray600 ]});
            restaurantAdmins && (restaurantAdmins.length > 1) && setSecondText({ content: restaurantAdmins.length + " administradores.", style: [ t.textLeft, t.fontNormal, t.textGray600 ]});
            restaurantAdmins && (restaurantAdmins.length = 1) && setThirdText({ content: "Si no nombras a otro administrador, toda la información de este restaurante y lo asociado a él se eliminará permanentemente.", style: [t.textRed500] });
            restaurantAdmins && (restaurantAdmins.length > 1) && setThirdText({ content: "Si eliminas tu cuenta, aún existirá información de este restaurante porque hay al menos 1 administrador más.", style: [t.textGreen500] });
        }
    }, [restaurantAdmins, restaurantInfo])


    if (restaurantAdmins && restaurantInfo) {
        return (<View key={index} style={[[ tw.flex, tw.flexRow, tw.pY2, tw.wFull ], itemClassnames]}>
            <View style={[[ tw.flex, tw.flexCol ], itemElementClassnames]}>
                <Text style={ firstText.style }>{firstText.content}</Text>
                <Text style={ secondText.style }>{secondText.content}</Text>
                <Text style={ thirdText.style }>{thirdText.content}</Text>
            </View>
            {buttonOne && <TouchableHighlight onPress={buttonOneAction} underlayColor="#ccc" style={[[ tw.itemsCenter, tw.justifyCenter ], buttonOneClassnames ]}>
                <Text style={[ t.textBlack ]}><Icon name={buttonOne} size={25} /></Text>
            </TouchableHighlight>}
            {buttonTwo && <TouchableHighlight onPress={buttonTwoAction} underlayColor="#ccc" style={[[ tw.itemsCenter, tw.justifyCenter ], buttonTwoClassnames ]}>
                <Text style={[ t.textBlack ]}><Icon name={buttonTwo} size={25} /></Text>
            </TouchableHighlight>}
        </View>)
    }
}