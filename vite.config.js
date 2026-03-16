import { cpSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { NodePackageImporter } from 'sass-embedded'
import { defineConfig } from 'vite'

const require = createRequire(import.meta.url)
const dirname = path.dirname(fileURLToPath(import.meta.url))
const govukFrontendPath = path.dirname(
  require.resolve('govuk-frontend/package.json')
)

function copyGovukAssetsPlugin() {
  const assetsSource = path.join(govukFrontendPath, 'dist/govuk/assets')
  const assetsDestination = path.join(dirname, '.public/assets')

  return {
    name: 'copy-govuk-assets',
    closeBundle() {
      cpSync(assetsSource, assetsDestination, {
        force: true,
        recursive: true
      })
    }
  }
}

function flatManifestPlugin() {
  return {
    name: 'flat-assets-manifest',
    writeBundle(_outputOptions, bundle) {
      const manifest = {}
      const applicationChunk = Object.values(bundle).find(
        (chunk) =>
          chunk.type === 'chunk' &&
          chunk.isEntry &&
          chunk.name === 'application'
      )

      for (const chunk of Object.values(bundle)) {
        if (chunk.type === 'chunk' && chunk.isEntry) {
          manifest[`${chunk.name}.js`] = chunk.fileName
        }
      }

      const applicationCss = applicationChunk?.viteMetadata?.importedCss
        ? [...applicationChunk.viteMetadata.importedCss][0]
        : null

      if (applicationCss) {
        manifest['stylesheets/application.scss'] = applicationCss
      }

      writeFileSync(
        path.join(dirname, '.public/assets-manifest.json'),
        JSON.stringify(manifest, null, 2)
      )
    }
  }
}

function redocNullShimPlugin() {
  const shimId = '\0redoc-null-shim'

  return {
    name: 'redoc-null-shim',
    resolveId(id) {
      if (id === 'null') {
        return shimId
      }
    },
    load(id) {
      if (id === shimId) {
        return 'export default {}'
      }
    }
  }
}

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'

  return {
    build: {
      cssMinify: false,
      emptyOutDir: true,
      manifest: false,
      minify: isProduction,
      outDir: '.public',
      rollupOptions: {
        input: {
          application: path.resolve(
            dirname,
            'src/client/javascripts/application.js'
          ),
          redoc: path.resolve(dirname, 'src/client/javascripts/redoc.js')
        },
        output: {
          assetFileNames(assetInfo) {
            const name = assetInfo.names?.[0] ?? assetInfo.name ?? ''
            const extname = path.extname(name).toLowerCase()

            if (extname === '.css') {
              return isProduction
                ? 'stylesheets/[name].[hash:7].min[extname]'
                : 'stylesheets/[name][extname]'
            }

            if (/\.(woff2?|eot|ttf|otf)$/i.test(name)) {
              return 'assets/fonts/[name][extname]'
            }

            if (/\.(png|svg|jpe?g|gif|ico)$/i.test(name)) {
              return 'assets/images/[name][extname]'
            }

            return 'assets/[name][extname]'
          },
          chunkFileNames: isProduction
            ? 'javascripts/[name].[hash:7].min.js'
            : 'javascripts/[name].js',
          entryFileNames: isProduction
            ? 'javascripts/[name].[hash:7].min.js'
            : 'javascripts/[name].js'
        }
      },
      sourcemap: isProduction,
      watch: mode === 'development' ? {} : null
    },
    css: {
      preprocessorOptions: {
        scss: {
          importers: [new NodePackageImporter()],
          loadPaths: [
            path.join(dirname, 'src/client/stylesheets'),
            path.join(dirname, 'src/server/common/components'),
            path.join(dirname, 'src/server/common/templates/partials')
          ],
          quietDeps: true,
          style: 'expanded'
        }
      }
    },
    plugins: [
      redocNullShimPlugin(),
      copyGovukAssetsPlugin(),
      flatManifestPlugin()
    ],
    publicDir: false
  }
})
