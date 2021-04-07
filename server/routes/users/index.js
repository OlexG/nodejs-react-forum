const { celebrate } = require('celebrate');
const express = require('express');
const userSchema = require('../../schemas/userSchema.js');
const userController = require('../../controllers/userController.js');
const validateRefreshJWT = require('../../validation/validateRefreshJWT.js');
const verifyUser = require('../../validation/verifyUser.js');
const wrap = require('../../controllers/wrap.js');
const app = module.exports = express();

// sign-up user
app.post('/api/v1/users', celebrate(userSchema), wrap(userController.postUsers));

// log-in the user and return their 2 JWT tokens
app.post('/api/v1/login', verifyUser, wrap(userController.login));

// return the access token providing that the refresh token is valid
app.get('/api/v1/token', validateRefreshJWT, wrap(userController.getAccessToken));

// logout user
app.delete('/api/v1/logout', validateRefreshJWT, wrap(userController.logout));
