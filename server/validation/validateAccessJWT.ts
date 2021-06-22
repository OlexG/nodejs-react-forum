import jwt = require('jsonwebtoken');
export default function validateAccessJWT(req, res, next) {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return res.sendStatus(401);
	}
	const token = authHeader.split(' ')[1];
	try {
		jwt.verify(token, process.env.ACCESS_JWT_SECRET);
	} catch (e) {
		return res.sendStatus(401);
	}
	next();
}
