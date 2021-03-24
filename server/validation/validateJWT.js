module.exports = function (req, jwt) {
	const authHeader = req.headers.authorization;
	if (authHeader) {
		const token = authHeader.split(' ')[1];
		try {
			const result = jwt.verify(token, process.env.JWT_TOKEN);
			if (result.username === req.cookies.username) {
				return true;
			}
		} catch (e) {
			return false;
		}
	}
	return false;
};
