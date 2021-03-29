export default function validatePassword (password) {
	if (password.length < 8) {
		return 'password is too short';
	}
	if (password.length > 20) {
		return 'password is too long';
	}
	const numbers = /[0-9]/;
	const letters = /[a-zA-Z]/;
	if (!password.match(numbers)) {
		return 'password needs to include a number';
	}
	if (!password.match(letters)) {
		return 'password needs to include a letter';
	}

	return 'valid';
}
