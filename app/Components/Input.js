import { useEffect, useReducer } from "react";
import { TextInput, View } from "react-native";
import { t, tailwind, tw } from "react-native-tailwindcss";
import { isTextAnEmail, isTextAPassword, minLengthText, nonEmptyText } from "../CheckValidity";
import MessageBox from "./MessageBox";

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
            case "focus":
                return {
                    ...state,
                    isActive: true,
                    isTouched: false
                };
            case "blur":
                return {
                    ...state,
                    isTouched: true
                };
        default:
            return state;
    }
}

export default function Input ({ errorMessage, field, individualInputAction, placeholderText }) {
    const initialValues = { value: "", isValid: true }
    const [individualInputState, dispatch] = useReducer(inputReducer, initialValues);
    const {value, isValid} = individualInputState;


    function individualInputBlurHandler () {
        dispatch({ type: "blur" })
    }

    function individualInputChangeHandler (text) {
        dispatch({ type: "change", value: text, field: field });
    }

    function individualInputFocusHandler () {
        dispatch({ type: "focus" })
    }

    useEffect(() => individualInputAction(value, isValid, field), [value, isValid, field]);

    return (
        <View style={[ tw.w5_6, tw.mY2, tw.h12 ]}>
            <TextInput onBlur={individualInputBlurHandler} onChangeText={(text) => individualInputChangeHandler(text)} onFocus={individualInputFocusHandler} placeholder={placeholderText} style={[[ tw.wFull, tw.pY2, tw.pX2, tw.hFull, tailwind.roundedLg]]} value={value} />
            {(!individualInputState.isValid) && (individualInputState.isTouched) && (individualInputState.isActive) && <MessageBox textForMessageBox={errorMessage} />}
        </View>
    )
}