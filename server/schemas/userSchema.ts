import { Joi, Segments } from 'celebrate';

export default {
	[Segments.BODY]: Joi.object().keys({
		username: Joi.string().required(),
		password: Joi.string().min(8).required().messages({
			'string.min': 'your password is less then 8 characters long'
		})
	})
};
