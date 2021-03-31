const jwt = require('jsonwebtoken');
module.exports = function (req, res, next) {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return res.sendStatus(401);
	}
	const refreshToken = authHeader.split(' ')[1];
	try {
		jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);
		next();
		return;
	} catch (e) {
		return res.sendStatus(401);
	}
};
