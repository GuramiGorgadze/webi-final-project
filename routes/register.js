const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");


router.get('/', function (req, res, next) {
    if (req.session.user) {
        return res.redirect('/');
    }
    res.render('register', {error: null});
});

router.post('/', async function (req, res, next) {
    const {email, password, confirmPassword} = req.body;
    const name = email.split('@')[0];

    if (confirmPassword !== password) {
        return res.render('register',  {error: 'Passwords do not match'});
    }

    try {
        const users = await User.find({email})
        if (users.length > 0) {
            return res.render('register', {error: 'Email already registered'})
        }
        if (password.length < 8) {
            return res.render('register', {error: 'Password should contain 8 characters'});
        }
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const newUser = new User({name, email, password: hashedPassword});
        const savedUser = await newUser.save();

        req.session.user = {
            _id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email,
            profilePicture: savedUser.profilePicture
        };

        res.redirect('/blogs');
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;