import { DocTypes } from './constants.js'

export const addApiLinks = (hub, api) => {
  const encodedHub = encodeURIComponent(hub)
  const encodedService = encodeURIComponent(api.id)

  return {
    ...api,
    link: getDocsLink(encodedHub, encodedService, api),
    serviceLink: `/hub/${encodedHub}/${encodedService}`
  }
}

const getDocsLink = (hub, service, api) => {
  if (api.docType === DocTypes.openapi) {
    return `/hub/${hub}/${service}/view/redoc`
  }

  if (api.docType === DocTypes.hosted) {
    return api.documentUrl
  }

  return '#'
}
