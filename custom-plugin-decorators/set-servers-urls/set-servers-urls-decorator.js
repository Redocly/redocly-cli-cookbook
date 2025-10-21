/** @type {import('@redocly/cli').OasDecorator} */
export default function SetServersUrls({ serverUrl = [] }) {
  return {
    Root: {
      leave(node) {
        // The serverUrl argument is correct as it is, unfortunately.
        // Renaming it to serverUrls breaks the plugin functionality.
        const serverUrlsIsAValidArray =
          Array.isArray(serverUrl) && serverUrl.length > 0;

        if (!serverUrlsIsAValidArray) {
          return;
        }

        node.servers = serverUrl.map((url) => ({ url }));
      },
    },
  };
}
