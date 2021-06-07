/* eslint-disable no-unused-vars */
import { ObjectId } from 'mongodb';
import * as models from './models';
import bcrypt = require('bcrypt');
import mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

export enum SortOption {
	DEFAULT = 'default',
	RECENT = 'recent',
	MOST_UPVOTES = 'most-upvotes',
	OLDEST = 'oldest'
}

export interface FilterObject {
	sort: SortOption,
	search: string;
}

export class PostManager {
	// class with functions relating to accessing and editing post data

	model: mongoose.Model<models.IPost>;

	constructor() {
		this.model = mongoose.model('post', models.PostSchema);
	}

	async getPost(postId: string): Promise<models.IPost> {
		return this.model.findById(postId).exec();
	};

	async getAllPosts(returnWithComments: boolean, parent?: mongoose.Types.ObjectId, parentObject = { children: [] }): Promise<object> {
		if (parent && returnWithComments) {
			const count = await this.model.find({ parent }).countDocuments();
			if (count === 0) {
				return [];
			}
			const parentId = new ObjectId(parent);
			const post = await this.model.aggregate()
				.graphLookup({
					from: 'posts',
					startWith: '$_id',
					connectFromField: '_id',
					connectToField: 'parent',
					as: 'children',
					maxDepth: parseInt(process.env.MAX_COMMENT_DEPTH) - 1,
					depthField: 'level'
				})
				.unwind('$children')
				.sort({ 'children.level': -1, 'children.upvotes': -1 })
				.group(
					{
						_id: '$_id',
						children: { $push: '$children' }
					}
				).addFields({
					children: {
						$reduce: {
							input: '$children',
							initialValue: {
								currentLevel: -1,
								currentLevelPosts: [],
								previousLevelPosts: []
							},
							in: {
								$let: {
									vars: {
										prev: {
											$cond: [
												{ $eq: ['$$value.currentLevel', '$$this.level'] },
												'$$value.previousLevelPosts',
												'$$value.currentLevelPosts'
											]
										},
										current: {
											$cond: [
												{ $eq: ['$$value.currentLevel', '$$this.level'] },
												'$$value.currentLevelPosts',
												[]
											]
										}
									},
									in: {
										currentLevel: '$$this.level',
										previousLevelPosts: '$$prev',
										currentLevelPosts: {
											$concatArrays: [
												'$$current',
												[
													{
														$mergeObjects: [
															'$$this',
															{ children: { $filter: { input: '$$prev', as: 'e', cond: { $eq: ['$$e.parent', '$$this._id'] } } } }
														]
													}
												]
											]
										}
									}
								}
							}
						}
					}
				}
				).addFields({ children: '$children.currentLevelPosts' })
				.match(
					{
						_id: parentId
					}
				).exec();
			const [{ children: posts }] = post;
			return posts;
		} else if (!returnWithComments && parent) {
			return this.model.find({ parent }).lean().exec();
		} else {
			return this.model.find({}).lean().exec();
		}
	};

	async addPost(title: string, body: string, username: string, parent?: mongoose.Types.ObjectId) {
		const post: models.IPost = await this.model.create({
			title,
			body,
			upvotes: 0,
			author: username,
			date: new Date(),
			...parent && { parent }
		});
		return post._id;
	}

	async getNumberOfPosts(): Promise<number> {
		return this.model.find({ parent: undefined }).countDocuments().exec();
	}

	async getPostsPage(pageSize: number | string, pageNum: number | string, { sort = SortOption.DEFAULT, search = '' }: FilterObject): Promise<models.IPost[]> {
		if (typeof pageSize === 'string') pageSize = parseInt(pageSize);
		if (typeof pageNum === 'string') pageNum = parseInt(pageNum);
		if (pageNum < 0) {
			return [];
		}
		const count = await this.getNumberOfPosts();
		if (pageSize * (pageNum - 1) > count) {
			return [];
		}
		let sorted = this.model.find({ parent: undefined });
		if (search) {
			sorted = sorted.find({ $text: { $search: search } });
		}
		switch (sort) {
		case SortOption.DEFAULT:
			break;
		case SortOption.RECENT:
			sorted = sorted.sort({ date: -1 });
			break;
		case SortOption.OLDEST:
			sorted = sorted.sort({ date: 1 });
			break;
		case SortOption.MOST_UPVOTES:
			sorted = sorted.sort({ upvotes: -1 });
			break;
		default:
			break;
		}
		return sorted.skip(pageSize * (pageNum - 1)).limit(pageSize).exec();
	}

	async upvotePost(postID: string, username: string, userManager: UserManager): Promise<boolean> {
		if (await userManager.removePostDownvote(postID, username)) {
			this.model.updateOne(
				{ _id: new ObjectId(postID) },
				{ $inc: { upvotes: 1 } }
			).exec();
		}
		if (await userManager.addPostUpvote(postID, username)) {
			this.model.updateOne(
				{ _id: new ObjectId(postID) },
				{ $inc: { upvotes: 1 } }
			).exec();
			return true;
		}
		return false;
	}

