import { MockAgent, setGlobalDispatcher } from 'undici'
import { validateUrls } from './validate-urls.js'

const agent = new MockAgent()
setGlobalDispatcher(agent)
agent.disableNetConnect()

describe('validate-urls', () => {
  test('updates enabled status correctly', async () => {
    const mockPool = agent.get('https://example.com')

    // Scenario: Success
    mockPool.intercept({ path: '/good', method: 'HEAD' }).reply(200)
    // Scenario: Not Found
    mockPool.intercept({ path: '/bad', method: 'HEAD' }).reply(404)
    // Scenario: Timeout/Delay
    mockPool.intercept({ path: '/slow', method: 'HEAD' }).reply(200).delay(3000)

    const input = {
      a: {
        id: 'a',
        docType: 'openapi',
        internal: true,
        external: false,
        teams: [],
        documentUrl: 'https://example.com/good'
      },
      b: {
        id: 'b',
        docType: 'openapi',
        internal: true,
        external: false,
        teams: [],
        documentUrl: 'https://example.com/bad'
      },
      c: {
        id: 'b',
        docType: 'openapi',
        internal: true,
        external: false,
        teams: [],
        documentUrl: 'https://example.com/slow'
      }
    }

    const result = await validateUrls(input)

    expect(result.a.enabled).toBe(true)
    expect(result.b.enabled).toBe(false)
    expect(result.c.enabled).toBe(false)
  })
})
