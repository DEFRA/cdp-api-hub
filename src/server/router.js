import inert from '@hapi/inert'
import { health } from './health/index.js'
import { serveStaticFiles } from './common/helpers/serve-static-files.js'
import { hub } from './api-hub/index.js'

export const router = {
  plugin: {
    name: 'router',
    async register(server) {
      await server.register([inert])

      // Health-check route. Used by platform to check if service is running, do not remove!
      await server.register([health])

      // Application specific routes, add your own routes here
      await server.register([hub])

      // Static assets
      await server.register([serveStaticFiles])
    }
  }
}
