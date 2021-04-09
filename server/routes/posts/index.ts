import { celebrate } from 'celebrate';
import express = require('express');
import validateAccessJWT from '../../validation/validateAccessJWT';
import postSchema from '../../schemas/postSchema';
import postRequestSchema from '../../schemas/postRequestSchema';
import postController from '../../controllers/postController';
import wrap from '../../controllers/wrap';
const app = express();

// submit a post
app.post('/api/v1/posts', validateAccessJWT, celebrate(postSchema), wrap(postController.postPosts));

// retrieve posts
app.get('/api/v1/posts', celebrate(postRequestSchema), wrap(postController.getPosts));

// retrieve a post based on id
app.get('/api/v1/posts/:id', wrap(postController.getPostsId));

app.get('/api/v1/posts-number', wrap(postController.getPostsNumber));

module.exports = app;
