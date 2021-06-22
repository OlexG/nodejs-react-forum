import { initManagers } from '../db/initDB';
const { userManager } = initManagers();

export default async function validateUsernameParam(req, res, next) {
	const username = req.params.username;
	// check if username exists in db
	const valid = await userManager.verifyUsername(username);
	if (valid) {
		next();
	} else {
		res.sendStatus(400);
	}
}
