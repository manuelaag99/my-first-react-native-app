
export function nonEmptyText (value) {
    if (value === "") {
        return false
    } else {
        return true
    }
}

export function minLengthText (value, requiredLength) {
    if (value.length < requiredLength) {
        return false
    } else {
        return true
    }
}

export function areBothTextsTheSame (textOne, textTwo) {
    if (textOne === textTwo) {
        return true
    } else {
        return false
    }
}

export function isTextAnEmail (value) {
    if (value.includes("@")) {
        return true
    } else {
        return false
    }
}

export function isTextAUsername (value, requiredLength) {
    if (value.length > requiredLength) {
        if (value.includes(" ")) {
            return false
        } else {
            return true
        }
    } else {
        return false
    }    
}

export function doesTextHaveNoSpaces (value) {
    if (value.includes(" ")) {
        return false;
    } else {
        return true;
    }
}

export function isTextAPassword (value) {
    const specialChars = `/[!@#$%^&*()_+\-=\[\]{};':"|,.<>\/?]+/;`;
    const doesItHaveSpecialCharacters = specialChars.split("").some(character => value.includes(character));
    const numbers = '1234567890';
    const doesItHaveNumbers = numbers.split("").some(character => value.includes(character));
    if (doesItHaveSpecialCharacters) {
        if (value.length > 9) {
            if (value !== value.toLowerCase()) {
                if (value !== value.toUpperCase()) {
                    if (doesItHaveNumbers) {
                        return true
                    } else {
                        return false
                    }
                } else {
                    return false
                }
            } else {
                return false
            }        
        } else {
            return false
        }
    } else {
        return false
    }
}