module.exports = function (req) {
	if (!('title' in req.body) || !('body' in req.body)) {
		return false;
	}
	if (typeof req.body.title !== 'string' || typeof req.body.body !== 'string') {
		return false;
	}
	return true;
};
