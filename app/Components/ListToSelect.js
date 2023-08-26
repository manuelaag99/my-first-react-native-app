import { useEffect, useRef, useState } from "react";
import { Text, TouchableHighlight, ScrollView, View, ActivityIndicator } from "react-native";
import { supabase } from "../supabase/client";
import { t, tailwind, tw } from "react-native-tailwindcss";

export default function ListToSelect ({ onClose, restaurantId, searchQuery, sendSelectedValueFromList }) {
    const [arrayOfValues, setArrayOfValues] = useState();
    const [listToDisplay, setListToDisplay] = useState();
    async function fetchMenuItems () {
        try {
            const { data, error } = await supabase.from("ALO-restaurant-menu-items").select("*").eq("restaurant_id", restaurantId);
            setArrayOfValues(data);
            setListToDisplay(data);
            if (error) console.log(error)
        } catch (err) {
            console.log(err);
        }
    }
    
    useEffect(() => {
        fetchMenuItems();
    }, [])

    useEffect(() => {
        if (searchQuery) {
            if (arrayOfValues) {
                setListToDisplay(arrayOfValues.filter((value) => value.menu_item_name.includes(searchQuery)));
            }
        } else {
            setListToDisplay(arrayOfValues);
        }
    }, [searchQuery])

    const [selectedValue, setSelectedValue] = useState();
    function selectValueHandle (value) {
        setSelectedValue(value.menu_item_name);
        sendSelectedValueFromList(value.menu_item_name);
    }

    if (!arrayOfValues) {
        return null;
    } else if (arrayOfValues) {
        return (
            <View style={[[ t.flex, tw.wFull, t.absolute, t.z20, t.mT12, tw.h40, tailwind.shadow2xl ]]}>
                {listToDisplay && (listToDisplay.length > 0) && <ScrollView keyboardShouldPersistTaps={"handled"} style={[[ t.flex, t.flexCol ], { flexGrow: 0 }]}>
                    {listToDisplay && listToDisplay.map((value, index) => {
                        return <TouchableHighlight key={index} onPress={() => selectValueHandle(value)} style={[ t.flex, t.flexCol, t.justifyCenter, tw.wFull, t.bgWhite, tw.h12, tw.pX4, t.pY1, t.borderY, t.borderGray300 ]} underlayColor="#ddd">
                            <Text style={[ tw.wFull, t.fontBold, t.textBlack ]}>
                                {value.menu_item_name}
                            </Text>
                        </TouchableHighlight>
                    })}
                </ScrollView>}
                {listToDisplay && (listToDisplay.length === 0) &&  <View style={[ t.flex, t.flexCol, t.justifyCenter, tw.wFull, t.bgWhite, tw.h12, tw.pX4, t.pY1, t.borderY, t.borderGray300 ]}>
                    <Text style={[ tw.wFull, t.textGray600 ]}>
                        No hay platillos que coincidan.
                    </Text>
                </View>}
                <TouchableHighlight onPress={() => onClose()} style={[ t.flex, t.flexCol, t.justifyCenter, tw.wFull, t.bgRed500, tw.h12, tw.pX4, t.pY1, t.borderRed500 ]} underlayColor="#bb4444">
                    <Text style={[ tw.wFull, t.textWhite, t.fontBold ]}>
                        Cerrar lista
                    </Text>
                </TouchableHighlight>
            </View>
        )
    }
}