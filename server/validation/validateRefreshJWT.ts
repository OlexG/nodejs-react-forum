import jwt = require('jsonwebtoken');
export default function validateRefreshJWT(req, res, next) {
	const refreshToken = req.headers.refreshtoken;
	if (!refreshToken) {
		return res.sendStatus(401);
	}
	try {
		jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);
	} catch (e) {
		return res.sendStatus(401);
	}
	next();
}
