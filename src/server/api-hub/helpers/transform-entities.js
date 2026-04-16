import { DocTypes } from './constants.js'

/**
 * Filters out entities that have API docs configured and
 * extracts just the api document data from the complete entity set.
 * @param {{}} entities
 * @param {{}} logger
 * @return {{ id: string, documentUrl: string, docType: string, internal: bool, external:bool, teams: string[]}[]}
 */
export function transformEntities(entities, logger) {
  const output = {}

  Object.entries(entities.tenants).forEach(([name, data]) => {
    if (data && data?.metadata?.api_docs?.url) {
      const docs = data.metadata.api_docs

      // Re-arrange urls by type
      const urlsByType = {}
      Object.entries(data.tenant?.urls ?? {}).forEach(([url, info]) => {
        urlsByType[info.type] = url
      })

      const record = {
        id: name,
        docType: docs.doc_type,
        internal: docs.internal,
        external: docs.external,
        teams: data.metadata.teams ?? []
      }

      // Handle OpenAPI docs
      if (docs.doc_type === DocTypes.openapi && urlsByType.internal) {
        const relativeDocUrl = docs.url
        const baseUrl = urlsByType.internal
        const protocol = baseUrl.startsWith('localhost') ? 'http' : 'https'

        record.documentUrl = new URL(
          relativeDocUrl,
          `${protocol}://${urlsByType.internal}`
        )
        output[name] = record
      } else if (docs.doc_type === DocTypes.hosted && isAbsolute(docs.url)) {
        record.documentUrl = docs.url
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
