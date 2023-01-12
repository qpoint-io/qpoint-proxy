import { Context } from '@qpoint/router'
import { proxyRequest } from './proxy'

export * from './proxy'

// url strategies:
//  'mask'    - takes the incoming url and replaces only the origin domain from the 'appUrl'
//  'mirror'  - uses the 'appUrl' directly and doesn't do any modifications

export interface ProxyConfig {
  appUrl: string,
  redirect?: boolean
  urlStrategy?: string
}

// adapter registration
export default function proxy(config: ProxyConfig) {
  // return middleware
  return async function run(ctx: Context, next: Function) {
    // extract the config
    let { appUrl, ...opts } = config

    // allow runtime config to specify appUrl
    if (ctx.state['appUrl'])
      appUrl = ctx.state['appUrl']

    // let's leave a report in case any other adapters care
    ctx.state['proxy.config'] = {
      appUrl,
      ...opts
    }

    // proxy the request
    await proxyRequest(appUrl, ctx, opts)

    // continue along
    return next()
  }
}