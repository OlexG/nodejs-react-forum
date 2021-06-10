import { initManagers } from '../db/initDB';
import { PostManager } from '../db/dbManager';
import { IPost } from '../db/models';
import mongoose = require('mongoose');

// eslint-disable-next-line no-unused-vars
const { jobManager, postManager } = initManagers();
const lt = require('long-timeout');

// run all the tasks which are in the database
jobManager.getAll().then(res => {
	res.forEach((elem) => {
		// eslint-disable-next-line no-new-func
		const fn = new Function('return ' + elem.value)();
		scheduleJob(elem.data, fn, elem._id);
	});
});

function dateDiff(dateOne: Date, dateTwo: Date) : number {
	return dateTwo.getTime() - dateOne.getTime();
}

export async function scheduleJob(postData: Partial<IPost>, fn: (postManager: PostManager, argsObj: Partial<IPost>) => Promise<void>, id?: mongoose.Types.ObjectId): Promise<boolean> {
	let time = dateDiff(new Date(), postData.date);
	time = Math.max(time, 0);
	try {
		if (!id) {
			id = await jobManager.addJob(postData, fn);
		}

		lt.setTimeout(async() => {
			// as fn is called with eval we have to add the data to its local scope
			try {
				await fn(postManager, postData);
				jobManager.deleteJob(id);
			} catch (err) {
				console.error(err.stack);
				console.log('Error resolving job');
			}
		}, time);

		return true;
	} catch (err) {
		console.error(err.stack);
		console.log('Error adding schedule post');
		return false;
	}
}
