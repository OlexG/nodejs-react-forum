export default function validateUsername (username) {
	if (username.length < 4) {
		return 'username is too short';
	}
	if (username.length > 15) {
		return 'username is too long';
	}
	return 'valid';
}
