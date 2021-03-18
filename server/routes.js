const { initManagers } = require('./db/init_db.js');
const validatePost = require('./validation/validatePost.js');
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
};
