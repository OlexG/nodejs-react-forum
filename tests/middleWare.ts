/* eslint-disable @typescript-eslint/no-empty-function */
import validateAccessJWT from '../server/validation/validateAccessJWT';
import validateFile from '../server/validation/validateFile';
import validateRefreshJWT from '../server/validation/validateRefreshJWT';
import mockInitDB from './mocks/mockInitDB';
import proxyquire = require('proxyquire');
import chai = require('chai');
import sinon = require('sinon');
import jwt = require('jsonwebtoken');
require('dotenv').config();
const expect = chai.expect;
const validateUsernameCookie = proxyquire(
	'../server/validation/validateUsernameCookie',
	{ '../db/initDB': mockInitDB }
).default;
const validateUsernameParam = proxyquire(
	'../server/validation/validateUsernameParam',
	{ '../db/initDB': mockInitDB }
).default;
const verifyUser = proxyquire('../server/validation/verifyUser', {
	'../db/initDB': mockInitDB
}).default;

describe('Unit testing of express middleware', function () {
	let res;
	let resSpy;
	let nextSpy;
	beforeEach(function () {
		resSpy = sinon.spy();
		nextSpy = sinon.spy();
		res = {
			sendStatus: resSpy
		};
	});
	it('should validate access token', function () {
		const req = {
			headers: {
				authorization: undefined
			}
		};
		// with no token
		validateAccessJWT(req, res, () => {});
		expect(resSpy.calledOnce).to.equal(true);
		expect(resSpy.args[0][0]).to.equal(401);
		// with an invalid token
		req.headers.authorization =
			'token ' +
			jwt.sign(
				{ username: 'testUsername' },
				process.env.ACCESS_JWT_SECRET + 'INVALID'
			);
		validateAccessJWT(req, res, () => {});
		expect(resSpy.args[1][0]).to.equal(401);
		// with a valid token
		req.headers.authorization =
			'token ' +
			jwt.sign({ username: 'testUsername' }, process.env.ACCESS_JWT_SECRET);
		validateAccessJWT(req, res, nextSpy);
		expect(nextSpy.calledOnce).to.equal(true);
	});
	it('should validate file', function () {
		const cbSpy = sinon.spy();
		const file = {
			mimetype: 'invalid',
			originalname: 'invalid'
		};
		// invalid file
		validateFile({}, file, cbSpy);
		expect(cbSpy.calledOnce).to.equal(true);
		expect(cbSpy.args[0][0]).to.equal('Error: Images Only!');
		// valid file
		file.mimetype = 'image/jpg';
		file.originalname = 'testImage.jpg';
		validateFile({}, file, cbSpy);
		expect(cbSpy.args[1][0]).to.equal(null);
		expect(cbSpy.args[1][1]).to.equal(true);
	});
	it('should validate refresh token', function () {
		const req = {
			cookies: {
				refreshToken: undefined
			}
		};
		// with no token
		validateRefreshJWT(req, res, () => {});
		expect(resSpy.calledOnce).to.equal(true);
		expect(resSpy.args[0][0]).to.equal(401);
		// with an invalid token
		req.cookies.refreshToken = jwt.sign(
			{ username: 'testUsername' },
			process.env.REFRESH_JWT_SECRET + 'INVALID'
		);
		validateRefreshJWT(req, res, () => {});
		expect(resSpy.args[1][0]).to.equal(401);
		// with a valid token
		req.cookies.refreshToken = jwt.sign(
			{ username: 'testUsername' },
			process.env.REFRESH_JWT_SECRET
		);
		validateRefreshJWT(req, res, nextSpy);
		expect(nextSpy.calledOnce).to.equal(true);
	});
	it('should validate username cookie', async function () {
		const req = {
			cookies: {
				username: 'invalidUsername',
				refreshToken: 'testToken'
			}
		};
		// with an invalid username
		await validateUsernameCookie(req, res, () => {});
		expect(resSpy.calledOnce).to.equal(true);
		expect(resSpy.args[0][0]).to.equal(401);
		// with a valid username
		req.cookies.username = 'testUsername';
		await validateUsernameCookie(req, res, nextSpy);
		expect(nextSpy.calledOnce).to.equal(true);
	});
	it('should validate username parameter', async function () {
		const req = {
			params: {
				username: 'invalidUsername'
			}
		};
		// with an invalid username
		await validateUsernameParam(req, res, () => {});
		expect(resSpy.calledOnce).to.equal(true);
		expect(resSpy.args[0][0]).to.equal(400);
		// with an valid username
		req.params.username = 'testUsername';
		await validateUsernameParam(req, res, nextSpy);
		expect(nextSpy.calledOnce).to.equal(true);
	});
	it('should verify user', async function () {
		const req = {
			body: {
				username: 'invalidUsername',
				password: 'testPassword'
			}
		};
		// with an invalid user
		await verifyUser(req, res, () => {});
		expect(resSpy.calledOnce).to.equal(true);
		expect(resSpy.args[0][0]).to.equal(400);
		// with an valid user
		req.body.username = 'testUsername';
		await verifyUser(req, res, nextSpy);
		expect(nextSpy.calledOnce).to.equal(true);
	});
});
