/**
 *
 * @param {{ id: string, documentUrl: string, docType: string, internal: boolean, external:boolean, teams: string[]}[]} entities
 * @return {Promise<Awaited<{id: string, documentUrl: string, docType: string, internal: boolean, external: boolean, teams: string[]}>[]>}
 */
export async function validateUrls(entities) {
  return Promise.all(
    entities.map(async (link) => {
      try {
        if (link.docType === 'openapi' && link.internal === true) {
          const res = await fetch(link.documentUrl, {
            method: 'HEAD',
            signal: AbortSignal.timeout(1500)
          })
          link.enabled = res.ok
        } else {
          link.enabled = true
        }
      } catch {
        link.enabled = false
      }
      return link
    })
  )
}
