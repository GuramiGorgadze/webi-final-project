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

    res.render('profile', {user, blogs: userBlogs, error: null });
});

router.post('/', requireAuth, async function (req, res, next) {
    const { name, email } = req.body;
    const sessionUser = req.session.user;
    const user = req.session.user;
    const userBlogs = await Blog.find({author: user.email });

    try {
        // Check for duplicate name (excludes this season user)
        const existingName = await User.findOne({ name, _id: { $ne: sessionUser._id } });
        if (existingName) {
            return res.render('profile', {user, blogs: userBlogs, error: 'Name is not available' })
        }

        // Check for duplicate email (excludes this season user)
        const existingEmail = await User.findOne({ email, _id: { $ne: sessionUser._id } });
        if (existingEmail) {
            return res.render('profile', {user, blogs: userBlogs, error: 'Email already exists'})
        }

        await User.updateOne({ _id: sessionUser._id }, { name, email });
        await Blog.updateMany({ author: user.email }, { $set: { author: email } });

        const updatedUser = await User.findOne({ _id: sessionUser._id });
        req.session.user = updatedUser;

        res.redirect('/profile');
    } catch (err) {
        console.log(err)
    }
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
