import { useCallback, useReducer } from "react";
import { formReducer } from "./Reducers";

export const useForm = (initialFormState) => {
    const [stateOfForm, dispatch] = useReducer(formReducer, initialFormState);

    const formHandler = useCallback((value, isValid, field) => {
        dispatch({ type: "form change", value: value, field: field , isValid: isValid });
    }, [dispatch]);

    const formSwitcher = useCallback((form) => {
        dispatch({ type: form });
    }, [dispatch])

    return [ stateOfForm, formHandler, formSwitcher ];
}