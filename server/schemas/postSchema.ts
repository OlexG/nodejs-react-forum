import { Joi, Segments } from 'celebrate';

export default {
	[Segments.BODY]: Joi.object().keys({
		title: Joi.string().required(),
		body: Joi.string().required(),
		parent: Joi.string().optional(),
		date: Joi.string().isoDate().optional(),
		time: Joi.string().regex(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9])?$/).when('date', { is: Joi.exist(), then: Joi.required() })
	})
};
