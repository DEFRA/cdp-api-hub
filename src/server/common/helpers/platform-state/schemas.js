import Joi from 'joi'

export const tenantSchema = Joi.object({
  tenant: Joi.object({
    urls: Joi.object().pattern(
      Joi.string(),
      Joi.object({
        type: Joi.string(),
        enabled: Joi.boolean(),
        shuttered: Joi.boolean()
      })
    )
  }).unknown(true),
  metadata: Joi.object({
    api_docs: Joi.object({
      url: Joi.string().uri({ allowRelative: true }),
      doc_type: Joi.string()
      // TODO: internal/public/etc
    }).unknown(true)
  })
})

export const entitySchema = Joi.object({
  environment: Joi.string().required(),
  version: Joi.number().required(),
  tenants: Joi.object().pattern(Joi.string(), tenantSchema)
})
