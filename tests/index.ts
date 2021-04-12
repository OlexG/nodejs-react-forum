import assert = require('assert');
import chai = require('chai');
import request = require('supertest');
import { app } from '../index';
import { initDB } from '../server/db/initDB';
const expect = chai.expect;


describe('Application Unit Testing', function() {
	let initManagers;
	let postManager, userManager;
	before(function(done) {
		initDB(done);
	});
	before(function(done) {
		({ initManagers } = require('../server/db/initDB'));
		({ userManager, postManager } = initManagers());
		done();
	});
	it('should retrieve posts', function() {
		return request(app)
			.get('/api/v1/posts')
			.then(function(response){
				expect(response.status).to.equal(200);
				const responsePosts = JSON.parse(response.res.text);
				postManager.getAllPosts().then(dbPosts => {
					expect(responsePosts).to.eql(dbPosts);
				})
			})
	});
});
