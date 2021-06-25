// POSTS_PER_PAGE: how many posts are displayed per one page
const POSTS_PER_PAGE = 20;
// REFRESH_TOKEN_TIME: how often a request gets sent to the server to create a new access token.
// Make sure this number is less the the token expiration time in .env
const REFRESH_TOKEN_TIME = 600000;
// MAX_COMMENT_DEPTH: the depth to which comments are displayed.
// Should be same as MAX_COMMENT_DEPTH in .env
const MAX_COMMENT_DEPTH = 3;
export { POSTS_PER_PAGE, REFRESH_TOKEN_TIME, MAX_COMMENT_DEPTH };
