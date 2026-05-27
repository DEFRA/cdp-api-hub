import { hubListingsController } from './controllers/api-hub-listing-controller.js'
import { redocViewController } from './controllers/doc-view-controller.js'
import { apiDocsProxyController } from './controllers/api-docs-proxy-controller.js'
import { apiHubController } from './controllers/api-hub-controller.js'
import { authCallbackController } from './controllers/auth-callback-controller.js'
import { signInController } from './controllers/sign-in-controller.js'
import { signOutController } from './controllers/sign-out-controller.js'

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
        },
        {
          method: 'GET',
          path: '/sign-in',
          ...signInController
        },
        {
          method: 'GET',
          path: '/sign-out',
          ...signOutController
        },
        {
          method: ['POST'],
          path: '/auth/callback',
          handler: authCallbackController.handler,
          options: {
            auth: false,
            plugins: {
              crumb: false
            },
            payload: {
              parse: true,
              allow: 'application/x-www-form-urlencoded'
            }
          }
        },
        {
          method: ['GET'],
          path: '/auth/callback',
          handler: authCallbackController.handler,
          options: {
            auth: false
          }
        }
      ])
    }
  }
}
