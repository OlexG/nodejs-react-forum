/* eslint-disable no-unused-vars */
import { ObjectId } from 'mongodb';
import * as models from './models';
import { unlink } from 'fs';
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
	sort: SortOption;
	search: string;
}

export interface PublicUserData {
	reputation: number;
	numberOfPosts: number;
}

export class PostManager {
	// class with functions relating to accessing and editing post data

	model: mongoose.Model<models.IPost>;

	constructor() {
		this.model = mongoose.model('post', models.PostSchema);
	}

	getPost(postId: string): Promise<models.IPost> {
		return this.model.findById(postId).exec();
	}

	async getAllPosts(
		returnWithComments: boolean,
		parent?: mongoose.Types.ObjectId,
		parentObject = { children: [] }
	): Promise<object> {
		if (parent && returnWithComments) {
			const count = await this.model.find({ parent }).countDocuments();
			if (count === 0) {
				return [];
			}
			const parentId = new ObjectId(parent);
			const post = await this.model
				.aggregate()
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
				.group({
					_id: '$_id',
					children: { $push: '$children' }
				})
				.addFields({
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
															{
																children: {
																	$filter: {
																		input: '$$prev',
																		as: 'e',
																		cond: { $eq: ['$$e.parent', '$$this._id'] }
																	}
																}
															}
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
				})
				.addFields({ children: '$children.currentLevelPosts' })
				.match({
					_id: parentId
				})
				.exec();
			const [{ children: posts }] = post;
			return posts;
		} else if (!returnWithComments && parent) {
			return this.model.find({ parent }).lean().exec();
		} else {
			return this.model.find({}).lean().exec();
		}
	}

	async addPost(
		title: string,
		body: string,
		username: string,
		date: Date,
		userManager: UserManager,
		parent?: mongoose.Types.ObjectId
	) {
		// check if the post hasn't been added before, if added just return it's id
		const existingPostId = await this.model
			.findOne({ author: username, date }, { _id: 1 })
			.exec();
		if (existingPostId) {
			return existingPostId;
		}
		const post: models.IPost = await this.model.create({
			title,
			body,
			upvotes: 0,
			author: username,
			date,
			...(parent && { parent })
		});
		await userManager.increasePostCounter(username);
		return post._id;
	}

	getNumberOfPosts(): Promise<number> {
		return this.model.find({ parent: undefined }).countDocuments().exec();
	}

	async getPostsPage(
		pageSize: number | string,
		pageNum: number | string,
		{ sort = SortOption.DEFAULT, search = '' }: FilterObject
	): Promise<models.IPost[]> {
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
		return sorted
			.skip(pageSize * (pageNum - 1))
			.limit(pageSize)
			.exec();
	}

	async upvotePost(
		postID: string,
		username: string,
		userManager: UserManager
	): Promise<boolean> {
		const { author } = await this.model
			.findOne({ _id: new ObjectId(postID) })
			.exec();
		if (
			(await userManager.removePostDownvote(postID, username, author))
				.hasBeenChanged
		) {
			this.model
				.updateOne({ _id: new ObjectId(postID) }, { $inc: { upvotes: 1 } })
				.exec();
		}
		if (
			(await userManager.addPostUpvote(postID, username, author)).hasBeenChanged
		) {
			this.model
				.updateOne({ _id: new ObjectId(postID) }, { $inc: { upvotes: 1 } })
				.exec();
			return true;
		}
		return false;
	}

	async downvotePost(
		postID: string,
		username: string,
		userManager: UserManager
	): Promise<boolean> {
		const { author } = await this.model
			.findOne({ _id: new ObjectId(postID) })
			.exec();
		if (
			(await userManager.removePostUpvote(postID, username, author))
				.hasBeenChanged
		) {
			this.model
				.updateOne({ _id: new ObjectId(postID) }, { $inc: { upvotes: -1 } })
				.exec();
		}
		if (
			(await userManager.addPostDownvote(postID, username, author))
				.hasBeenChanged
		) {
			this.model
				.updateOne({ _id: new ObjectId(postID) }, { $inc: { upvotes: -1 } })
				.exec();
			return true;
		}
		return false;
	}

	async removeReactions(
		postID: string,
		username: string,
		userManager: UserManager
	) {
		const { author } = await this.model
			.findOne({ _id: new ObjectId(postID) })
			.exec();
		if (
			(await userManager.removePostUpvote(postID, username, author))
				.hasBeenChanged
		) {
			this.model
				.updateOne({ _id: new ObjectId(postID) }, { $inc: { upvotes: -1 } })
				.exec();
		}
		if (
			(await userManager.removePostDownvote(postID, username, author))
				.hasBeenChanged
		) {
			this.model
				.updateOne({ _id: new ObjectId(postID) }, { $inc: { upvotes: 1 } })
				.exec();
		}
	}

