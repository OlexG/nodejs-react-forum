const { celebrate } = require('celebrate');
const express = require('express');
const validateAccessJWT = require('../../validation/validateAccessJWT.js');
const postSchema = require('../../schemas/postSchema.js');
const postRequestSchema = require('../../schemas/postRequestSchema.js');
const postController = require('../../controllers/postController.js');
const wrap = require('../../controllers/wrap.js');
const app = module.exports = express();

// submit a post
app.post('/api/v1/posts', validateAccessJWT, celebrate(postSchema), wrap(postController.postPosts));

// retrieve posts
app.get('/api/v1/posts', celebrate(postRequestSchema), wrap(postController.getPosts));

// retrieve a post based on id
app.get('/api/v1/posts/:id', wrap(postController.getPostsId));

app.get('/api/v1/posts-number', wrap(postController.getPostsNumber));
