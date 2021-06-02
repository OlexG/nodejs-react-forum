export default function validateDate (date, time) {
	const validTime = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9])?$/.test(time);
	if (date === '' && time === '') {
		return true;
	} else if (date === '' || time === '' || new Date(date).toString() === 'Invalid Date' || !validTime) {
		return false;
	}
	return true;
}
