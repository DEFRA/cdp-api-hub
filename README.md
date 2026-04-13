# cdp-api-hub

Frontend for listing internal and external APIs on the platform

- [Requirements](#requirements)
  - [Node.js](#nodejs)
- [Config](#config)
- [Local Development](#local-development)
- [Licence](#licence)
  - [About the licence](#about-the-licence)

## Requirements

### Node.js

Please install [Node.js](http://nodejs.org/) `>= v22` and [npm](https://nodejs.org/) `>= v9`. You will find it
easier to use the Node Version Manager [nvm](https://github.com/creationix/nvm)

To use the correct version of Node.js for this application, via nvm:

```bash
cd cdp-api-hub
nvm use
```

## Config

The CDP API hub uses the standard CDP frontend config setting plus these additonal ones:

`ENABLE_EXTERNAL_HUB` - Lists the external API hub if true
`PLATFORM_STATE_S3_BUCKET` - S3 bucket that holds the platform state config
`PLATFORM_STATE_CACHE_TTL` - How long to cache the platform state for

## How the service works

The API works by reading the `entities.json` from platform state bucket in the environment its running in.
The platform state bucket is populate by the `publish-platform-state` lambda, which uploads a copy of the entity data that normally gets sent to portal.

The service reads this state file, extracts all the entities that have `api_docs` metadata available and uses this to build a list of APIs in that environment.
It also uses the service's URL data to construct the full path to the API.

It supports two kinds of API docs, `openapi` (i.e. swagger) and `hosted` (a direct link to an external site).
For OpenAPI docs, it will render them using [Redoc](https://redocly.github.io/) where as `hosted` docs are just direct links.

## Local Development

1. Create S3 bucket
   The docker compose file will create a local platform state bucket (or if you already have localstack or similar running, you can just add one using `s3 mb s3://cdp-platform-state`).

2. Add \_all/entities.json
   You can either take a copy from an existing environment or upload a minimal one.

```json
{
  "created": "2026-03-18T15:09:46.289757+00:00",
  "version": 1,
  "tenants": {
    "cdp-portal-backend": {
      "tenant": {
        "urls": {
          "localhost:5094": {
            "type": "internal",
            "enabled": false,
            "shuttered": false
          }
        }
      },
      "metadata": {
        "teams": ["platform"],
        "api_docs": {
          "internal": true,
          "url": "/openapi/v1.json",
          "api_type": "openapi"
        }
      }
    }
  }
}
```

See the docs on api_hub for how the set up the `api_docs` metadata.

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government license v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable
information providers in the public sector to license the use and re-use of their information under a common open
licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
