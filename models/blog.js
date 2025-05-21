const mongoose = require('mongoose');

const commentsSchema = new mongoose.Schema(
    {
        id: String,
        content: {type: String, required: true},
        author: {type: String, required: true},
        date: {type: Date, default: Date.now},
        replies: [{
            content: {type: String, required: true},
            author: {type: String, required: true},
            date: {type: Date, default: Date.now},
        }],
        likes: [String]
    }
)

const blogSchema = new mongoose.Schema({
    id: String,
    title: String,
    description: String,
    content: String,
    author: String,
    date: String,
    formatedDate: String,
    comments: [commentsSchema]
});

const Blog = mongoose.model('Blog', blogSchema, "blogs");
module.exports = Blog;