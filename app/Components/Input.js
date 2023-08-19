import { useReducer } from "react";
import { TextInput } from "react-native";
import { t, tw } from "react-native-tailwindcss";

function inputReducer (state, action) {
    switch (action.type) {
        case "change":
            return {
                ...state,
                value: action.value,
                isValid: true
            }
        default:
            return state;
    }
}

export default function Input ({ placeholderText }) {
    const [individualInputState, dispatch] = useReducer(inputReducer, { value: "", isValid: false });


    function individualInputChangeHandler (text) {
        console.log(text);
        dispatch({ type: "change", value: text });
    }
    console.log(individualInputState)

    return (
        <TextInput onChangeText={(text) => individualInputChangeHandler(text)} placeholder={placeholderText} style={[ tw.w5_6, tw.pY2, tw.pX2, tw.mY2, tw.h12 ]} />
    )
}