import path from 'path'
import hapi from '@hapi/hapi'
import Scooter from '@hapi/scooter'

import { router } from './router.js'
import { config } from '../config/config.js'
import { pulse } from './common/helpers/pulse.js'
import { catchAll } from './common/helpers/errors.js'
import { nunjucksConfig } from '../config/nunjucks/nunjucks.js'
import { setupProxy } from './common/helpers/proxy/setup-proxy.js'
import { requestTracing } from './common/helpers/request-tracing.js'
import { requestLogger } from './common/helpers/logging/request-logger.js'
import { sessionCache } from './common/helpers/session-cache/session-cache.js'
import { getCacheEngine } from './common/helpers/session-cache/cache-engine.js'
import { secureContext } from '@defra/hapi-secure-context'
import { contentSecurityPolicy } from './common/helpers/content-security-policy.js'
import { metrics } from '@defra/cdp-metrics'
import { s3Client } from './common/helpers/s3-client.js'
import { getPlatformState } from './api-hub/helpers/get-platform-state.js'

export async function createServer() {
  setupProxy()
  const server = hapi.server({
    host: config.get('host'),
    port: config.get('port'),
    compression: {
      minBytes: 1024
    },
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      },
      files: {
        relativeTo: path.resolve(config.get('root'), '.public')
      },
      security: {
        hsts: {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: false
        },
        xss: 'enabled',
        noSniff: true,
        xframe: true
      }
    },
    router: {
      stripTrailingSlash: true
    },
    cache: [
      {
        name: config.get('session.cache.name'),
        engine: getCacheEngine(config.get('session.cache.engine'))
      }
    ],
    state: {
      strictHeader: false
    }
  })

  await server.register([
    requestLogger,
    requestTracing,
    metrics,
    secureContext,
    pulse,
    sessionCache,
    nunjucksConfig,
    Scooter,
    contentSecurityPolicy,
    s3Client,
    router // Register all the controllers/routes defined in src/server/router.js
  ])

  server.method({
    name: 'getPlatformState',
    method: (s3Client) => getPlatformState(s3Client, server.logger),
    options: {
      cache: {
        expiresIn: config.get('platformState.cache.ttl'),
        generateTimeout: 3000,
        staleIn: config.get('platformState.cache.ttl') / 2,
        staleTimeout: 300
      },
      generateKey(...args) {
        return 'platform-state'
      }
    }
  })

  server.ext('onPreResponse', catchAll)

  return server
}
