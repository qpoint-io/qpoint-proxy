import { Context } from '@qpoint/router'
import { proxyRequest } from './proxy'

export * from './proxy'

export interface ProxyConfig {
  appUrl: string,
  basePath?: string
}

// adapter registration
export default function proxy(config: ProxyConfig) {
  // return middleware
  return async function run(context: Context, next: Function) {
    // extract the config
    const { appUrl, basePath = '' } = config

    // proxy the request
    await proxyRequest(appUrl, context, { basePath })

    // continue along
    return next()
  }
}