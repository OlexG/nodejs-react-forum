import { Joi, Segments } from 'celebrate';

export default {
	[Segments.QUERY]: Joi.object().required().keys({
		page: Joi.string().optional(),
		number: Joi.number().integer().optional()
	})
};

