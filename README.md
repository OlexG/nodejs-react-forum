
# Forum

A forum application built with NodeJS, Express, ReactJS and MongoDB.

### Features

1. Login System
2. Single post pages
3. Upvotes/Downvotes
4. Searching and filtering of posts
5. Nested comments system
6. JWT's
7. On-disc storage of user icons

### Demo Video

https://user-images.githubusercontent.com/36348190/123466294-062e9100-d5a4-11eb-9747-3e7070a72a4d.mp4

### Installation as a developer

Make sure you have these installed

1. MongoDB
2. Node JS
3. NPM
4. GIT

Clone the repository

```
git clone "https://github.com/OlexG/nodejs-react-forum"
```

Make sure you are in the directory of your application.
After this run these commands:

```
npm install --dev
cd client
npm install --dev
```

The local.env file should look something like this. 

```
URI=mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false
PORT=3001
TOKEN_EXPIRATION_TIME = '15m'
MAX_COMMENT_DEPTH = 3
# Change this in production
ACCESS_JWT_SECRET = '9hmvkQYqwPyM5AwqirC8'
REFRESH_JWT_SECRET = 'UeQ31thCgXWBqMvoBocC'
```

You will need to copy the contents of local.env into the .env file and edit the environment variables as needed. Replace the `URI` with the URI of your own MongoDB connection. Changing the `PORT` will change the port on which the backend server runs however you will need to edit the `proxy` field of the client package.json to be on that port as well.

There is also a `constants.js` file in the client directory with configuration variables for the client.

To start the backend server and the client development server run `npm start` from the client and root directories.
To run tests use this command from the root directory

```
npm test
```
