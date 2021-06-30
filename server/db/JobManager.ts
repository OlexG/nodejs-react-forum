import * as models from './models';
import mongoose = require('mongoose');

export class JobManager {
	model: mongoose.Model<models.IJob>;

	constructor() {
		this.model = mongoose.model('Jobs', models.JobSchema);
	}

	async addJob(
		data: Partial<models.IPost>,
		fn: Function
	): Promise<mongoose.Types.ObjectId> {
		return (
			await this.model.create({
				data,
				value: fn.toString()
			})
		)._id;
	}

	deleteJob(id: mongoose.Types.ObjectId): void {
		this.model.deleteOne({ _id: id }).exec();
	}

	getAll() {
		return this.model.find().exec();
	}

	deleteAll() {
		this.model.remove({}).exec();
	}
}
