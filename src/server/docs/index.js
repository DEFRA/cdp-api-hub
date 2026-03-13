import { getDocController, reloadDocsController } from './controller.js'

export const docs = {
  plugin: {
    name: 'docs',
    register(server) {
      server.route([
        {
          method: 'POST',
          path: '/reload',
          ...reloadDocsController
        },
        {
          method: 'GET',
          path: '/docs/{id}/api.json',
          ...getDocController
        }
      ])
    }
  }
}
