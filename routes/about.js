const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
    const user = req.session.user ?  req.session.user : null;

    res.render('about', { user })
});

module.exports = router;
