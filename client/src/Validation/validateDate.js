export default function validateDate (date) {
	if (date === '') {
		return true;
	} else if (new Date(date).toString() === 'Invalid Date') {
		return false;
	}
	return true;
}
