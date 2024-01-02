import worker from "../simple/src/index.ts";
import "https://deno.land/x/html_rewriter@v0.1.0-pre.17/polyfill-base64.ts";

// provide any bindings/emulation
const bindings = {};

// shim the context to continue work after the response has been returned
const ctx = {
  // deno-lint-ignore no-unused-vars no-explicit-any
  waitUntil: (work: Promise<any>) => { },
  passThroughOnException: () => {}
};

// start the http server
Deno.serve((req: Request) => (
  worker.fetch(req, bindings, ctx)
));
