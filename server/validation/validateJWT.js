const jwt = require('jsonwebtoken');
module.exports = function (req, res, next) {
	const authHeader = req.headers.authorization;
	if (authHeader) {
		const token = authHeader.split(' ')[1];
		try {
			const result = jwt.verify(token, process.env.JWT_SECRET);
			if (result.username === req.cookies.username) {
				next();
				return;
			}
		} catch (e) {
			return res.sendStatus(401);
		}
	}
	return res.sendStatus(401);
};
