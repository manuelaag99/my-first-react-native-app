import { View } from "react-native";
import { supabase } from "../supabase/client";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

export default function DeleteUserAccountScreen () {
    const auth = useContext(AuthContext);

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

    return (
        <View>

        </View>
    )
}