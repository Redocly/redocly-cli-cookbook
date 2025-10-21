# Set servers URLs

Authors:

- [`@TKostrzewski`](https://github.com/TKostrzewski), Thomas Kostrzewski

## What this does and why

A custom plugin/decorator pair that sets the API server(s) URL(s) of the OpenAPI specification. If a `servers` field is already present, it will be overwritten.

The [replace servers URL plugin example](https://redocly.com/docs/cli/guides/replace-servers-url), unfortunately, does not account for when the `servers` field is not already present in the OpenAPI specification.

Some common use cases for this custom plugin and decorator set include:

- overriding server(s) URL(s) for different deployment environments, all without modifying the original OpenAPI specification.
- ensuring all generated API documentation points to a specific gateway, or proxy endpoint.
- standardizing server(s) URL(s) across multiple OpenAPI specifications, in a monorepo, or microservices architecture.
- injecting mock server(s) URL(s) for testing purposes.
- replacing internal server(s) URL(s) with public-facing server(s) URL(s), before publishing API documentation.

## Code

### Decorator

You can find the full decorator code in the [set-servers-urls-decorator.js](set-servers-urls-decorator.js) file.

The decorator first validates the `serverUrl` argument, and then maps it to the OpenAPI `servers` field.

```javascript
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
```

### Plugin

You can find the full plugin code in the [set-servers-urls-plugin.js](set-servers-urls-plugin.js) file.

```javascript
const setServersUrlsDecorator = {
  oas3: {
    "set-servers-urls-decorator": SetServersUrls,
  },
};

export default function setServersUrlsPlugin() {
  return {
    id: "set-servers-urls-plugin",
    decorators: setServersUrlsDecorator,
  };
}
```

### redocly.yaml

You can find the full configuration in the [redocly.yaml](redocly.yaml) file.

```yaml
apis:
  api-one-name:
    root: api-one-definition.yaml
    decorators:
      set-servers-urls-plugin/set-servers-urls-decorator:
        serverUrl:
          [
            "https://api-one.development.com",
            "https://api-one.staging.com",
            "https://api-one.production.com",
          ]
plugins:
  - "./set-servers-urls-plugin.js"
```

## Examples

With the `redocly.yaml` configuration above, and an example OpenAPI description (saved within a `api-one-definition.yaml` file, and taken from Redocly's [museum-openapi-example](https://github.com/Redocly/museum-openapi-example/blob/2770b2b2e59832d245c7b0eb0badf6568d7efb53/openapi.yaml)) as such:

```yaml
openapi: 3.1.0
info:
  title: Redocly Museum API
  ...
servers:
  - url: "https://redocly.com/_mock/docs/openapi/museum-api"
paths:
  ...
...
```

The resulting OpenAPI description (after applying the decorator) would be:

```yaml
openapi: 3.1.0
info:
  title: Redocly Museum API
  ...
servers:
  - url: "https://api-one.development.com"
  - url: "https://api-one.staging.com"
  - url: "https://api-one.production.com"
paths:
  ...
...
```

## References

- Redocly CLI - [Replace servers URL plugin example](https://redocly.com/docs/cli/guides/replace-servers-url)
- Redocly - [museum-openapi-example openapi.yaml](https://github.com/Redocly/museum-openapi-example/blob/2770b2b2e59832d245c7b0eb0badf6568d7efb53/openapi.yaml)
- OpenAPI specification v3.1.0 - [Servers Object](https://spec.openapis.org/oas/v3.1.0#server-object)
