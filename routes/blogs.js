const express = require('express');
const router = express.Router();
const fs = require('fs');
const Blog = require('../models/blog');

const BLOGS_FILE = 'blogs.json';

const requireAuth = (req, res, next) => {
    if (req.session.user) {
        next()
    } else {
        console.log('No user found.');
        res.redirect('/login');
    }
}

router.get('/', requireAuth, async function (req, res, next) {
    const blogs = await Blog.find({});
    blogs.reverse()

    const email = req.session.user.email;

    res.render('blogs', {blogs, email});
});

router.get('/new', requireAuth, function (req, res, next) {
    const email = req.session.user.email;
    res.render('new_blog', {error: null, email});
});

router.post('/new', requireAuth, async function (req, res, next) {
    const {title, description, content} = req.body;

    if (!title || !content) {
        res.render("new_blog", {error: "Missing title or content"});
    }

    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ];
    const currentMonthString = months[currentMonth];
    const formatedDate = `${currentDay} ${currentMonthString} ${currentYear}`;
    const newBlogData = {
        id: String(Date.now()),
        title,
        description,
        content,
        author: req.session.user.email,
        date: new Date().toLocaleString(),
        formatedDate
    }

    try {
        const newBlog = new Blog(newBlogData);
        await newBlog.save();
        res.redirect('/blogs');
    } catch (err) {
        console.log(err);
    }
});

router.get('/:blogId', requireAuth, async function (req, res, next) {
    const email = req.session.user.email;
    const {blogId} = req.params

    try {
        const blogs = await Blog.find();
        blogs.reverse()
        const blog = await Blog.findOne({id: blogId});
        res.render('blog', {email, blogs, blog});
    } catch (err) {
        console.log(err);
    }
});

router.post('/:blogId/newComment', requireAuth, async function (req, res, next) {
    const {blogId} = req.params
    const {newComment} = req.body;

    try {
        const comment = {
            id: String(Date.now()),
            content: newComment,
            author: req.session.user.email,
            replies: []
        }

        const res = await Blog.updateOne({id: blogId}, {$push: {comments: comment}});


    } catch(err) {
        console.log(err);
    }

    res.redirect(`/blogs/${blogId}`);
});

router.post('/:blogId/:commentId/newReply', requireAuth, async (req, res) => {
    const { blogId, commentId } = req.params;
    const { newReply } = req.body;

    const reply = {
        content: newReply,
        author: req.session.user.email,
        date: new Date()
    };

    try {
        await Blog.updateOne(
            { id: blogId, "comments.id": commentId },
            { $push: { "comments.$.replies": reply } }
        );

        res.redirect(`/blogs/${blogId}`);
    } catch (err) {
        console.error(err);
    }
});

router.post('/:blogId/:commentId/like', requireAuth, async (req, res) => {
    const { blogId, commentId } = req.params;
    const email = req.session.user.email;

    try {
        const blog = await Blog.findOne({ id: blogId });
        const comment = blog.comments.find(c => c.id === commentId);

        const alreadyLiked = comment.likes.includes(email);

        const update = alreadyLiked
            ? { $pull: { 'comments.$.likes': email } }
            : { $push: { 'comments.$.likes': email } }; 

        await Blog.updateOne(
            { id: blogId, 'comments.id': commentId },
            update
        );
        
        res.redirect(`/blogs/${blogId}`);
    } catch (err) {
        console.error(err);
        res.redirect(`/blogs/${blogId}`);
    }
});

router.post('/:blogId/:commentId/:replyId/like', requireAuth, async (req, res) => {
    const { blogId, commentId, replyId } = req.params;
    const email = req.session.user.email;

    try {
        const blog = await Blog.findOne({ id: blogId });
        const comment = blog.comments.find(c => c.id === commentId);
        const reply = comment.replies.find(r => r.id === replyId);


        const alreadyLiked = comment.likes.includes(email);

        const update = alreadyLiked
            ? { $pull: { 'replies.$.likes': email } }
            : { $push: { 'replies.$.likes': email } };

        await Blog.updateOne(
            { id: blogId, 'replies.id': replyId },
            update
        );

        res.redirect(`/blogs/${blogId}`);
    } catch (err) {
        console.error(err);
        res.redirect(`/blogs/${blogId}`);
    }
});

module.exports = router;
