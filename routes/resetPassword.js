var express = require('express');
var router = express.Router();
const User = require("../models/user");

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
    const user = req.session.user

    if (newPass !== confirmPass) {
        return res.render('resetPassword', { user, error: 'New passwords do not match' });
    }

    if (newPass.length < 8) {
        return res.render('resetPassword', { user, error: 'New password must be at least 8 characters long' });
    }

    try {
        const User = await User.findById(req.session.user._id);
        const user = req.session.user

        const isMatch = bcrypt.compareSync(currentPass, User.password);
        if (!isMatch) {
            return res.render('resetPassword', { user, error: 'Current password is incorrect' });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedNewPassword = bcrypt.hashSync(newPass, salt);

        User.password = hashedNewPassword;
        await User.save();

        res.redirect('/profile');
    } catch (err) {
        console.log(err);
        res.render('resetPassword', { error: 'Something went wrong. Please try again.' });
    }
});

module.exports = router;
