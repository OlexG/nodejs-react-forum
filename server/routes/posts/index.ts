import { celebrate } from 'celebrate';
import validateAccessJWT from '../../validation/validateAccessJWT';
import postSchema from '../../schemas/postSchema';
import editPostRequestSchema from '../../schemas/editPostRequestSchema';
import postRequestSchema from '../../schemas/postRequestSchema';
import postController from '../../controllers/postController';
import wrap from '../../controllers/wrap';
import validateRefreshJWT from '../../validation/validateRefreshJWT';
import express = require('express');
const app = express();

// submit a post
app.post(
	'/api/v1/posts',
	validateAccessJWT,
	celebrate(postSchema),
	wrap(postController.postPosts)
);

// retrieve posts
app.get(
	'/api/v1/posts',
	celebrate(postRequestSchema),
	wrap(postController.getPosts)
);

// retrieve a post based on id
app.get('/api/v1/posts/:id', wrap(postController.getPostsId));

app.get('/api/v1/posts-number', wrap(postController.getPostsNumber));

app.post(
	'/api/v1/posts/:id/upvote',
	validateAccessJWT,
	validateRefreshJWT,
	wrap(postController.upvotePost)
);

app.post(
	'/api/v1/posts/:id/downvote',
	validateAccessJWT,
	validateRefreshJWT,
	wrap(postController.downvotePost)
);

app.delete(
	'/api/v1/posts/:id',
	validateAccessJWT,
	validateRefreshJWT,
	wrap(postController.deletePost)
);

app.patch(
	'/api/v1/posts/:id',
	validateAccessJWT,
	validateRefreshJWT,
	celebrate(editPostRequestSchema),
	wrap(postController.editPost)
);

app.post(
	'/api/v1/posts/:id/remove-reactions',
	validateAccessJWT,
	validateRefreshJWT,
	wrap(postController.removePostReactions)
);

module.exports = app;
