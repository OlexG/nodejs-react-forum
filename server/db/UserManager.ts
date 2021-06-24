import { unlink } from 'fs';
import * as models from './models';
import bcrypt = require('bcrypt');
import mongoose = require('mongoose');

export interface PublicUserData {
	reputation: number;
	numberOfPosts: number;
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
