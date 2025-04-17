var express = require('express');
var router = express.Router();

const USER = {
    username: 'admin',
    password: '1234'
};


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login', { title: 'Login' });
});

router.post('/login', function(req, res, next) {
    const { username, password } = req.body;

    if (username === USER.username && password === USER.password) {
        req.session.user = { username };
        return res.redirect('/');
    } else {
        res.render('login', { title: 'Login Page', error: 'Invalid credentials' });
    }
});

module.exports = router;
