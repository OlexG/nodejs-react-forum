import { initManagers } from '../db/initDB';
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

export async function scheduleJob(postData: Partial<IPost>, fn:Function, id?: mongoose.Types.ObjectId): Promise<void> {
	let time = dateDiff(new Date(), postData.date);
	time = Math.max(time, 0);
	try {
		if (!id) {
			id = await jobManager.addJob(postData, fn);
		}

		lt.setTimeout(() => {
			// as fn is called with eval we have to add the data to its local scope
			fn(postManager, postData);
			jobManager.deleteJob(id);
		}, time);
	} catch (err) {
		console.error(err.stack);
		console.log('Error adding schedule post');
	}
}
