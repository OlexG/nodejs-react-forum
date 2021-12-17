import { Joi, Segments } from 'celebrate';

export default {
	[Segments.BODY]: Joi.object().keys({
		body: Joi.string().required().min(1)
	})
};
