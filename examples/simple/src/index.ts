import Router from "@qpoint/router";
import proxy from "@qpoint/proxy";
import maskUrls from "@qpoint/mask-urls";
import rewriteHtml from "@qpoint/rewrite-html";

export default new Router()
  .use(proxy({ appUrl: "https://takatext.com" }))

  // .use(proxy({ 
  //   appUrl: "https://www.newegg.com/Computer-Systems/Store/ID-3", 
  //   urlStrategy: 'mirror',
  //   redirect: true
  // }))

  // mask the urls to match the proxy endpoint
  .use(maskUrls({}))

  // activate the rewrite
  .use(rewriteHtml({}))