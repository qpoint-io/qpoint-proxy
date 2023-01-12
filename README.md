# qpoint-proxy

A Qpoint adapter for proxying requests from the edge

## Usage

```ts
import Router from "@qpoint/router";
import proxy from "@qpoint/proxy";

export default new Router()
  .use(proxy({ appUrl: "https://qpoint.io" }))
```

## Installation

```bash
npm add @qpoint/proxy
```

## Config

`appUrl` sets the upstream app url to forward requests

`redirect` will indicate to redirect the request instead of proxy by default

`urlStrategy` determines how to construct the proxy request url (see below)

## Url Strategy

The URL Strategy determines how to construct the proxy request URL. The following modes are supported:

`mask` takes the incoming url and replaces only the origin domain from the `appUrl`. This is the default settings and the most likely strategy you'll want to use when proxying.

`mirror` uses the `appUrl` directly and doesn't do any modifications. This is mostly beneficial if using this adapter as a redirect, and you want all requests to be redirected to the same location. It can also be used during proxy but beware that all requests will end up at the same upstream url regardless of the incoming path which may be confusing behavior.