	deleteAll() {
		this.model.remove({}).exec();
	}
}

export class UserManager {
	// class with functions relating to accessing and editing user data

	model: mongoose.Model<models.IUser>;

	constructor() {
		this.model = mongoose.model('user', models.UserSchema);
	}

	increasePostCounter(username: string) {
		this.model.updateOne({ username }, { $inc: { numberOfPosts: 1 } }).exec();
	}

	async addPostUpvote(
		postID: string,
		username: string,
		author: string
	): Promise<{ hasBeenChanged: boolean }> {
		const user: models.IUser = await this.model.findOne({ username }).exec();
		if (user && !Object.prototype.hasOwnProperty.call(user.upvotes, postID)) {
			// update the reputation of author
			this.model
				.updateOne({ username: author }, { $inc: { reputation: 1 } })
				.exec();
			user.upvotes[postID] = 1;
			user.markModified('upvotes');
			await user.save();
			return { hasBeenChanged: true };
		}
		return { hasBeenChanged: false };
	}

	async addPostDownvote(
		postID: string,
		username: string,
		author: string
	): Promise<{ hasBeenChanged: boolean }> {
		const user = await this.model.findOne({ username }).exec();
		if (user && !Object.prototype.hasOwnProperty.call(user.downvotes, postID)) {
			// update the reputation of author
			this.model
				.updateOne({ username: author }, { $inc: { reputation: -1 } })
				.exec();
			user.downvotes[postID] = 1;
			user.markModified('downvotes');
			await user.save();
			return { hasBeenChanged: true };
		}
		return { hasBeenChanged: false };
	}

	async removePostDownvote(
		postID: string,
		username: string,
		author: string
	): Promise<{ hasBeenChanged: boolean }> {
		const user = await this.model.findOne({ username }).exec();
		if (user && Object.prototype.hasOwnProperty.call(user.downvotes, postID)) {
			// update the reputation of author
			this.model
				.updateOne({ username: author }, { $inc: { reputation: 1 } })
				.exec();
			delete user.downvotes[postID];
			user.markModified('downvotes');
			await user.save();
			return { hasBeenChanged: true };
		}
		return { hasBeenChanged: false };
	}

	async removePostUpvote(
		postID: string,
		username: string,
		author: string
	): Promise<{ hasBeenChanged: boolean }> {
		const user = await this.model.findOne({ username }).exec();
		if (user && Object.prototype.hasOwnProperty.call(user.upvotes, postID)) {
			// update the reputation of author
			this.model
				.updateOne({ username: author }, { $inc: { reputation: -1 } })
				.exec();
			delete user.upvotes[postID];
			user.markModified('upvotes');
			await user.save();
			return { hasBeenChanged: true };
		}
		return { hasBeenChanged: false };
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
			downvotes: {},
			reputation: 0,
			numberOfPosts: 0
		});
		return 'success';
	}

	async updateIconPath(username: string, path: string): Promise<string> {
		const { iconPath: oldPath } = await this.model.findOne({ username });
		if (oldPath !== path && oldPath) {
			// delete old image
			unlink(oldPath, (e) => {
				if (e) {
					throw e;
				}
			});
		}
		await this.model
			.updateOne({ username }, { $set: { iconPath: path } })
			.exec();
		return path;
	}

	async getIconPath(username: string): Promise<string> {
		const { iconPath } = await this.model.findOne({ username });
		if (iconPath) {
			return iconPath;
		} else {
			return null;
		}
	}

	addRefreshToken(username: string, refreshToken: string) {
		return this.model
			.updateOne({ username }, { $set: { refreshToken } })
			.exec();
	}

	deleteRefreshToken(refreshToken: string) {
		return this.model
			.updateOne({ refreshToken }, { $unset: { refreshToken: '' } })
			.exec();
	}

	async findRefreshToken(refreshToken: string): Promise<string | null> {
		const user: models.IUser = await this.model
			.findOne({ refreshToken })
			.exec();
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

	async verifyUsername(username: string): Promise<boolean> {
		const dbUsername = await this.model
			.findOne({ username }, { username: 1 })
			.exec();
		if (dbUsername) {
			return true;
		}
		return false;
	}

	async getUserData(username: string): Promise<PublicUserData> {
		const user = await this.model.findOne({ username }).exec();
		return {
			reputation: user.reputation,
			numberOfPosts: user.numberOfPosts
		};
	}

	deleteAll() {
		this.model.remove({}).exec();
	}
}

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
