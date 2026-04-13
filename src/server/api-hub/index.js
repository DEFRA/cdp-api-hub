import { hubListingsController } from './controllers/api-hub-listing-controller.js'
import { redocViewController } from './controllers/doc-view-controller.js'
import { apiDocsProxyController } from './controllers/api-docs-proxy-controller.js'
import { apiHubController } from './controllers/api-hub-controller.js'

export const hub = {
  plugin: {
    name: 'hub',
    register(server) {
      server.route([
        {
          method: 'GET',
          path: '/',
          ...apiHubController
        },

        {
          method: 'GET',
          path: '/hub/{hub}',
          ...hubListingsController
        },
        {
          method: 'GET',
          path: '/hub/{hub}/{service}/view/redoc',
          ...redocViewController
        },
        {
          method: 'GET',
          path: '/hub/{hub}/{service}/docs',
          ...apiDocsProxyController
        }
      ])
    }
  }
}
