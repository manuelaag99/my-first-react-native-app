import { isTextAnEmail, isTextAPassword, minLengthText, nonEmptyText } from "./CheckValidity";

export function inputReducer (state, action) {
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
        default:
            return state
    }
}

