import { useEffect, useState } from "react";
import { Text, TouchableHighlight, View } from "react-native";
import { supabase } from "../supabase/client";
import { t, tw } from "react-native-tailwindcss";

export default function ListToSelect ({ listToDisplay, restaurantId, searchQuery }) {
    const [selectedValue, setSelectedValue] = useState();
    const [arrayOfValues, setArrayOfValues] = useState();

    async function fetchMenuItems () {
        try {
            const { data, error } = await supabase.from("ALO-restaurant-menu-items").select("*").eq("restaurant_id", restaurantId);
            setArrayOfValues(data);
            if (error) console.log(error)
        } catch (err) {
            console.log(err);
        }
    }
    console.log(arrayOfValues)

    useEffect(() => {
        // if (listToDisplay) setArrayOfValues(listToDisplay);
        fetchMenuItems();
    }, [])
    
    return (
        <View style={[[ t.flex, tw.wFull, tw.h14, t.absolute, t.z20, t.mT12 ], { position: "absolute" }]}>
            {(arrayOfValues ? arrayOfValues.map((value, index) => {
                return <TouchableHighlight key={index} onPress={() => setSelectedValue(value.menu_item)} style={[ t.flex, t.flexCol, t.justifyCenter, tw.wFull, t.bgWhite, tw.h12, tw.pX4, t.pY1, t.borderY, t.borderGray300 ]} underlayColor="#ddd">
                    <Text style={[ tw.wFull, t.textBlack ]}>
                        {value.menu_item_name}
                    </Text>
                </TouchableHighlight>
                {/* if (value.menu_item.includes(searchQuery)) {
                    return <TouchableHighlight onPress={() => setSelectedValue(value.menu_item)}>
                        <Text>
                            {value.menu_item}
                        </Text>
                    </TouchableHighlight>
                } */}
            }) : null)}
        </View>
    )
}