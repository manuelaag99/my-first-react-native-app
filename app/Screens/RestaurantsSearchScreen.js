import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableHighlight, View } from "react-native";
import { t, tw } from "react-native-tailwindcss";
import { Icon } from "react-native-vector-icons/Icon";
import { supabase } from "../supabase/client";

export default function RestaurantsSearchScreen () {
    const [searchQuery, setSearchQuery] = useState();
    const [allRestaurantsArray, setAllRestaurantsArray] = useState();

    async function fetchAllRestaurants () {
        try {
            const { data, error } = supabase.from("ALO-restaurants").select("*");
            if (error) console.log(error);
            setAllRestaurantsArray(data);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchAllRestaurants();
    }, [])
    
    if (!allRestaurantsArray) {
        return <ActivityIndicator style={[ tw.mT10]} size="large" color="#000" />
    } else if (allRestaurantsArray) {
        return (
            <ScrollView>
                    <View style={[ t.flex, t.flexCol, tw.mY2, tw.pX6, tw.wFull ]}>
                        <View style={[ t.flex, t.flexRow, t.justifyCenter, t.itemsCenter, tw.wFull, tw.pX2, tw.pY1]}>
                            <TextInput style={[ tw.w4_5 ]} value={searchQuery} />
                            <TouchableHighlight style={[ t.flex, t.justifyCenter, t.itemsCenter, tw.w1_5 ]}>
                                <Icon name="magnifying-glass" size={25} />
                            </TouchableHighlight>
                        </View>
    
                        {!searchQuery && <View>
                            <Text style={[ t.textGray500, t.textCenter ]}>
                                Escribe un nombre para buscar un restaurante.
                            </Text>
                        </View>}
                        {restaurantEmployeesWithNamesArray.map((employee, index) => {
                            return (
                                <View key={index} style={[ t.flex, t.flexRow, tw.wFull, tw.pX1, t.borderT, t.borderGray400 ]}>
                                    <View style={[ t.flex, t.flexCol, tw.w4_6, tw.pY2 ]}>
                                        <View style={[ t.flex, t.flexRow, tw.wFull ]}>
                                            <Text style={[ tw.h6, t.textLeft, t.textBlack, t.fontBold ]}>{employee.employee_name}</Text>
                                        </View>
                                        <View style={[ t.flex, t.flexRow, tw.wFull ]}>
                                            <Text style={[ tw.h6, t.textLeft, t.textGray600, t.italic ]}>Empleado</Text>
                                            {employee.employee_position && <Text style={[ tw.h6, t.textLeft, t.textGray600, t.italic ]}> ({employee.employee_position})</Text>}
                                        </View>
                                    </View>
                                    <TouchableHighlight onPress={() => console.log("delete")} style={[ t.flex, t.justifyCenter, t.itemsCenter, tw.w1_6]} underlayColor="#99f">
                                        <Icon name="clipboard" size={25} />
                                    </TouchableHighlight>
                                    <TouchableHighlight onPress={() => console.log("delete")} style={[ t.flex, t.justifyCenter, t.itemsCenter, tw.w1_6]} underlayColor="#f99">
                                        <Icon name="user" size={25} />
                                    </TouchableHighlight>
                                </View>
                            )
                        })}
                    </View>
            </ScrollView>
        )
    }
    
}