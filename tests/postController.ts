import chai = require('chai');
import proxyquire = require('proxyquire');
import sinon = require('sinon');
const expect = chai.expect;

const mockInitDB = {
	initManagers: function () {
		const postManager = {
			getPost: async function (postId: number): Promise<string> {
				return 'test';
			},
			getAllPosts: async function (): Promise<Array<any>> {
				return ['test', 'test', 'test', 'test', 'test'];
			},
			addPost: async function (title: string, body: string) {
				return 'testid';
			},
			getNumberOfPosts: async function (): Promise<number> {
				return 5;
			},
			getPostsPage: async function (pageSize: number | string, pageNum: number | string): Promise<Array<any>> {
				return ['test', 'test', 'test'];
			}
		};
		return { postManager };
	}
};

const postController = proxyquire('../server/controllers/postController.ts', { '../db/initDB': mockInitDB }).default;

console.log(postController);

describe('Unit testing of post controllers', function () {
	it('should attempt to post', async function () {
		const req = {
			body: {
				title: 'testTitle',
				body: 'testBody'
			}
		};
		const resSpy = sinon.spy();
		const res = {
			send: resSpy
		};
		await postController.postPosts(req, res);
		expect(resSpy.calledOnce).to.equal(true);
		expect(resSpy.calledWith('testid')).to.equal(true);
	});
});
