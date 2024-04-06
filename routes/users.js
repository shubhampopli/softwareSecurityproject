const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../Utils/catchAsync');
const User = require('../models/user');
const Order=require("../models/order");
const bcrypt = require('bcryptjs');
const { isLoggedIn } = require('../middleware');


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


router.get('/register', (req, res) => {
    res.render('users/register');
});


router.post('/register', validatePassword, catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/products');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/products';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})
router.get('/logout', (req, res) => {
    req.logout(function (err) {
    // if (err) { return next(err); }
    req.flash('success', "Goodbye!");
    res.redirect('/products');
    });
    })


    router.get('/change-password',isLoggedIn, (req, res) => {
        res.render('users/change-password');
    })

// Route to render change password form
// Route to handle password update
router.post('/changepassword', function (req, res) { 
    User.findByUsername(req.body.username, (err, user) => { 
        if (err) { 
            res.send(err); 
        } else { 
            user.changePassword(req.body.oldpassword,  
            req.body.newpassword, function (err) { 
                if (err) { 
                    res.send(err); 
                } else { 
                    req.logout((err) => {
                        if (err) {
                            console.error('Logout error:', err);
                            req.flash('error', 'Could not log out. Please try again.');
                            return res.redirect('/logout'); // Redirect to a safe page
                        }
                        req.flash('success', 'Successfully updated the password! Please log in again.');
                        res.redirect('/login');
                    });  
                    
                } 
            }); 
        } 
    }); 
}); 












module.exports = router;