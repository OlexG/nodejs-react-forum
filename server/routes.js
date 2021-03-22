const { initManagers } = require('./db/init_db.js');
const validatePost = require('./validation/validatePost.js');
const validateUser = require('./validation/validateUser.js');
const jwt = require('jsonwebtoken');
// eslint-disable-next-line no-unused-vars
const { postManager, userManager } = initManagers();

module.exports = function (app) {
	app.post('/posts', async function (req, res, next) {
		if (validatePost(req)) {
			postManager.addPost(req.body.title, req.body.body).then((result) => {
				res.statusCode = 200;
				res.send(result);
			}).catch(() => {
				next(e);
			});
		} else {
			res.sendStatus(400);
		}
	});

	app.get('/posts', async function (req, res, next) {
		postManager.getAllPosts().then((result) => {
			res.send(result);
		}).catch((e) => {
			next(e);
		});
	});

	app.get('/posts/:id', async function (req, res, next) {
		postManager.getPost(req.params.id).then((result) => {
			res.send(result);
		}).catch((e) => {
			next(e);
		});
	});

	// sign-up user
	app.post('/users', async function (req, res, next) {
		console.log("no");
		const validationResult = validateUser(req);
		if (validationResult === 'valid') {
			const { username, password } = req.body;
			userManager.addUser(username, password).then((result) => {
				res.send({ result });
			}).catch((e) => {
				next(e);
			});
		} else {
			res.statusCode = 400;
			res.send({ result: validationResult });
		}
	});

	// log-in the user and return their JWT
	app.post('/token', async function (req, res, next) {
		const { username, password } = req.body;
		console.log(username, password);
		userManager.verifyUser(username, password).then((valid) => {
			if (valid) {
				const accessToken = jwt.sign({ username: username }, process.env.JWT_TOKEN);
				res.cookie('token', accessToken);
				res.sendStatus(200);
			} else {
				res.sendStatus(400);
			}
		}).catch((e) => {
			next(e);
		});
	});
};
