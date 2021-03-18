const { initManagers } = require('./db/init_db.js');
// eslint-disable-next-line no-unused-vars
const { postManager, userManager } = initManagers();
module.exports = function (app) {
	app.post('/posts', async function (req, res) {
		if ('title' in req.body && 'body' in req.body) {
			postManager.addPost(req.body.title, req.body.body).then((result) => {
				res.statusCode = 200;
				res.send(result);
			}).catch(() => {
				res.sendStatus(400);
			});
		} else {
			res.sendStatus(400);
		}
	});

	app.get('/posts', async function (req, res) {
		postManager.getAllPosts().then((result) => {
			res.send(result);
		}).catch((e) => {
			console.log(e);
			res.sendStatus(400);
		});
	});

	app.get('/posts/:id', async function (req, res) {
		postManager.getPost(req.params.id).then((result) => {
			res.send(result);
		}).catch((e) => {
			console.log(e);
			res.sendStatus(400);
		});
	});
};
