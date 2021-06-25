import mockInitDB from './mocks/mockInitDB';
import chai = require('chai');
import proxyquire = require('proxyquire');
import sinon = require('sinon');
import jwt = require('jsonwebtoken');
const expect = chai.expect;

const userController = proxyquire('../server/controllers/userController.ts', {
	'../db/initDB': mockInitDB
}).default;

describe('Unit testing of user controllers', function () {
	let req: {
		body: { username: string; password: string };
		cookies: { refreshToken: string; username: string };
		params: { username: string };
	};
	beforeEach(function () {
		req = {
			body: {
				username: 'testUsername',
				password: 'testPassword'
			},
			cookies: {
				refreshToken: jwt.sign({ username: 'testUsername' }, 'testSecret'),
				username: 'testUsername'
			},
			params: {
				username: 'testUsername'
			}
		};
	});
	it('should post user', async function () {
		const resSpy = sinon.spy();
		const res = {
			send: resSpy
		};
		await userController.postUsers(req, res);
		expect(resSpy.calledOnce).to.equal(true);
		expect(resSpy.args[0][0]).to.eql({
			validation: { body: { message: 'success' } }
		});
	});

	it('should login', async function () {
		const resSpy = sinon.spy();
		const cookieSpy = sinon.spy();
		const res = {
			sendStatus: resSpy,
			cookie: cookieSpy
		};

		await userController.login(req, res);
		expect(resSpy.calledOnce).to.equal(true);
		expect(resSpy.calledWith(200)).to.equal(true);
		expect(cookieSpy.callCount).to.equal(3);
		expect(cookieSpy.getCall(0).args[0]).to.equal('accessToken');
		expect(cookieSpy.getCall(1).args[0]).to.equal('refreshToken');
		expect(cookieSpy.getCall(2).args[0]).to.equal('username');
	});

	it('should get access token', async function () {
		const resSpy = sinon.spy();
		const cookieSpy = sinon.spy();
		const res = {
			sendStatus: resSpy,
			cookie: cookieSpy
		};

		await userController.getAccessToken(req, res);
		expect(resSpy.calledOnce).to.equal(true);
		expect(resSpy.calledWith(200)).to.equal(true);
		expect(cookieSpy.calledOnce).to.equal(true);
		expect(cookieSpy.calledWith('accessToken')).to.equal(true);
	});

	it('should logout', async function () {
		const resSpy = sinon.spy();
		const clearCookieSpy = sinon.spy();
		const res = {
			sendStatus: resSpy,
			clearCookie: clearCookieSpy
		};

		await userController.logout(req, res);
		expect(resSpy.calledOnce).to.equal(true);
		expect(resSpy.calledWith(200)).to.equal(true);
		expect(clearCookieSpy.calledOnce).to.equal(true);
		expect(clearCookieSpy.calledWith('refreshToken')).to.equal(true);
	});

	it('should get user reactions', async function () {
		const resSpy = sinon.spy();
		const clearCookieSpy = sinon.spy();
		const res = {
			send: resSpy,
			clearCookie: clearCookieSpy
		};

		await userController.getUserReactions(req, res);
		expect(resSpy.calledOnce).to.equal(true);
		expect(resSpy.args[0][0]).to.eql({ downvotes: {}, upvotes: {} });
	});

	it('should get public user data', async function () {
		const resSpy = sinon.spy();
		const res = {
			send: resSpy
		};
		await userController.getUserData(req, res);
		expect(resSpy.calledOnce).to.equal(true);
		expect(resSpy.args[0][0]).to.eql({
			username: 'testUsername',
			upvotes: 0,
			downvotes: 0
		});
	});
	describe('Unit testing icons', function () {
		it('should change user icon', async function () {
			const goodReq = {
				file: {
					path: 'testPath'
				},
				cookies: {
					username: 'testUsername'
				}
			};
			const badReq = {
				cookies: {
					username: 'testUsername'
				}
			};
			const resSpy = sinon.spy();
			const res = {
				sendStatus: resSpy
			};
			await userController.changeUserIcon(goodReq, res);
			expect(resSpy.calledOnce).to.equal(true);
			expect(resSpy.args[0][0]).to.equal(200);
			await userController.changeUserIcon(badReq, res);
			expect(resSpy.args[1][0]).to.equal(400);
		});
		it('should get user icon', async function () {
			const resSpy = sinon.spy();
			const res = {
				sendFile: resSpy
			};
			// getUserIcon will return testPath
			await userController.getUserIcon({ params: 'testUsername' }, res);
			expect(resSpy.calledOnce).to.equal(true);
			expect(resSpy.args[0][0]).to.equal('testPath');
			// getUserIcon will now return null so the default image should be served
			await userController.getUserIcon({ params: 'testUsername' }, res);
			expect(resSpy.args[1][0]).to.contain('default.png');
		});
	});
});
