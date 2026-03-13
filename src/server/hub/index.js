import {
  hubListingsController,
  docsFetcherController,
  docsController,
  redocController
} from './controller.js'

export const hub = {
  plugin: {
    name: 'hub',
    register(server) {
      server.route([
        {
          method: 'GET',
          path: '/hub/{hub}',
          ...hubListingsController
        },
        {
          method: 'GET',
          path: '/hub/{hub}/{service}',
          ...docsController
        },
        {
          method: 'GET',
          path: '/hub/{hub}/{service}/redoc',
          ...redocController
        },
        {
          method: 'GET',
          path: '/hub/{hub}/{service}/scalar',
          ...docsController
        },
        {
          method: 'GET',
          path: '/hub/{hub}/{service}/docs',
          ...docsFetcherController
        }
      ])
    }
  }
}
