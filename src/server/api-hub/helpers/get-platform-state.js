import { GetObjectCommand } from '@aws-sdk/client-s3'
import { config } from '../../../config/config.js'

import { transformEntities } from './transform-entities.js'
import { validateUrls } from './validate-urls.js'
/**
 * Provides a list of all entities in the environment that have API docs.
 * @param s3Client
 * @param logger
 * @return {Promise<Awaited<{id: string, docType: string, internal: boolean, external: boolean, teams: string[]}>[]>}
 */
export async function getPlatformState(s3Client, logger) {
  const bucket = config.get('platformState.s3.bucket')
  const key = config.get('platformState.s3.key')

  const response = await s3Client.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key
    })
  )

  const body = await readS3Body(response.Body)
  const parsedJson = JSON.parse(body)
  const docUrls = transformEntities(parsedJson, logger)
  return await validateUrls(docUrls)
}

async function readS3Body(body) {
  if (typeof body?.transformToString === 'function') {
    return body.transformToString()
  }

  if (body instanceof Uint8Array) {
    return Buffer.from(body).toString('utf8')
  }

  const chunks = []

  for await (const chunk of body) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }

  return Buffer.concat(chunks).toString('utf8')
}
