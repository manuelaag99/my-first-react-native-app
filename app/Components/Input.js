import { useEffect, useReducer, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { t, tailwind, tw } from "react-native-tailwindcss";
import MessageBox from "./MessageBox";
import { inputReducer } from "../Reducers";
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Input ({ autoCapitalize, errorMessage, field, individualInputAction, initialInputValue, instructionMessage, isPasswordField, placeholderText }) {
    const initialValues = { value: initialInputValue ? initialInputValue : "", isValid: false }
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
    useEffect(() => individualInputAction(initialInputValue, isValid, field), []);

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    console.log(initialInputValue)
    console.log(value)
    
    return (
        <>
            {isPasswordField && <View style={[ tw.w5_6, tw.mY2, tw.h12 ]}>
                <View style={[ tw.flex, tw.flexRow, tw.itemsCenter ]}>
                    <View style={[ tw.w4_5 ]}>
                        <TextInput autoCapitalize={autoCapitalize || "none"} autoComplete="off" onBlur={individualInputBlurHandler} onChangeText={(text) => individualInputChangeHandler(text)} onFocus={individualInputFocusHandler} placeholder={placeholderText} style={[[ tw.wFull, tw.pY2, tw.pX2, tw.hFull, tailwind.roundedLg]]} secureTextEntry={ ((field === "password") && !isPasswordVisible) ? true : false } value={value} />
                    </View>
                    <TouchableOpacity onPress={() => setIsPasswordVisible((prevValue) => !prevValue)} style={[ tw.w1_5, tw.justifyCenter, tw.itemsCenter ]}>
                        <Text>
                            {isPasswordVisible && <Icon name="eye" style={[ t.textBlack, tw.m0]} size={20} color="#000" />}
                            {!isPasswordVisible && <Icon name="eye-slash" style={[ t.textBlack, tw.m0]} size={20} color="#000" />}
                        </Text>
                    </TouchableOpacity>    
                </View>
                
                {(!individualInputState.isValid) && (individualInputState.isTouched) && (individualInputState.isActive) && <MessageBox isError={true} textForMessageBox={errorMessage} />}
                {(instructionMessage) && (!individualInputState.isTouched) && (individualInputState.isActive) && <MessageBox isError={false} textForMessageBox={instructionMessage} />}
            </View>}
            {!isPasswordField && <View style={[ tw.w5_6, tw.mY2, tw.h12 ]}>
                <TextInput autoCapitalize={autoCapitalize || "none"} autoComplete="off" onBlur={individualInputBlurHandler} onChangeText={(text) => individualInputChangeHandler(text)} onFocus={individualInputFocusHandler} placeholder={placeholderText} style={[[ tw.wFull, tw.pY2, tw.pX2, tw.hFull, tailwind.roundedLg]]} secureTextEntry={ (field === "password") ? true : false } value={value} />
                {(!individualInputState.isValid) && (individualInputState.isTouched) && (individualInputState.isActive) && <MessageBox isError={true} textForMessageBox={errorMessage} />}
                {(instructionMessage) && (!individualInputState.isTouched) && (individualInputState.isActive) && <MessageBox isError={false} textForMessageBox={instructionMessage} />}
            </View>}
        </>
    )
}