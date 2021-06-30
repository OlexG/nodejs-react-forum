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
	let res: { sendStatus: sinon.SinonSpy<any[], any> };
	let resSpy: sinon.SinonSpy<any[], any>;
	let nextSpy: sinon.SinonSpy<any[], any>;
	beforeEach(function () {
		resSpy = sinon.spy();
		nextSpy = sinon.spy();
		res = {
			sendStatus: resSpy
		};
	});
	describe('should validate access token', function () {
		let req: { headers: any };
		beforeEach(function () {
			req = {
				headers: {
					authorization: undefined
				}
			};
		});
		it('should validate with no token', function () {
			validateAccessJWT(req, res, () => {});
			expect(resSpy.calledOnce).to.equal(true);
			expect(resSpy.args[0][0]).to.equal(401);
		});
		it('should validate with an invalid token', function () {
			req.headers.authorization =
				'token ' +
				jwt.sign(
					{ username: 'testUsername' },
					process.env.ACCESS_JWT_SECRET + 'INVALID'
				);
			validateAccessJWT(req, res, () => {});
			expect(resSpy.calledOnce).to.equal(true);
			expect(resSpy.args[0][0]).to.equal(401);
		});
		it('should validate with an valid token', function () {
			req.headers.authorization =
				'token ' +
				jwt.sign(
					{ username: 'testUsername' },
					process.env.ACCESS_JWT_SECRET as string
				);
			validateAccessJWT(req, res, nextSpy);
			expect(nextSpy.calledOnce).to.equal(true);
		});
	});
	describe('should validate file', function () {
		let cbSpy: sinon.SinonSpy<any[], any>;
		let file: { mimetype: any; originalname: any };
		beforeEach(function () {
			cbSpy = sinon.spy();
			file = {
				mimetype: 'invalid',
				originalname: 'invalid'
			};
		});
		it('should validate with an invalid file', function () {
			validateFile({}, file, cbSpy);
			expect(cbSpy.calledOnce).to.equal(true);
			expect(cbSpy.args[0][0]).to.equal('Error: Images Only!');
		});
		it('should validate with a valid file', function () {
			file.mimetype = 'image/jpg';
			file.originalname = 'testImage.jpg';
			validateFile({}, file, cbSpy);
			expect(cbSpy.args[0][0]).to.equal(null);
			expect(cbSpy.args[0][1]).to.equal(true);
		});
	});
	describe('should validate refresh token', function () {
		let req: { cookies: any };
		beforeEach(function () {
			req = {
				cookies: {
					refreshToken: undefined
				}
			};
		});
		it('should validate with no token', function () {
			validateRefreshJWT(req, res, () => {});
			expect(resSpy.calledOnce).to.equal(true);
			expect(resSpy.args[0][0]).to.equal(401);
		});
		it('should validate with an invalid token', function () {
			req.cookies.refreshToken = jwt.sign(
				{ username: 'testUsername' },
				process.env.REFRESH_JWT_SECRET + 'INVALID'
			);
			validateRefreshJWT(req, res, () => {});
			expect(resSpy.calledOnce).to.equal(true);
			expect(resSpy.args[0][0]).to.equal(401);
		});
		it('should validate with a valid token', function () {
			req.cookies.refreshToken = jwt.sign(
				{ username: 'testUsername' },
				process.env.REFRESH_JWT_SECRET as string
			);
			validateRefreshJWT(req, res, nextSpy);
			expect(nextSpy.calledOnce).to.equal(true);
		});
	});
	describe('should validate username cookie', function () {
		let req: { cookies: any };
		beforeEach(function () {
			req = {
				cookies: {
					username: 'invalidUsername',
					refreshToken: 'testToken'
				}
			};
		});
		it('should validate invalid username', async function () {
			await validateUsernameCookie(req, res, () => {});
			expect(resSpy.calledOnce).to.equal(true);
			expect(resSpy.args[0][0]).to.equal(401);
		});
		it('should validate valid username', async function () {
			req.cookies.username = 'testUsername';
			await validateUsernameCookie(req, res, nextSpy);
			expect(nextSpy.calledOnce).to.equal(true);
		});
	});
	describe('should validate username parameter', function () {
		let req: { params: any };
		beforeEach(function () {
			req = {
				params: {
					username: 'invalidUsername'
				}
			};
		});
		it('should validate invalid username', async function () {
			await validateUsernameParam(req, res, () => {});
			expect(resSpy.calledOnce).to.equal(true);
			expect(resSpy.args[0][0]).to.equal(400);
		});
		it('should validate valid username', async function () {
			req.params.username = 'testUsername';
			await validateUsernameParam(req, res, nextSpy);
			expect(nextSpy.calledOnce).to.equal(true);
		});
	});
	describe('should verify user', function () {
		let req: { body: any };
		beforeEach(function () {
			req = {
				body: {
					username: 'invalidUsername',
					password: 'testPassword'
				}
			};
		});
		it('should verify with an invalid user', async function () {
			await verifyUser(req, res, () => {});
			expect(resSpy.calledOnce).to.equal(true);
			expect(resSpy.args[0][0]).to.equal(400);
		});
		it('should verify with a valid user', async function () {
			req.body.username = 'testUsername';
			await verifyUser(req, res, nextSpy);
			expect(nextSpy.calledOnce).to.equal(true);
		});
	});
});
