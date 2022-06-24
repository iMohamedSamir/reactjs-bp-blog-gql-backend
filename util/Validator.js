export const validateRegisterInput = (
    username,
    email,
    password,
    confirmPassword) => {
    const errors = {};
    if (username.trim() === '') {
        errors.username = 'Username Can\'t be empty.';
    }
    if (email.trim() === '') {
        errors.email = 'Email Can\'t be empty.';
    } else {
        const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if (!email.match(regEx)) {
            errors.email = 'Not valid Email';
        }
    }
    if (password === '') {
        errors.password = 'Password Can\'t be empty';
    } else if (password !== confirmPassword) {
        errors.confirmPassword = 'Your password doesn\'t match!';
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}
export const validateLoginInput = (username, password) => {
    const errors = {};
    if (username.trim() === '') {
        errors.username = 'Username Can\'t be empty.';
    }
    if (password === '') {
        errors.password = 'Password Can\'t be empty.';
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}