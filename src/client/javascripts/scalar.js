import '@scalar/api-reference/browser/standalone.js'

const docsElement = document.querySelector('#docs')
const scalarConfig = docsElement?.getAttribute('data-scalar-config')

if (docsElement && scalarConfig) {
  const config = JSON.parse(scalarConfig)
  window.Scalar?.createApiReference(docsElement, config)
}
