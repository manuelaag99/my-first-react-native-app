import { doesTextHaveNoSpaces, isTextAnEmail, isTextAPassword, isTextAUsername, minLengthText, nonEmptyText } from "./CheckValidity";

export function inputReducer (state, action) {
    switch (action.type) {
        case "change":
            let checkValidity;
            if (action.field === "email") {
                checkValidity = isTextAnEmail(action.value) && doesTextHaveNoSpaces(action.value);
            } else if (action.field === "username") {
                checkValidity =isTextAUsername(action.value, 6) && doesTextHaveNoSpaces(action.value);
            } else if (action.field === "password") {
                checkValidity = isTextAPassword(action.value) && doesTextHaveNoSpaces(action.value);
            } else {
                checkValidity = nonEmptyText(action.value);
            }
            return {
                ...state,
                value: action.value,
                isValid: checkValidity
            };
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

export function formReducer (state, action) {
    switch (action.type) {
        case "form change":
            let formIsValid = true
            for (const specificInput in state.inputs) {
                if (specificInput === action.field) {
                    formIsValid = formIsValid && action.isValid
                } else {
                    formIsValid = formIsValid && state.inputs[specificInput].isValid
                }
            }
            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    [action.field]: { value: action.value, isValid: action.isValid }
                },
                isFormValid: formIsValid
            }
        case "switch to sign in":
            return {
                inputs: {
                    email: { value: action.state.inputs.email.value, isValid: action.state.inputs.email.isValid },
                    password: { value: action.state.inputs.password.value, isValid: action.state.inputs.password.isValid }
                },
                isFormValid: action.state.inputs.email.isValid && action.state.inputs.password.isValid
            };
        case "switch to sign up":
            return {
                inputs: {
                    email: { value: action.state.inputs.email.value, isValid: action.state.inputs.email.isValid },
                    password: { value: action.state.inputs.password.value, isValid: action.state.inputs.password.isValid },
                    displayName: { value: "", isValid: false },
                    username: { value: "", isValid: false }
                },
                isFormValid: false
            };
        case "fill with existing info":
            console.log(action.existingInfo)
            return {
                inputs: {
                    email: { value: action.existingInfo.user_email, isValid: true },
                    password: { value: action.existingInfo.user_password, isValid: true },
                    displayName: { value: action.existingInfo.user_display_name, isValid: true },
                    username: { value: action.existingInfo.user_username, isValid: true }
                },
                isFormValid: true
            };
        default:
            return state
    }
}

