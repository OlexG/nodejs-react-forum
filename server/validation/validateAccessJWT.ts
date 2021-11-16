import jwt = require('jsonwebtoken');
export default function validateAccessJWT(req, res, next) {
	const accessToken = req.headers.accesstoken;
	console.log(accessToken);
	if (!accessToken) {
		return res.sendStatus(401);
	}
	try {
		jwt.verify(accessToken, process.env.ACCESS_JWT_SECRET);
	} catch (e) {
		return res.sendStatus(401);
	}
	next();
}
