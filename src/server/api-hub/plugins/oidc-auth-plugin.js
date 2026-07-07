import { config } from '../../../config/config.js'
import {
  CognitoTokenProvider,
  hapiAuthOidcPlugin,
  MockProvider,
  WebIdentityTokenProvider
} from '@defra/hapi-auth-oidc'

const { oidc, cookieOptions, federatedCredentials } = config.get('auth')

const scope = [
  'openid',
  'profile',
  'email',
  'offline_access',
  'user.read'
].join(' ')

function authProvider(providerType) {
  switch (providerType) {
    case 'mock':
      return new MockProvider({})

    case 'cognito':
      return new CognitoTokenProvider({
        poolId: federatedCredentials.identityPoolId,
        logins: { 'cdp-api-hub-aad-access': 'cdp-api-hub' }
      })

    case 'web-identity':
      return new WebIdentityTokenProvider({
        audience: ['cdp-api-hub']
      })

    default:
      throw new Error(`Unrecognised auth provider type: ${providerType}`)
  }
}

export const authOidcPlugin = {
  plugin: hapiAuthOidcPlugin,
  options: {
    oidc: {
      ...oidc,
      scope,
      authProvider: authProvider(federatedCredentials.providerType)
    },
    cookieOptions
  }
}
