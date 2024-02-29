import { ActivityIndicator, Text, View } from "react-native";
import { supabase } from "../supabase/client";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import ListItem from "../Components/ListItem";
import { t, tw } from "react-native-tailwindcss";

export default function DeleteUserAccountScreen ({ navigation, route }) {
    const auth = useContext(AuthContext);
    
    const [allUserAdmins, setAllUserAdmins] = useState();
    async function fetchAdmins () {
        try {
            const { data, error } = await supabase.from("ALO-admins").select("*").eq("user_id", auth.userId);
            if (error) console.log(error);
            setAllUserAdmins(data);
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        fetchAdmins();
    }, [])

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
    }

    if (!allUserAdmins) {
        return (
            <View>
                <ActivityIndicator style={[ tw.mT10]} size="large" color="#000" />
            </View>
        )
    } else {
        return (
            <View style={[ tw.flex, tw.flexCol, tw.mY3, tw.pX5 ]}>
                <View style={[ tw.mY6, tw.pX5, tw.flex, tw.justifyCenter, tw.itemsCenter ]}>
                        <Text style={[ t.textCenter ]}>
                            Mis restaurantes.
                        </Text>
                    </View>
                {allUserAdmins && (allUserAdmins.length > 0) && allUserAdmins.map((admin, index) => {
                    return (
                        <ListItem buttonOne={true} item={admin} index={index} itemClassnames={null} itemElementClassnames={[tw.w4_5, tw.pR5]} navigation={navigation} />
                    )
                })}
            </View>
        )
    }
}