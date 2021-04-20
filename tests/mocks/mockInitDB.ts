import sinon = require('sinon');
export default {
	initManagers: function() {
		class PostManager {
			getPost = sinon.stub().resolves('test');

			getAllPosts = sinon.stub().resolves(['test', 'test', 'test', 'test', 'test']);

			addPost = sinon.stub().resolves('testid');

			getNumberOfPosts = sinon.stub().resolves(5);

			getPostsPage = sinon.stub().resolves(['test', 'test', 'test']);

			downvotePost = sinon.stub().resolves(true);

			upvotePost = sinon.stub().resolves(true);

			removeReactions = sinon.stub();
		};
		class UserManager {
			addUser = sinon.stub().resolves('success');

			addRefreshToken = sinon.stub();

			deleteRefreshToken = sinon.stub();

			findRefreshToken = sinon.stub().resolves('testUsername');

			verifyUser = sinon.stub().resolves(true);

			addPostUpvote = sinon.stub().resolves(true);

			addPostDownvote = sinon.stub().resolves(true);

			removePostDownvote = sinon.stub().resolves(true);

			removePostUpvote = sinon.stub().resolves(true);

			getUserReactions = sinon.stub().resolves({ downvotes: {}, upvotes: {} });
		};

		return { postManager: new PostManager(), userManager: new UserManager() };
	}
};
