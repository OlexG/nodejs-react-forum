const { initManagers } = require('../db/initDB');
const { postManager } = initManagers();

async function postPosts (req, res, next) {
	const result = await postManager.addPost(req.body.title, req.body.body);
	res.statusCode = 200;
	res.send(result);
};

async function getPosts (req, res, next) {
	if (req.query.number && req.query.page) {
		const result = await postManager.getPostsPage(req.query.number, req.query.page);
		res.send(result);
	} else {
		const result = await postManager.getAllPosts();
		res.send(result);
	}
}

async function getPostsId (req, res, next) {
	const result = await postManager.getPost(req.params.id);
	res.send(result);
};

async function getPostsNumber (req, res, next) {
	const result = await postManager.getNumberOfPosts();
	res.send({ result });
};

module.exports = {
	postPosts,
	getPosts,
	getPostsId,
	getPostsNumber
};
