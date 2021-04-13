export default {
	initManagers: function () {
		class PostManager {
			async getPost (postId: number): Promise<string> {
				return 'test';
			}

			async getAllPosts (): Promise<Array<any>> {
				return ['test', 'test', 'test', 'test', 'test'];
			}

			async addPost (title: string, body: string) {
				return 'testid';
			}

			async getNumberOfPosts (): Promise<number> {
				return 5;
			}

			async getPostsPage (pageSize: number | string, pageNum: number | string): Promise<Array<any>> {
				return ['test', 'test', 'test'];
			}
		};
		class UserManager {
			async addUser (username: string, password: string): Promise<string> {
				return 'success';
			}

			async addRefreshToken (username: string, refreshToken: string): Promise<void> {

			}

			async deleteRefreshToken (refreshToken: string): Promise<void> {

			}

			async findRefreshToken (refreshToken: string): Promise<string | null> {
				return 'testUsername';
			}

			async verifyUser (username: string, password: string): Promise<boolean> {
				return true;
			}
		};

		return { postManager: new PostManager(), userManager: new UserManager() };
	}
};
