const express = require('express');
const router = express.Router();
const User = require("../models/user");
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');

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

router.post('/save', requireAuth, async function (req, res, next) {
    const { name, email } = req.body;
    const sessionUser = req.session.user;

    await User.updateOne({ id: sessionUser.id }, { name, email });

    const updatedUser = await User.findOne({ id: sessionUser.id });
    req.session.user = updatedUser;

    res.redirect('/profile');
});

router.post('/upload-picture', requireAuth, async function (req, res, next) {
    const sessionUser = req.session.user;

    const { image } = req.files;

    const uploadPath = path.join(__dirname, '..', 'public', 'uploads', `${sessionUser.id}_${image.name}`);

    await image.mv(uploadPath, async (err) => {
        if (err) {
            console.error(err);
        }

        const relativePath = `/uploads/${sessionUser.id}_${image.name}`;

        await User.updateOne({id: sessionUser.id}, {profilePicture: relativePath});

        const updatedUser = await User.findOne({id: sessionUser.id});
        req.session.user = updatedUser;

        res.redirect('/profile');
    });
});

module.exports = router;
