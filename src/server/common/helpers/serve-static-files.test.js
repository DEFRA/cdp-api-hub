import { readFileSync } from 'node:fs'
import path from 'node:path'

import { createServer } from '../../server.js'
import { statusCodes } from '../constants/status-codes.js'
import { config } from '../../../config/config.js'

const webpackManifest = JSON.parse(
  readFileSync(
    path.join(config.get('root'), '.public/assets-manifest.json'),
    'utf-8'
  )
)

describe('#serveStaticFiles', () => {
  let server

  describe('When secure context is disabled', () => {
    beforeEach(async () => {
      server = await createServer()
      await server.initialize()
    })

    afterEach(async () => {
      await server?.stop({ timeout: 0 })
    })

    test('Should serve favicon as expected', async () => {
      const { statusCode } = await server.inject({
        method: 'GET',
        url: '/favicon.ico'
      })

      expect(statusCode).toBe(statusCodes.noContent)
    })

    test('Should serve assets as expected', async () => {
      // Note npm run build is ran in the postinstall hook in package.json to make sure there is always a file
      // available for this test. Remove as you see fit
      const { statusCode } = await server.inject({
        method: 'GET',
        url: '/public/assets/images/govuk-crest.svg'
      })

      expect(statusCode).toBe(statusCodes.ok)
    })

    test('Should gzip compress javascript assets when requested', async () => {
      const { headers, statusCode } = await server.inject({
        method: 'GET',
        url: `/public/${webpackManifest['application.js']}`,
        headers: {
          'accept-encoding': 'gzip'
        }
      })

      expect(statusCode).toBe(statusCodes.ok)
      expect(headers['content-encoding']).toBe('gzip')
      expect(headers.vary).toContain('accept-encoding')
    })
  })
})
