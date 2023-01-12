
export function replaceUrl(from: string, to: string, strategy: string): string {
  if (strategy == 'mask')
    return replaceOrigin(from, to)
  
  if (strategy == 'mirror')
    return to
}

function replaceOrigin(from: string, to: string): string {
  // extract the origin
  let { origin } = new URL(from)

  // remove the trailing slash
  if (origin.endsWith('/'))
    origin = origin.slice(0, -1)

  // rebase the URL
  return from.replace(origin, to)
}
