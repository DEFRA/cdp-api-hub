import Joi from 'joi'

export const hubSchema = Joi.string().valid('internal', 'external').required()
