import jwt = require('jsonwebtoken');
export default function validateAccessJWT(req, res, next) {
	let token;
	const authHeader = req.headers.authorization;
	if (!authHeader && !req.cookies.accessToken) {
		return res.sendStatus(401);
	} else if (!authHeader && req.cookies.accessToken) {
		token = req.cookies.accessToken;
	} else {
		token = authHeader.split(' ')[1];
	}
	try {
		jwt.verify(token, process.env.ACCESS_JWT_SECRET);
	} catch (e) {
		return res.sendStatus(401);
	}
	next();
}
