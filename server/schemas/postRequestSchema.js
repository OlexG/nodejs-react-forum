const { Joi, Segments } = require('celebrate');

module.exports = {
	[Segments.QUERY]: Joi.object().required().keys({
		page: Joi.string().optional(),
		number: Joi.number().integer().optional()
	})
};
