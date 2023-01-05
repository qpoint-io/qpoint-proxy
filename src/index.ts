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
  return async function run(ctx: Context, next: Function) {
    // extract the config
    let { appUrl, basePath = '' } = config

    // allow runtime config to specify appUrl
    if (ctx.state['appUrl'])
      appUrl = ctx.state['appUrl']

    // allow runtime config to specify basePath
    if (ctx.state['basePath'])
      basePath = ctx.state['basePath']

    // proxy the request
    await proxyRequest(appUrl, ctx, { basePath })

    // continue along
    return next()
  }
}