import { DocTypes } from './constants.js'

/**
 *
 * @param entities
 * @param logger
 * @return {{}}
 */
export function transformEntities(entities, logger) {
  const output = {}

  Object.entries(entities.tenants).forEach(([name, data]) => {
    if (data && data?.metadata?.api_docs?.url) {
      const metadataApiDocs = data.metadata.api_docs
      console.log(metadataApiDocs)

      // Re-arrange urls by type
      const urlsByType = {}
      Object.entries(data.tenant?.urls ?? {}).forEach(([url, info]) => {
        urlsByType[info.type] = url
      })

      // Output structure
      const record = {
        id: name,
        docType: metadataApiDocs.doc_type,
        internal: metadataApiDocs.internal,
        external: metadataApiDocs.external,
        teams: data.metadata?.teams ?? [],
        documentUrl: ''
      }

      console.log('record', record)
      // Handle OpenAPI docs
      if (record.docType === DocTypes.openapi && urlsByType.internal) {
        const relativeDocUrl = metadataApiDocs.url
        const baseUrl = urlsByType.internal
        const protocol = baseUrl.startsWith('localhost') ? 'http' : 'https'

        record.documentUrl = new URL(
          relativeDocUrl,
          `${protocol}://${urlsByType.internal}`
        )
        output[name] = record
      } else if (record.docType === DocTypes.hosted && isAbsolute(metadataApiDocs.url)) {
        record.documentUrl = metadataApiDocs.url
        output[name] = record
      } else {
        logger.warn(`unable to add docs for ${name}`)
        logger.warn(record)
      }
    }
  })

  return output
}

const isAbsolute = (urlString) => {
  return URL.canParse(urlString)
}
