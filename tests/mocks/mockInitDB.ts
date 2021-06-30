import sinon = require('sinon');
export default {
	initManagers: function () {
		class PostManager {
			getPost = sinon.stub().resolves('test');

			getAllPosts = sinon
				.stub()
				.resolves(['test', 'test', 'test', 'test', 'test']);

			addPost = sinon.stub().resolves('testid');

			getNumberOfPosts = sinon.stub().resolves(5);

			getPostsPage = sinon.stub().resolves(['test', 'test', 'test']);

			downvotePost = sinon.stub().resolves(true);

			upvotePost = sinon.stub().resolves(true);

			removeReactions = sinon.stub();
		}
		class UserManager {
			addUser = sinon.stub().resolves('success');

			addRefreshToken = sinon.stub();

			deleteRefreshToken = sinon.stub();

			findRefreshToken = sinon.stub().resolves('testUsername');

			verifyUser = sinon.stub().callsFake((username, password) => {
				return Promise.resolve(
					username === 'testUsername' && password === 'testPassword'
				);
			});

			addPostUpvote = sinon.stub().resolves(true);

			addPostDownvote = sinon.stub().resolves(true);

			removePostDownvote = sinon.stub().resolves(true);

			removePostUpvote = sinon.stub().resolves(true);

			getUserReactions = sinon.stub().resolves({ downvotes: {}, upvotes: {} });

			getUserData = sinon
				.stub()
				.resolves({ username: 'testUsername', upvotes: 0, downvotes: 0 });

			updateIconPath = sinon.stub().resolves('testPath');

			getIconPathRes = { all: ['testPath', null], cur: 0 };

			getIconPath = sinon.stub().callsFake(() => {
				const curInd = this.getIconPathRes.cur;
				// Cycle to the next possible output for testing
				this.getIconPathRes.cur += 1;
				this.getIconPathRes.cur %= 2;
				return Promise.resolve(this.getIconPathRes.all[curInd]);
			});

			verifyUsername = sinon.stub().callsFake((username) => {
				return Promise.resolve(username === 'testUsername');
			});
		}

		return { postManager: new PostManager(), userManager: new UserManager() };
	}
};
