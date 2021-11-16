import { initManagers } from '../db/initDB';
const { userManager } = initManagers();

export default async function validateUsernameCookie(req, res, next) {
	const username = req.headers.username;
	const refreshToken = req.headers.refreshToken;
	const validUsername = await userManager.findRefreshToken(refreshToken);

	if (!username || validUsername !== username) {
		res.sendStatus(401);
		return;
	}

	next();
}
