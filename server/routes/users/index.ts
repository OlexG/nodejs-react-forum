import { celebrate } from 'celebrate';
import userSchema from '../../schemas/userSchema';
import userController from '../../controllers/userController';
import validateRefreshJWT from '../../validation/validateRefreshJWT';
import verifyUser from '../../validation/verifyUser';
import wrap from '../../controllers/wrap';
import { initManagers } from '../../db/initDB';
import validateFile from '../../validation/validateFile';
import express = require('express');
import multer = require('multer')
import path = require('path');;

const { userManager } = initManagers();

const store = multer.diskStorage({
	destination: path.resolve(__dirname, '../../../uploads/'),
	filename: async function(req, file, cb) {
		const fileObj = {
			'image/png': '.png',
			'image/jpeg': '.jpeg',
			'image/jpg': '.jpg'
		};
		const refreshToken = req.cookies.refreshToken;
		const username = await userManager.findRefreshToken(refreshToken);
		cb(null, username + fileObj[file.mimetype]);
	}
});

const upload = multer({
	storage: store,
	fileFilter: function(req, file, cb) {
		validateFile(file, cb);
	}
});
const app = express();

// sign-up user
app.post('/api/v1/users', celebrate(userSchema), wrap(userController.postUsers));

// log-in the user and return their 2 JWT tokens
app.post('/api/v1/login', verifyUser, wrap(userController.login));

// return the access token providing that the refresh token is valid
app.get('/api/v1/token', validateRefreshJWT, wrap(userController.getAccessToken));

// logout user
app.delete('/api/v1/logout', validateRefreshJWT, wrap(userController.logout));

// get user reactions
app.get('/api/v1/users/reactions', validateRefreshJWT, wrap(userController.getUserReactions));

// get user data such as reputation and number of posts
app.get('/api/v1/users', validateRefreshJWT, wrap(userController.getUserData));

// change the user image
app.post('/api/v1/users/change-icon', validateRefreshJWT, upload.single('image'), wrap(userController.changeUserIcon));

module.exports = app;
