const express = require('express');
const router = express.Router();
const User = require("../models/user");
const bcrypt = require('bcrypt');

const requireAuth = (req, res, next) => {
    if (req.session.user) {
        next()
    } else {
        console.log('No user found.');
        res.redirect('/login');
    }
}

router.get('/', requireAuth, async function(req, res, next) {
    const user = req.session.user

    res.render('resetPassword', {user, error: null });
});

router.post('/', async function (req, res, next) {
    const { currentPass, newPass, confirmPass } = req.body;
    const sessionUser = req.session.user;

    if (!sessionUser) {
        return res.redirect('/login');
    }

    if (newPass !== confirmPass) {
        return res.render('resetPassword', { user: sessionUser, error: 'New passwords do not match' });
    }

    if (newPass.length < 8) {
        return res.render('resetPassword', { user: sessionUser, error: 'New password must be at least 8 characters long' });
    }

    try {
        const dbUser = await User.findById(sessionUser._id);
        if (!dbUser) {
            return res.render('resetPassword', { user: sessionUser, error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPass, dbUser.password);
        if (!isMatch) {
            return res.render('resetPassword', { user: sessionUser, error: 'Current password is incorrect' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPass, salt);

        dbUser.password = hashedNewPassword;
        await dbUser.save();

        res.redirect('/profile');
    } catch (err) {
        console.error(err);
        res.render('resetPassword', { user: sessionUser, error: 'Something went wrong. Please try again.' });
    }
});

module.exports = router;
