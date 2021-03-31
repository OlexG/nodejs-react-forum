const { celebrate } = require('celebrate');
const express = require('express');
const userSchema = require('../../schemas/userSchema.js');
const userController = require('../../controllers/userController');
const validateRefreshJWT = require('../../validation/validateRefreshJWT');
const wrap = require('../../controllers/wrap.js');
const app = module.exports = express();

// sign-up user
app.post('/api/v1/users', celebrate(userSchema), wrap(userController.postUsers));

// log-in the user and return their 2 JWT tokens
app.post('/api/v1/tokens', wrap(userController.postTokens));

// return the access token providing that the refresh token is valid
app.get('/api/v1/tokens/access-token', validateRefreshJWT, wrap(userController.postAccessToken));

// logout user
app.delete('/api/v1/tokens', validateRefreshJWT, wrap(userController.deleteTokens));
