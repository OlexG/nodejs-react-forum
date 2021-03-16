const routes = function (app, postManager, userManager) {
	app.post('/add_post', function (req, res) {
		console.log(req.body);
		res.redirect('/');
	});
};

module.exports = routes;