	async downvotePost(postID: string, username: string, userManager: UserManager): Promise<boolean> {
		if (await userManager.removePostUpvote(postID, username)) {
			this.model.updateOne(
				{ _id: new ObjectId(postID) },
				{ $inc: { upvotes: -1 } }
			).exec();
		}
		if (await userManager.addPostDownvote(postID, username)) {
			this.model.updateOne(
				{ _id: new ObjectId(postID) },
				{ $inc: { upvotes: -1 } }
			).exec();
			return true;
		}
		return false;
	}

	async removeReactions(postID: string, username: string, userManager: UserManager) {
		if (await userManager.removePostUpvote(postID, username)) {
			this.model.updateOne(
				{ _id: new ObjectId(postID) },
				{ $inc: { upvotes: -1 } }
			).exec();
		}
		if (await userManager.removePostDownvote(postID, username)) {
			this.model.updateOne(
				{ _id: new ObjectId(postID) },
				{ $inc: { upvotes: 1 } }
			).exec();
		}
	}

	async DELETE_ALL_POSTS(): Promise<void> {
		this.model.remove({}).exec();
	}
}

export class UserManager {
	// class with functions relating to accessing and editing user data

	model: mongoose.Model<models.IUser>;

	constructor() {
		this.model = mongoose.model('user', models.UserSchema);
	}

	async addPostUpvote(postID: string, username: string): Promise<boolean> {
		const user: models.IUser = await this.model.findOne({ username }).exec();
		if (user && !Object.prototype.hasOwnProperty.call(user.upvotes, postID)) {
			user.upvotes[postID] = 1;
			user.markModified('upvotes');
			await user.save();
			return true;
		}
		return false;
	}

	async addPostDownvote(postID: string, username: string): Promise<boolean> {
		const user = await this.model.findOne({ username }).exec();
		if (user && !Object.prototype.hasOwnProperty.call(user.downvotes, postID)) {
			user.downvotes[postID] = 1;
			user.markModified('downvotes');
			await user.save();
			return true;
		}
		return false;
	}

	async removePostDownvote(postID: string, username: string): Promise<boolean> {
		const user = await this.model.findOne({ username }).exec();
		if (user && Object.prototype.hasOwnProperty.call(user.downvotes, postID)) {
			delete user.downvotes[postID];
			user.markModified('downvotes');
			await user.save();
			return true;
		}
		return false;
	}

	async removePostUpvote(postID: string, username: string): Promise<boolean> {
		const user = await this.model.findOne({ username }).exec();
		if (user && Object.prototype.hasOwnProperty.call(user.upvotes, postID)) {
			delete user.upvotes[postID];
			user.markModified('upvotes');
			await user.save();
			return true;
		}
		return false;
	}

	async addUser(username: string, password: string): Promise<string> {
		if (await this.model.findOne({ username }).exec()) {
			return 'username already exists';
		}
		const hashedPassword = await bcrypt.hash(password, 8);
		await this.model.create({
			username,
			password: hashedPassword,
			upvotes: {},
			downvotes: {}
		});
		return 'success';
	}

	async addRefreshToken(username: string, refreshToken: string): Promise<void> {
		this.model.updateOne({ username }, { $set: { refreshToken } }).exec();
	}

	async deleteRefreshToken(refreshToken: string): Promise<void> {
		this.model.updateOne({ refreshToken }, { $unset: { refreshToken: '' } }).exec();
	}

	async findRefreshToken(refreshToken: string): Promise<string | null> {
		const user: models.IUser = await this.model.findOne({ refreshToken }).exec();
		if (user) {
			return user.username;
		}
		return null;
	}

	async getUserReactions(username: string): Promise<Object | null> {
		const user: models.IUser = await this.model.findOne({ username }).exec();
		if (user) {
			return { downvotes: user.downvotes, upvotes: user.upvotes };
		}
		return null;
	}

	async verifyUser(username: string, password: string): Promise<boolean> {
		const user: models.IUser = await this.model.findOne({ username }).exec();
		if (user) {
			return await bcrypt.compare(password, user.password);
		}
		return false;
	}

	async DELETE_ALL_USERS(): Promise<void> {
		this.model.remove({}).exec();
	}
}

export class JobManager {
	model: mongoose.Model<models.IJob>;

	constructor() {
		this.model = mongoose.model('Jobs', models.JobSchema);
	}

	async addJob(data: Partial<models.IPost>, fn: Function): Promise<mongoose.Types.ObjectId> {
		return (await this.model.create({
			data,
			value: fn.toString()
		}))._id;
	}

	deleteJob(id: mongoose.Types.ObjectId): void {
		this.model.deleteOne({ _id: id }).exec();
	}

	async getAllJobs() {
		return await this.model.find().exec();
	}

	async DELETE_ALL_JOBS() {
		this.model.remove({}).exec();
	}
}
