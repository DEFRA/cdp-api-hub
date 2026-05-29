import { hubServiceController } from './api-hub-service-controller.js'
import { statusCodes } from '../../common/constants/status-codes.js'

describe('#hubServiceController', () => {
  const mockState = {
    'service-api': {
      id: 'service-api',
      docType: 'openapi',
      internal: true,
      external: false,
      teams: ['Team One'],
      enabled: true,
      documentUrl: new URL('https://service.example.com/openapi.json')
    }
  }

  let h
  let request

  beforeEach(() => {
    h = {
      view: vi.fn(),
      response: vi.fn().mockReturnValue({
        code: vi.fn()
      })
    }

    request = {
      params: {
        hub: 'internal',
        service: 'service-api'
      },
      server: {
        methods: {
          getPlatformState: vi.fn().mockResolvedValue(mockState)
        }
      },
      s3Client: {}
    }
  })

  test('Should render details for a service in the requested hub', async () => {
    await hubServiceController.handler(request, h)

    expect(h.view).toHaveBeenCalledWith('api-hub/views/api-service', {
      pageTitle: 'service-api',
      heading: 'service-api',
      caption: '',
      api: {
        ...mockState['service-api'],
        link: '/hub/internal/service-api/view/redoc',
        serviceLink: '/hub/internal/service-api'
      },
      breadcrumbs: [
        {
          text: 'CDP Internal API Developer Hub',
          href: '/hub/internal'
        },
        {
          text: 'service-api API'
        }
      ]
    })
  })

  test('Should return not found when service is missing', async () => {
    request.params.service = 'missing-api'

    await hubServiceController.handler(request, h)

    expect(h.response).toHaveBeenCalledWith({
      message: 'Not found'
    })
    expect(h.response.mock.results[0].value.code).toHaveBeenCalledWith(
      statusCodes.notFound
    )
  })

  test('Should return not found when service is not in requested hub', async () => {
    request.params.hub = 'external'

    await hubServiceController.handler(request, h)

    expect(h.response).toHaveBeenCalledWith({
      message: 'Not found'
    })
    expect(h.response.mock.results[0].value.code).toHaveBeenCalledWith(
      statusCodes.notFound
    )
  })
})
