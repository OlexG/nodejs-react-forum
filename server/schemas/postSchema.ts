import { Joi, Segments } from 'celebrate';

export default {
	[Segments.BODY]: Joi.object().keys({
		title: Joi.string().required(),
		body: Joi.string().required()
	})
};
