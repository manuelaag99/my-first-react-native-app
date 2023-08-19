import { useReducer } from "react";
import { TextInput } from "react-native";
import { t, tw } from "react-native-tailwindcss";
import { isTextAnEmail, isTextAPassword, minLengthText, nonEmptyText } from "../CheckValidity";

function inputReducer (state, action) {
    switch (action.type) {
        case "change":
            let checkValidity;
            if (action.field === "email") {
                checkValidity = isTextAnEmail(action.value);
            } else if (action.field === "username") {
                checkValidity = minLengthText(action.value, 6);
            } else if (action.field === "password") {
                checkValidity = isTextAPassword(action.value);
            } else {
                checkValidity = nonEmptyText(action.value);
            }
            return {
                ...state,
                value: action.value,
                isValid: checkValidity
            }
        default:
            return state;
    }
}

export default function Input ({ field, placeholderText }) {
    const [individualInputState, dispatch] = useReducer(inputReducer, { value: "", isValid: false });

    function individualInputChangeHandler (text) {
        dispatch({ type: "change", value: text, field: field });
    }

    return (
        <TextInput value={individualInputState.value} onChangeText={(text) => individualInputChangeHandler(text)} placeholder={placeholderText} style={[ tw.w5_6, tw.pY2, tw.pX2, tw.mY2, tw.h12 ]} />
    )
}