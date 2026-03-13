import Blankie from 'blankie'

/**
 * Manage content security policies.
 * @satisfies {import('@hapi/hapi').Plugin}
 */
const contentSecurityPolicy = {
  plugin: Blankie,
  options: {
    // Hash 'sha256-GUQ5ad8JK5KmEWmROf3LZd9ge94daqNvd8xy9YS1iDw=' is to support a GOV.UK frontend script bundled within Nunjucks macros
    // https://frontend.design-system.service.gov.uk/import-javascript/#if-our-inline-javascript-snippet-is-blocked-by-a-content-security-policy
    defaultSrc: ['self'],
    fontSrc: ['self', 'data:', 'https://fonts.scalar.com'],
    connectSrc: ['self', 'wss', 'data:'],
    mediaSrc: ['self'],
    styleSrc: ['self', 'data:', 'unsafe-inline', 'https://cdn.jsdelivr.net'],
    scriptSrc: [
      'self',
      'data:',
      'unsafe-eval',
      'unsafe-inline',
      'https://cdn.jsdelivr.net',
      "'sha256-vGrOLI/K1l5A1fRqbOsgkQEVSdaLJib5fb0xLWUYXVo='",
      "'sha256-ghfxlBG/wLnbs5d8V1xiu8Xh3T25KC3jM/0unhBDdhA='",
      "'sha256-GUQ5ad8JK5KmEWmROf3LZd9ge94daqNvd8xy9YS1iDw='"
    ],
    imgSrc: ['self', 'data:'],
    frameSrc: ['self', 'data:'],
    objectSrc: ['none'],
    frameAncestors: ['none'],
    formAction: ['self'],
    manifestSrc: ['self'],
    generateNonces: false
  }
}

export { contentSecurityPolicy }
