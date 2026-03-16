/**
 *
 * @param {{}} entities
 * @return {{id: string, documentUrl: string, docs: {url: string, doc_type: string, internal: boolean, external:boolean}, urls: Object<string, string> }}
 */
export function extractDocUrlsFromEntities(entities) {
  const output = {}

  Object.entries(entities.tenants).forEach(([name, data]) => {
    if (data && data?.metadata?.api_docs?.url && data?.tenant?.urls) {
      const docs = data.metadata.api_docs

      // Re-arrange urls by type
      const urlsByType = {}
      Object.entries(data.tenant.urls).forEach(([url, info]) => {
        urlsByType[info.type] = url
      })

      // Currently we only support openapi (where we pull the json/yml and render it)
      // We may support other kinds of docs (e.g. external/self-hosted where we link to a public url)

      if (docs.doc_type === 'openapi' && urlsByType.internal) {
        const relativeDocUrl = docs.url
        const baseUrl = urlsByType.internal
        const protocol = baseUrl.startsWith('localhost') ? 'http' : 'https'

        const documentUrl = new URL(
          relativeDocUrl,
          `${protocol}://${urlsByType.internal}`
        )
        output[name] = {
          id: name,
          documentUrl,
          docs,
          urls: urlsByType,
          teams: data.metadata.teams ?? []
        }
      }

      // TODO: log why we're skipping it.
    }
  })

  return output
}
