module.exports = function (req) {
	if (!('username' in req.body) || !('password' in req.body)) {
		return 'invalid parameters';
	}
	if (typeof req.body.username !== 'string' || typeof req.body.password !== 'string') {
		return 'invalid parameters';
	}
	if (req.body.password.length < 8) {
		return 'password is too short';
	}
	return 'valid';
};
