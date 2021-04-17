import { initManagers } from '../db/initDB';

const { postManager, userManager } = initManagers();

async function postPosts(req, res, next) {
	const refreshToken = req.cookies.refreshToken;
	const username = await userManager.findRefreshToken(refreshToken);
	const result = await postManager.addPost(req.body.title, req.body.body, username);
	res.statusCode = 200;
	res.send(result);
};

async function getPosts(req, res, next) {
	if ('number' in req.query && 'page' in req.query) {
		const result = await postManager.getPostsPage(req.query.number, req.query.page);
		res.send(result);
	} else {
		const result = await postManager.getAllPosts();
		res.send(result);
	}
}

async function getPostsId(req, res, next) {
	const result = await postManager.getPost(req.params.id);
	res.send(result);
};

async function getPostsNumber(req, res, next) {
	const result = await postManager.getNumberOfPosts();
	res.send({ result });
};

export default {
	postPosts,
	getPosts,
	getPostsId,
	getPostsNumber
};
