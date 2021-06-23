import { Joi, Segments } from 'celebrate';

export default {
	[Segments.QUERY]: Joi.object()
		.required()
		.keys({
			page: Joi.string().optional(),
			number: Joi.number().integer().optional(),
			sort: Joi.string()
				.valid('default', 'recent', 'most-upvotes', 'oldest')
				.optional(),
			parent: Joi.string().optional(),
			returnWithComments: Joi.boolean().optional(),
			search: Joi.string().optional()
		})
};
