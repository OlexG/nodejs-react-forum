const { celebrate } = require('celebrate');
const express = require('express');
const validateJWT = require('../../validation/validateJWT.js');
const postSchema = require('../../schemas/postSchema.js');
const postController = require('../../controllers/postController.js');
const wrap = require('../../controllers/wrap.js');
const app = module.exports = express();

// submit a post
app.post('/api/v1/posts', validateJWT, celebrate(postSchema), wrap(postController.postPosts));

// retrieve all the posts
app.get('/api/v1/posts', wrap(postController.getPosts));

// retrieve a post based on id
app.get('/api/v1/posts/:id', wrap(postController.getPostsId));

app.get('/api/v1/posts-number', wrap(postController.getPostsNumber));

// retrieve posts based on page number
app.get('/api/v1/posts/:page/:number', wrap(postController.getPostsPage));
