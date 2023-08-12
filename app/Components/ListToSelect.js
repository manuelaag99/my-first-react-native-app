import { useEffect, useState } from "react";
import { TouchableHighlight, View } from "react-native";

export default function ListToSelect ({ listToDisplay }) {
    const [selectedValue, setSelectedValue] = useState();
    const [arrayOfValues, setArrayOfValues] = useState();

    useEffect(() => {
        if (listToDisplay) setArrayOfValues(listToDisplay);
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