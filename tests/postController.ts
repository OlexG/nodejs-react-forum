import mockInitDB from './mocks/mockInitDB';
import chai = require('chai');
import proxyquire = require('proxyquire');
import sinon = require('sinon');

const expect = chai.expect;

const postController = proxyquire('../server/controllers/postController.ts', { '../db/initDB': mockInitDB }).default;

describe('Unit testing of post controllers', function() {
	it('should attempt to post', async function() {
		const req = {
			body: {
				title: 'testTitle',
				body: 'testBody'
			}
		};
		const resSpy = sinon.spy();
		const res = {
			send: resSpy,
			statusCode: -1
		};
		await postController.postPosts(req, res);
		expect(resSpy.calledOnce).to.equal(true);
		expect(resSpy.calledWith('testid')).to.equal(true);
		expect(res.statusCode).to.equal(200);
	});
	it('should get all posts', async function() {
		const req = {
			query: {}
		};
		const resSpy = sinon.spy();
		const res = {
			send: resSpy
		};
		await postController.getPosts(req, res);
		expect(resSpy.calledOnce).to.equal(true);
		expect(resSpy.args[0][0]).to.eql(['test', 'test', 'test', 'test', 'test']);
	});
	it('should get post based on page', async function() {
		const req = {
			query: {
				number: 0,
				page: 0
			}
		};
		const resSpy = sinon.spy();
		const res = {
			send: resSpy
		};
		await postController.getPosts(req, res);
		expect(resSpy.calledOnce).to.equal(true);
		expect(resSpy.args[0][0]).to.eql(['test', 'test', 'test']);
	});
	it('should get get a post based on id', async function() {
		const req = {
			params: {
				id: 0
			}
		};
		const resSpy = sinon.spy();
		const res = {
			send: resSpy
		};
		await postController.getPostsId(req, res);
		expect(resSpy.calledOnce).to.equal(true);
		expect(resSpy.calledWith('test')).to.equal(true);
	});
	it('should get the number of posts', async function() {
		const req = {};
		const resSpy = sinon.spy();
		const res = {
			send: resSpy
		};
		await postController.getPostsNumber(req, res);
		expect(resSpy.calledOnce).to.equal(true);
		expect(resSpy.args[0][0]).to.eql({ result: 5 });
	});
});
