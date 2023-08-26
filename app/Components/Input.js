import { useEffect, useReducer } from "react";
import { TextInput, View } from "react-native";
import { t, tailwind, tw } from "react-native-tailwindcss";
import MessageBox from "./MessageBox";
import { inputReducer } from "../Reducers";

export default function Input ({ autoCapitalize, errorMessage, field, individualInputAction, instructionMessage, placeholderText }) {
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
            <TextInput autoCapitalize={autoCapitalize || "none"} autoComplete="off" onBlur={individualInputBlurHandler} onChangeText={(text) => individualInputChangeHandler(text)} onFocus={individualInputFocusHandler} placeholder={placeholderText} style={[[ tw.wFull, tw.pY2, tw.pX2, tw.hFull, tailwind.roundedLg]]} secureTextEntry={ (field === "password") ? true : false } value={value} />
            {(!individualInputState.isValid) && (individualInputState.isTouched) && (individualInputState.isActive) && <MessageBox isError={true} textForMessageBox={errorMessage} />}
            {(instructionMessage) && (!individualInputState.isTouched) && (individualInputState.isActive) && <MessageBox isError={false} textForMessageBox={instructionMessage} />}
        </View>
    )
}