import mockInitDB from './mocks/mockInitDB';
import chai = require('chai');
import proxyquire = require('proxyquire');
import sinon = require('sinon');

const expect = chai.expect;

const postController = proxyquire('../server/controllers/postController.ts', {
	'../db/initDB': mockInitDB
}).default;

describe('Unit testing of post controllers', function () {
	let res: {
		statusCode?: any;
		send?: sinon.SinonSpy<any[], any>;
		sendStatus?: sinon.SinonSpy<any[], any>;
	};
	let resSpy: sinon.SinonSpy<any[], any>;
	let resStatusSpy: sinon.SinonSpy<any[], any>;
	beforeEach(function () {
		resSpy = sinon.spy();
		resStatusSpy = sinon.spy();
		// eslint-disable-next-line no-unused-vars
		res = {
			send: resSpy,
			sendStatus: resStatusSpy
		};
	});

	it('should attempt to post', async function () {
		const req = {
			body: {
				title: 'testTitle',
				body: 'testBody'
			},
			cookies: {
				refreshToken: 'testToken'
			}
		};
		res.statusCode = -1;
		await postController.postPosts(req, res);
		expect(resSpy.calledOnce).to.equal(true);
		expect(resSpy.calledWith('testid')).to.equal(true);
		expect(res.statusCode).to.equal(200);
	});
	it('should get all posts', async function () {
		const req = {
			query: {}
		};
		await postController.getPosts(req, res);
		expect(resSpy.calledOnce).to.equal(true);
		expect(resSpy.args[0][0]).to.eql(['test', 'test', 'test', 'test', 'test']);
	});
	it('should get post based on page', async function () {
		const req = {
			query: {
				number: 0,
				page: 0
			}
		};
		await postController.getPosts(req, res);
		expect(resSpy.calledOnce).to.equal(true);
		expect(resSpy.args[0][0]).to.eql(['test', 'test', 'test']);
	});
	it('should get get a post based on id', async function () {
		const req = {
			params: {
				id: 0
			}
		};
		await postController.getPostsId(req, res);
		expect(resSpy.calledOnce).to.equal(true);
		expect(resSpy.calledWith('test')).to.equal(true);
	});
	it('should get the number of posts', async function () {
		const req = {};
		await postController.getPostsNumber(req, res);
		expect(resSpy.calledOnce).to.equal(true);
		expect(resSpy.args[0][0]).to.eql({ result: 5 });
	});

	it('should downvote post', async function () {
		const req = {
			cookies: {
				refreshToken: 'testToken'
			},
			params: {
				id: 'testId'
			}
		};
		await postController.downvotePost(req, res);
		expect(resSpy.calledOnce).to.equal(true);
		expect(resSpy.args[0][0]).to.equal(true);
	});
	describe('Unit testing reactions', function () {
		let req: { cookies: { refreshToken: string }; params: { id: string } };
		beforeEach(function () {
			req = {
				cookies: {
					refreshToken: 'testToken'
				},
				params: {
					id: 'testId'
				}
			};
		});
		it('should upvote post', async function () {
			await postController.upvotePost(req, res);
			expect(resSpy.calledOnce).to.equal(true);
			expect(resSpy.args[0][0]).to.equal(true);
		});

		it('should remove post reactions', async function () {
			await postController.removePostReactions(req, res);
			expect(resStatusSpy.calledOnce).to.equal(true);
			expect(resStatusSpy.args[0][0]).to.equal(200);
		});
	});
});
