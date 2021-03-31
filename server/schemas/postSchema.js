const { Joi, Segments } = require('celebrate');

module.exports = {
	[Segments.BODY]: Joi.object().keys({
		title: Joi.string().required(),
		body: Joi.string().required()
	})
};
