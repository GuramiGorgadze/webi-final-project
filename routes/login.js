const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");

router.get('/', function (req, res, next) {
    if (req.session.user) {
        return res.redirect('/');
    }
    res.render('login', {error: null});
});

router.post('/', async function (req, res, next) {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.render('login', {error: 'Invalid email or password'});
        }
        req.session.user = {
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture
        };

        res.redirect(`/blogs`);
    } catch (err) {
        console.log(err);
    }
})

module.exports = router;
