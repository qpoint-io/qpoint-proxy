
// https://www.rfc-editor.org/rfc/rfc7239#section-4
export function parseForwarded(header: string): { [key: string]: string }[] {
  // multiple elements may be provided
  const elements = header.split(', ');

  // parse the elements into records
  return elements.map(element => {
    // multiple params may be provided 
    const params = element.split(';');

    // pull them together into a parsed
    const parsed = {};

    // iterate through the params
    params.forEach(param => {
      // params are key/val pairs
      const [key, value] = param.split('=');

      // set the key
      parsed[key] = value.startsWith('"') && value.endsWith('"') ? value.slice(1, -1) : value;
    });

    // return the final parsed map
    return parsed;
  });
}
