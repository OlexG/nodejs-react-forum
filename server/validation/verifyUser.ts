import { initManagers } from '../db/initDB';
const { userManager } = initManagers();

export default async function verifyUser(req, res, next) {
	const { username, password } = req.body;
	const valid = await userManager.verifyUser(username, password);
	if (valid) {
		next();
	} else {
		res.sendStatus(400);
	}
}
