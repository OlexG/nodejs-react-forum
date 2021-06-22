import { initManagers } from '../db/initDB';
const { userManager } = initManagers();

export default async function validateUsernameCookie(req, res, next) {
	const username = req.cookies.username;
	const refreshToken = req.cookies.refreshToken;
	const validUsername = await userManager.findRefreshToken(refreshToken);

	if (!username || validUsername !== username) {
		res.sendStatus(401);
		return;
	}

	next();
}
