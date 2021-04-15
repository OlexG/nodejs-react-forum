import sinon = require('sinon');
export default {
	initManagers: function() {
		class PostManager {
			getPost = sinon.stub().resolves('test');

			getAllPosts = sinon.stub().resolves(['test', 'test', 'test', 'test', 'test']);

			addPost = sinon.stub().resolves('testid');

			getNumberOfPosts = sinon.stub().resolves(5);

			getPostsPage = sinon.stub().resolves(['test', 'test', 'test']);
		};
		class UserManager {
			addUser = sinon.stub().resolves('success');

			addRefreshToken = sinon.stub();

			deleteRefreshToken = sinon.stub();

			findRefreshToken = sinon.stub().resolves('testUsername');

			verifyUser = sinon.stub().resolves(true);
		};

		return { postManager: new PostManager(), userManager: new UserManager() };
	}
};
