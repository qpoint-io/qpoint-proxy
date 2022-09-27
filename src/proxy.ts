import { Context } from "@qpoint/router"

export interface ProxyOpts {
  basePath?: string
}

export async function proxyRequest(url: string, context: Context, opts: ProxyOpts = {}) {
  // extract the opts
  const { basePath = '' } = opts

  // extract the edge URL
  let { origin } = new URL(context.url)

  // remove the trailing slash
  if (origin.endsWith('/'))
    origin = origin.slice(0, -1)

  // rebase the URL
  const srcUrl = context.request.url.replace(`${origin}${basePath}`, url)

  // build a new proxy request with a new url
  context.proxy = new Request(srcUrl, context.proxy)

  // set the request ID
  context.proxy.headers.set('Qpoint-Request-ID', context.requestId)

  // create a start timer
  const start = Date.now()

  // fetch response from upstream app
  context.response = await fetch(context.proxy)

  // create a stop timer
  const stop = Date.now()

  // calculate duration
  context.duration = stop - start
}