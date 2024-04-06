
module.exports.validator = require('validator');

function validatePassword(req, res, next) {
    const { password } = req.body;

    // Define the password criteria
    const minLength = 8;
    const minLowercase = 1;
    const minUppercase = 1;
    const minNumbers = 1;
    const minSymbols = 1;

    let errorMessage = '';

    // Check each criterion
    if (password.length < minLength) {
        errorMessage += `Password must be at least ${minLength} characters long. `;
    }
    if (!password.match(/[a-z]/) || password.match(/[a-z]/g).length < minLowercase) {
        errorMessage += `Password must contain at least ${minLowercase} lowercase letter. `;
    }
    if (!password.match(/[A-Z]/) || password.match(/[A-Z]/g).length < minUppercase) {
        errorMessage += `Password must contain at least ${minUppercase} uppercase letter. `;
    }
    if (!password.match(/[0-9]/) || password.match(/[0-9]/g).length < minNumbers) {
        errorMessage += `Password must contain at least ${minNumbers} number. `;
    }
    if (!password.match(/[\W_]/) || password.match(/[\W_]/g).length < minSymbols) {
        errorMessage += `Password must contain at least ${minSymbols} symbol. `;
    }

    // If any criteria were not met, flash the error message and redirect
    if (errorMessage) {
        req.flash('error', errorMessage.trim());
        return res.redirect('/register');
    }

    next();
}
