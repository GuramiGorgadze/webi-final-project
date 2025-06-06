const express = require('express');
const Blog = require("../models/blog");
const router = express.Router();
const Subscriber = require('../models/Subscriber');

const requireAuth = (req, res, next) => {
    if (req.session.user) {
        next()
    } else {
        console.log('No user found.');
        res.redirect('/login');
    }
}

router.get('/', requireAuth, async function (req, res) {
    const user = req.session.user;
    const blogs = await Blog.find();
    blogs.reverse()

    res.render('newsletter', {user, blogs, message: null, success: null});
});

router.post('/add', requireAuth, async function (req, res) {
    const { email } = req.body;
    const blogs = await Blog.find();
    blogs.reverse();

    try {
        const isSubscribed = await Subscriber.findOne({ email });

        if (isSubscribed) {
            return res.render('newsletter', {
                user: req.session.user,
                blogs,
                message: 'You are already subscribed to the newsletter',
                success: false
            });
        }

        const newSubscriber = new Subscriber({ email });
        await newSubscriber.save();

        res.render('newsletter', {
            user: req.session.user,
            blogs,
            message: 'You have been successfully subscribed to the newsletter',
            success: true
        });
    } catch (err) {
        console.error(err);
        res.render('newsletter', {
            user: req.session.user,
            blogs,
            message: 'Please try again',
            success: false
        });
    }
});

module.exports = router;
