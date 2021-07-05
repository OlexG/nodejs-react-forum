/* eslint-disable no-unused-vars */
import { ObjectId } from 'mongodb';
import * as models from './models';
import { UserManager } from './UserManager';
import { publisher, subscribeUser } from '../notifications';

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
		parent?: mongoose.Types.ObjectId
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

		// send a notification to all posts above, that are not made by this user
		this.notifyPostChain(post._id, username);
		subscribeUser(username, post._id);
		await userManager.increasePostCounter(username);
		return post._id;
	}

	async notifyPostChain(startId: mongoose.Types.ObjectId, username: string) {
		const matchStartId = new ObjectId(startId);
		const posts = await this.model
			.aggregate()
			.match({
				_id: matchStartId
			})
			.graphLookup({
				from: 'posts',
				startWith: '$parent',
				connectFromField: 'parent',
				connectToField: '_id',
				as: 'chain'
			})
			.project({ chain: 1 })
			.unwind('chain')
			.sort({ 'chain.date': -1 })
			.match({ 'chain.author': { $ne: username } })
			.group({ _id: '$chain.author', link: { $first: '$chain._id' } })
			.exec();

		if (posts) {
			const ids = posts.map((post) => post.link);
			publisher.notify(ids);
		}
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

	getUserPosts(username: string) {
		return this.model.find({ author: username }, '_id').lean().exec();
	}

	deleteAll() {
		this.model.remove({}).exec();
	}
}
