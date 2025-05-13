const express = require('express');
const fs = require("fs");
const router = express.Router();

const BLOGS_FILE = 'blogs.json';

router.get('/', function (req, res, next) {
    const email = req.session.user ? req.session.user.email : null;

    const data = fs.readFileSync(BLOGS_FILE)
    const blogs = JSON.parse(data);

    res.render('newsLetter', { email, blogs });
});

module.exports = router;
