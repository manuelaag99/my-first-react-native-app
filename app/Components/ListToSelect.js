import { useEffect, useState } from "react";
import { TouchableHighlight, View } from "react-native";
import { supabase } from "../supabase/client";

export default function ListToSelect ({ listToDisplay, restaurantId }) {
    const [selectedValue, setSelectedValue] = useState();
    const [arrayOfValues, setArrayOfValues] = useState();

    async function fetchMenuItems () {
        try {
            const { data, error } = supabase.from("ALO-restaurant-menu-items").select().eq("restaurant_id", restaurantId);
            setArrayOfValues(data);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        // if (listToDisplay) setArrayOfValues(listToDisplay);
        fetchMenuItems();
    }, [])
    
    return (
        <View>
            {(arrayOfValues && arrayOfValues.map((value) => {
                return <TouchableHighlight onPress={() => setSelectedValue(value.menu_item)}>
                    <Text>
                        {value.menu_item}
                    </Text>
                </TouchableHighlight>
            }))}
        </View>
    )
}