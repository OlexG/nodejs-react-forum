const { celebrate } = require('celebrate');
const express = require('express');
const userSchema = require('../../schemas/userSchema.js');
const userController = require('../../controllers/userController');
const wrap = require('../../controllers/wrap.js');
const app = module.exports = express();

// sign-up user
app.post('/api/v1/users', celebrate(userSchema), wrap(userController.postUsers));

// log-in the user and return their JWT
app.post('/api/v1/token', wrap(userController.postToken));
