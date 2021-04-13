export default {
	initManagers: function () {
		const postManager = {
			getPost: async function (postId: number): Promise<string> {
				return 'test';
			},
			getAllPosts: async function (): Promise<Array<any>> {
				return ['test', 'test', 'test', 'test', 'test'];
			},
			addPost: async function (title: string, body: string) {
				return 'testid';
			},
			getNumberOfPosts: async function (): Promise<number> {
				return 5;
			},
			getPostsPage: async function (pageSize: number | string, pageNum: number | string): Promise<Array<any>> {
				return ['test', 'test', 'test'];
			}
		};
		const userManager = {
			addUser: async function (username: string, password: string): Promise<string> {
				return 'success';
			},
			addRefreshToken: async function (username: string, refreshToken: string): Promise<void> {

			},
			deleteRefreshToken: async function (refreshToken: string): Promise<void> {

			},
			findRefreshToken: async function (refreshToken: string): Promise<string | null> {
				return 'testUsername';
			},
			verifyUser: async function (username: string, password: string): Promise<boolean> {
				return true;
			}
		};

		return { postManager, userManager };
	}
};
