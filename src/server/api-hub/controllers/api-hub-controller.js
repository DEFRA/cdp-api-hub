import { config } from '../../../config/config.js'

export const apiHubController = {
  options: {},
  async handler(request, h) {
    return h.view('api-hub/views/home', {
      pageTitle: `CDP API Docs`,
      heading: `CDP API Docs`,
      breadcrumbs: [],
      enableExternalHub: config.get('enableExternalHub')
    })
  }
}
