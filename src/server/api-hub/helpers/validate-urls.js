/**
 * Checks if the url is reachable.
 * @param {Map<string, { id: string, documentUrl: string, docType: string, internal: boolean, external:boolean, teams: string[]}>} links
 * @return {Promise<Awaited<Map<string, {id: string, documentUrl: string, docType: string, internal: boolean, external: boolean, teams: string[]}>>>}
 */
export async function validateUrls(links) {
  const entries = Object.entries(links)

  await Promise.all(
    entries.map(async ([key, link]) => {
      try {
        if (link.docType === 'openapi' && link.internal === true) {
          let res = await fetch(link.documentUrl, {
            method: 'HEAD',
            signal: AbortSignal.timeout(1000)
          })

          if (res.status === 404) {
            res = await fetch(link.documentUrl, {
              method: 'GET',
              signal: AbortSignal.timeout(1500)
            })
          }

          link.enabled = res.ok || [400, 401, 403, 405].includes(res.status) // Not all services support HEAD so this is fairly permissive
        } else {
          link.enabled = true
        }
      } catch {
        link.enabled = false
      }
    })
  )

  return links
}
