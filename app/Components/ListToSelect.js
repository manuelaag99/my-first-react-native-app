import { useEffect, useState } from "react";
import { Text, TouchableHighlight, ScrollView, View, ActivityIndicator } from "react-native";
import { supabase } from "../supabase/client";
import { t, tw } from "react-native-tailwindcss";

export default function ListToSelect ({ onClose, restaurantId, searchQuery, sendSelectedValueFromList }) {
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
    
    useEffect(() => {
        fetchMenuItems();
    }, [])

    function selectValueHandle (value) {
        setSelectedValue(value.menu_item_name);
        sendSelectedValueFromList(value.menu_item_name);
    }
    
    if (!arrayOfValues) {
        return null
    } else if (arrayOfValues) {
        return (
            <View style={[[ t.flex, tw.wFull, t.absolute, t.z20, t.mT12, tw.h48, t.shadow2xl ], { position: "absolute" }]}>
                <ScrollView keyboardShouldPersistTaps={"handled"} style={[ t.flex, t.flexCol ]}>
                    {arrayOfValues && arrayOfValues.map((value, index) => {
                        return <TouchableHighlight key={index} onPress={() => selectValueHandle(value)} style={[ t.flex, t.flexCol, t.justifyCenter, tw.wFull, t.bgWhite, tw.h12, tw.pX4, t.pY1, t.borderY, t.borderGray300 ]} underlayColor="#ddd">
                            <Text style={[ tw.wFull, t.textBlack ]}>
                                {value.menu_item_name}    
                            </Text>
                        </TouchableHighlight>
                    })}
                </ScrollView>
                <TouchableHighlight onPress={() => onClose()} style={[ t.flex, t.flexCol, t.justifyCenter, tw.wFull, t.bgRed500, tw.h12, tw.pX4, t.pY1, t.borderRed500 ]} underlayColor="#bb4444">
                    <Text style={[ tw.wFull, t.textWhite ]}>
                        Cerrar lista
                    </Text>
                </TouchableHighlight>
            </View>
        )
    }
}