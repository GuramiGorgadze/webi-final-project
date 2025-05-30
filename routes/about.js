const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
    const username = req.session.user ?  req.session.user.name : null;
    const profilePicture = req.session.user ?  req.session.user.profilePicture : null;

    res.render('about', { username, profilePicture })
});

module.exports = router;
