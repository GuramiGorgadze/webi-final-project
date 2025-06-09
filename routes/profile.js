const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');
const User = require("../models/user");
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

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

    const userBlogs = await Blog.find({author: user.email });

    res.render('profile', {user, blogs: userBlogs});
});

router.post('/save', requireAuth, async function (req, res, next) {
    const { name, email } = req.body;
    const sessionUser = req.session.user;

    await User.updateOne({ id: sessionUser.id }, { name, email });

    const updatedUser = await User.findOne({ id: sessionUser.id });
    req.session.user = updatedUser;

    res.redirect('/profile');
});

router.post('/upload-picture', requireAuth, async function (req, res, next) {
    try {
        const sessionUser = req.session.user;
        const { image } = req.files;

        const uploadPath = path.join(__dirname, '..', 'public', 'uploads', `${sessionUser._id}_${image.name}`);

        await image.mv(uploadPath, async (err) => {
            if (err) {
                console.error(err);
            }

            const relativePath = `/uploads/${sessionUser._id}_${image.name}`;

            await User.updateOne({_id: sessionUser._id}, {profilePicture: relativePath});

            const updatedUser = await User.findOne({_id: sessionUser._id});
            req.session.user = updatedUser;

            res.redirect('/profile');
        });
    } catch(err) {
        console.log(err)
    }
});

module.exports = router;
