const routes = function (app, postManager, userManager) {
	app.post('/posts/add', function (req, res) {
		console.log(req.body);
	});
};

module.exports = routes;
