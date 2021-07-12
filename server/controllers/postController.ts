/* eslint-disable @typescript-eslint/no-unused-vars */
import { initManagers } from '../db/initDB';
import { SortOption, FilterObject } from '../db/PostManager';
import { scheduleJob } from '../scheduling/scheduler';
const { postManager, userManager } = initManagers();
async function postPosts(req, res, next) {
	const refreshToken = req.cookies.refreshToken;
	const username = await userManager.findRefreshToken(refreshToken);
	const {
		body: { title, body: postBody, parent, date }
	} = req;
	if (date) {
		const jobSuccess = await scheduleJob(
			{ date, title, body: postBody, author: username, parent },
			function (postManager, userManager, argsObj) {
				return postManager.addPost(
					argsObj.title,
					argsObj.body,
					argsObj.author,
					argsObj.date,
					userManager
				);
			}
		);
		if (jobSuccess) {
			res.sendStatus(200);
		} else {
			res.sendStatus(500);
		}
		return;
	}
	const result = await postManager.addPost(
		title,
		postBody,
		username,
		new Date(),
		userManager,
		parent
	);
	res.statusCode = 200;
	res.send(result);
}

async function getPosts(req, res, next) {
	let result;
	if ('number' in req.query && 'page' in req.query) {
		const {
			query: { number, page, sort, search }
		} = req;
		const filterObject: FilterObject = {
			sort: SortOption.DEFAULT,
			search: ''
		};
		if (sort) filterObject.sort = sort;
		if (search) filterObject.search = search;

		result = await postManager.getPostsPage(number, page, filterObject);
	} else {
		if (req.query.parent) {
			result = await postManager.getAllPosts(
				req.query.returnWithComments,
				req.query.parent
			);
		} else {
			result = await postManager.getAllPosts(false);
		}
	}
	res.send(result);
}

async function getPostsId(req, res, next) {
	const result = await postManager.getPost(req.params.id);
	res.send(result);
}

async function getPostsNumber(req, res, next) {
	const result = await postManager.getNumberOfPosts();
	res.send({ result });
}

async function upvotePost(req, res, next) {
	const refreshToken = req.cookies.refreshToken;
	const username = await userManager.findRefreshToken(refreshToken);
	const result = await postManager.upvotePost(
		req.params.id,
		username,
		userManager
	);
	res.send(result);
}

async function downvotePost(req, res, next) {
	const refreshToken = req.cookies.refreshToken;
	const username = await userManager.findRefreshToken(refreshToken);
	const result = await postManager.downvotePost(
		req.params.id,
		username,
		userManager
	);
	res.send(result);
}

async function removePostReactions(req, res, next) {
	const refreshToken = req.cookies.refreshToken;
	const username = await userManager.findRefreshToken(refreshToken);
	await postManager.removeReactions(req.params.id, username, userManager);
	res.sendStatus(200);
}

export default {
	postPosts,
	getPosts,
	getPostsId,
	getPostsNumber,
	upvotePost,
	downvotePost,
	removePostReactions
};
