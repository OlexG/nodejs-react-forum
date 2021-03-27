const jwt = require('jsonwebtoken');
const validateJWT = require('../../validation/validateJWT.js');
const validatePost = require('../../validation/validatePost.js');
const { initManagers } = require('../../db/initDB.js');
const express = require('express');
const app = module.exports = express();

const { postManager } = initManagers();

// submit a post
app.post('/posts', async function (req, res, next) {
	if (!validateJWT(req, jwt)) {
		res.sendStatus(401);
		return next();
	}
	if (!validatePost(req)) {
		res.sendStatus(400);
		return next();
	}
	postManager.addPost(req.body.title, req.body.body).then((result) => {
		res.statusCode = 200;
		res.send(result);
	}).catch((e) => {
		next(e);
	});
});

// retrieve all the posts
app.get('/posts', async function (req, res, next) {
	postManager.getAllPosts().then((result) => {
		res.send(result);
	}).catch((e) => {
		next(e);
	});
});

// retrieve a post based on id
app.get('/posts/:id', async function (req, res, next) {
	postManager.getPost(req.params.id).then((result) => {
		res.send(result);
	}).catch((e) => {
		next(e);
	});
});

app.get('/posts-number', async function (req, res, next) {
	postManager.getNumberOfPosts().then((result) => {
		res.send({ result });
	}).catch((e) => {
		next(e);
	});
});

// retrieve posts based on page number
app.get('/posts/:page/:number', async function (req, res, next) {
	postManager.getPostsPage(req.params.number, req.params.page).then((result) => {
		res.send(result);
	}).catch((e) => {
		next(e);
	});
});
