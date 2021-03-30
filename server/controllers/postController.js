const { initManagers } = require('../db/initDB');
const { postManager } = initManagers();

async function postPosts (req, res, next) {
	postManager.addPost(req.body.title, req.body.body).then((result) => {
		res.statusCode = 200;
		res.send(result);
	}).catch((e) => {
		next(e);
	});
};

async function getPosts (req, res, next) {
	postManager.getAllPosts().then((result) => {
		res.send(result);
	}).catch((e) => {
		next(e);
	});
}

async function getPostsId (req, res, next) {
	postManager.getPost(req.params.id).then((result) => {
		res.send(result);
	}).catch((e) => {
		next(e);
	});
};

async function getPostsNumber (req, res, next) {
	postManager.getNumberOfPosts().then((result) => {
		res.send({ result });
	}).catch((e) => {
		next(e);
	});
};

async function getPostsPage (req, res, next) {
	postManager.getPostsPage(req.params.number, req.params.page).then((result) => {
		res.send(result);
	}).catch((e) => {
		next(e);
	});
};

module.exports = {
	postPosts,
	getPosts,
	getPostsId,
	getPostsNumber,
	getPostsPage
};
