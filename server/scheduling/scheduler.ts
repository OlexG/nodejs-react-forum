import { initManagers } from '../db/initDB';
import { IPost } from '../db/models';
import mongoose = require('mongoose');

// eslint-disable-next-line no-unused-vars
const { jobManager, postManager } = initManagers();
const lt = require('long-timeout');

// run all the tasks which are in the database
(async() => {
	(await jobManager.getAllJobs()).forEach((elem) => {
		if (dateDiff(new Date(), elem.data.date) < 0) {
			jobManager.deleteJob(elem._id);
		} else {
			scheduleJob(elem.data, elem.value, elem._id);
		}
	});
})();

function dateDiff(dateOne: Date, dateTwo: Date) : number {
	return dateTwo.getTime() - dateOne.getTime();
}

export async function scheduleJob(postData: Partial<IPost>, fn:Function, id?: mongoose.Types.ObjectId): Promise<void> {
	const time = dateDiff(new Date(), postData.date);
	if (time >= 0) {
		if (!id) {
			id = await jobManager.addJob(postData, fn);
		}

		lt.setTimeout(() => {
			// as fn is called with eval we have to add the data to its local scope
			fn(postManager, postData);
			jobManager.deleteJob(id);
		}, time);
	}
}
