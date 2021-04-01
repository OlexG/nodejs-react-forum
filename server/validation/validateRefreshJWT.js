const jwt = require('jsonwebtoken');
module.exports = function (req, res, next) {
	if (!req.cookies.refreshToken) {
		return res.sendStatus(401);
	}
	const refreshToken = req.cookies.refreshToken;
	try {
		jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);
	} catch (e) {
		return res.sendStatus(401);
	}
	next();
};
