import { Context } from "@qpoint/router"
import { replaceUrl } from "./url"

export interface ProxyOpts {
  redirect?: boolean
  urlStrategy?: string
}

export async function proxyRequest(url: string, context: Context, opts: ProxyOpts = {}) {
  // extract the opts
  const { 
    redirect = false, 
    urlStrategy = 'mask'
  } = opts

  // if the client is requesting a scheme, let's ensure we're matching it
  if (context.req.headers.has('X-Forward-Scheme')) {
    // extract the forward schema from the headers
    const scheme = context.req.headers.get('X-Forward-Scheme');
    
    // parse url
    let parsedUrl = new URL(url);

    // set the scheme
    parsedUrl.protocol = scheme;

    // update the url
    url = parsedUrl.toString();
  }

  // assemble the src (app) url
  const srcUrl = replaceUrl(context.request.url, url, urlStrategy)

  // is this a redirect?
  if (redirect) {
    context.response = Response.redirect(srcUrl, 302)
    return
  }

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
