import Router from "@qpoint/router";
import proxy from "@qpoint/proxy";

export default new Router()
  .use(proxy({ appUrl: "https://qpoint.io" }))
