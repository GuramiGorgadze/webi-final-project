const express = require('express');
const Blog = require("../models/blog");
const router = express.Router();

const requireAuth = (req, res, next) => {
    if (req.session.user) {
        next()
    } else {
        console.log('No user found.');
        res.redirect('/login');
    }
}

router.get('/', requireAuth, async function (req, res) {
    const email = req.session.user.email;
    const blogs = await Blog.find();
    blogs.reverse()

    res.render('newsletter', {email, blogs});
});

module.exports = router;
