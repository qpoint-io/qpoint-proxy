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

## Advanced

`basePath` can be provided with the config if the upstream app is nested in the path.
