import mockInitDB from './mocks/mockInitDB';
import chai = require('chai');
import proxyquire = require('proxyquire');
import sinon = require('sinon');
import jwt = require('jsonwebtoken');

const expect = chai.expect;

const userController = proxyquire('../server/controllers/userController.ts', { '../db/initDB': mockInitDB }).default;

describe('Unit testing of user controllers', function() {
	it('should post user', async function() {
		const req = {
			body: {
				username: 'testUsername',
				password: 'testPassword'
			}
		};
		const resSpy = sinon.spy();
		const res = {
			send: resSpy
		};
		await userController.postUsers(req, res);
		expect(resSpy.calledOnce).to.equal(true);
		expect(resSpy.args[0][0]).to.eql({ validation: { body: { message: 'success' } } });
	});

	it('should login', async function() {
		const req = {
			body: {
				username: 'testUsername'
			}
		};
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

	it('should get access token', async function() {
		const req = {
			cookies: {
				refreshToken: jwt.sign({ username: 'testUsername' }, 'testSecret')
			}
		};
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

	it('should logout', async function() {
		const req = {
			cookies: {
				refreshToken: 'testToken'
			}
		};
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

	it('should get user reactions', async function() {
		const req = {
			cookies: {
				refreshToken: 'testToken'
			}
		};
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
});
