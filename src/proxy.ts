import { Context } from "@qpoint/router"
import { replaceUrl } from "./url"
import parseForwarded from 'forwarded-parse'

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

  // log if debug mode
  const debug = (msg: string) => {
    if (context.state['proxy.debug'])
      context.log(`proxy: ${msg}`)
  }

  // if the client is requesting a scheme, let's ensure we're matching it
  if (context.req.headers.has('Forwarded')) {
    try {
      // extract the header
      const forward = context.req.headers.get('Forwarded');

      // debug
      debug(`Forwarded header found: ${forward}`);

      // parse all the forwarded entries
      const records = parseForwarded(forward);

      // grab the proto if it's set
      const proto = records.find(item => item.proto)?.proto;

      // debug
      debug(`Forwarded proto requested: ${proto}`);

      // parse url
      let parsedUrl = new URL(url);

      // update the protocol if it's different
      if (proto !== parsedUrl.protocol) {
        // set the scheme
        parsedUrl.protocol = proto;

        // debug
        debug(`previous url: ${url}`);

        // update the url
        url = parsedUrl.toString();

        // debug
        debug(`new url: ${url}`);
      }
    } catch (err) {
      // nothing to do, the proxy/client has a malformed Forward
      debug(`failed to parse Forwarded header: ${err.message}`);
    }
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

  // copy the proxy request in case anything needs to read the body later (reporting, etc)
  const proxy = context.proxy.clone();

  // fetch response from upstream app
  try {
    context.response = await fetch(proxy);
  } catch (err) {
    context.response = new Response(err.message, { status: 502 });
  }

  // create a stop timer
  const stop = Date.now()

  // calculate duration
  context.duration = stop - start
}
