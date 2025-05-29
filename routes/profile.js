const express = require('express');
const router = express.Router();

const requireAuth = (req, res, next) => {
    if (req.session.user) {
        next()
    } else {
        console.log('No user found.');
        res.redirect('/login');
    }
}

router.get('/', requireAuth, async function (req, res, next) {
    const user = req.session.user

    console.log(user)

    res.render('profile', {user});
});

module.exports = router;
