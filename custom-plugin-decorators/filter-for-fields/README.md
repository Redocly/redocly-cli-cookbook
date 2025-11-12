# Filter for fields

Authors:

- [`@TKostrzewski`](https://github.com/TKostrzewski), Thomas Kostrzewski

## What this does and why

A custom plugin/decorator pair that filters for OpenAPI operation objects (i.e. HTTP method objects within `path` objects) that contain specific fields and field values.

The native [filter-in command](https://redocly.com/docs/cli/decorators/filter-in), unfortunately, does not remove OpenAPI operation objects that do not define the specified fields at all. Sometimes, we just forget! ¯\_(ツ)\_/¯

Some common use cases for this custom plugin and decorator set include:

- automatically remove operations not marked as `public: true` before publishing API documentation, or sharing with external consumers.
- filter out operations, based on custom fields like `env: production`, to generate environment-specific OpenAPI specifications.
- generate API documentation for different user roles, by filtering operations for fields such as `role: admin`.
- exclude operations related to experimental features, by filtering operations for fields such as `feature: beta`.
- remove operations that do not meet compliance requirements, by filtering operations for fields such as `compliance: GDPR`.

## Code

### Decorator

You can find the full decorator code in the [filter-for-fields-decorator.js](filter-for-fields-decorator.js) file.

The decorator first validates the `fieldsToFilterFor` argument.

Then, the decorator iterates over all the `path` objects within the OpenAPI description. For each `path` object, it iterates over all the HTTP method (e.g. `get`, `post`, etc.) objects.

For each `httpMethodObject`, the decorator checks if it contains all the specified fields, and the field values, you want to filter for.

If the `httpMethodObject` contains all the specified fields and field values, the `httpMethodObject` is kept as is.

Otherwise, the `httpMethodObject` is removed from the `path` object. If the resulting `path` object ends up empty (i.e. all HTTP methods were removed), the entire `path` object is removed from the OpenAPI description.

```javascript
export default function FilterForFields({ severity, ...fieldsToFilterFor }) {
  return {
    // As we are filtering out entire paths, we need to do this at the Root level, and not at the PathItem level.
    // You cannot set a PathItem to null or undefined to remove it.
    Root: {
      leave(node) {
        const fieldsToFilterForIsAValidObject =
          fieldsToFilterFor &&
          typeof fieldsToFilterFor === "object" &&
          !Array.isArray(fieldsToFilterFor) &&
          Object.keys(fieldsToFilterFor).length > 0;

        if (!fieldsToFilterForIsAValidObject) {
          return;
        }

        Object.entries(node.paths).map(([path, pathObject]) => {
          Object.entries(pathObject).map(([httpMethod, httpMethodObject]) => {
            const hasAllDecoratorKeys = Object.entries(fieldsToFilterFor).every(
              ([fieldToFilterFor, fieldValueToFilterFor]) =>
                httpMethodObject.hasOwnProperty(fieldToFilterFor) &&
                httpMethodObject[fieldToFilterFor] === fieldValueToFilterFor,
            );

            if (!hasAllDecoratorKeys) {
              if (Object.keys(pathObject).length === 1) {
                // If there's only one HTTP method, delete the whole path object.
                // Otherwise, the path object will be left as an empty object.
                delete node.paths[path];

                return;
              }

              delete node.paths[path][httpMethod];
            }
          });
        });
      },
    },
  };
}
```

### Plugin

You can find the full plugin code in the [filter-for-fields-plugin.js](filter-for-fields-plugin.js) file.

```javascript
const filterForFieldsDecorator = {
  oas3: {
    "filter-for-fields-decorator": FilterForFields,
  },
};

export default function filterForFieldsPlugin() {
  return {
    id: "filter-for-fields-plugin",
    decorators: filterForFieldsDecorator,
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
      filter-for-fields-plugin/filter-for-fields-decorator:
        public: true
plugins:
  - "./filter-for-fields-plugin.js"
```

## Examples

With the `redocly.yaml` configuration above, an example OpenAPI description (saved within a `api-one-definition.yaml` file), and noting only the `GET /special-events` operation has a `public: true` field, as such:

```yaml
openapi: 3.1.0
info:
  title: Redocly Museum API
  ...
...
paths:
  /special-events:
    post:
      summary: Create special events
      operationId: createSpecialEvent
      ...
    get:
      summary: List special events
      operationId: listSpecialEvents
      public: true
      ...
  ...
...
```

The resulting OpenAPI description (after applying the decorator) would be:

```yaml
openapi: 3.1.0
info:
  title: Redocly Museum API
  ...
...
paths:
  /special-events:
    get:
      summary: List special events
      operationId: listSpecialEvents
      public: true
      ...
  ...
...
```

## Caveats

Yes, it would probably be more OpenAPI specification-compliant to use [tags](https://spec.openapis.org/oas/v3.1.0#tag-object) to group operations, rather than custom fields within operation objects (the OpenAPI specification validation complains about unknown fields). However, for my use case when developing this custom plugin and decorator set, it made more sense to use custom fields.

Currently, this decorator only iterates over `path` objects and their HTTP method objects, and not `webhook` objects (my apologies!).

## References

- Redocly CLI - [filter-in command](https://redocly.com/docs/cli/decorators/filter-in)
- Redocly - [museum-openapi-example openapi.yaml](https://github.com/Redocly/museum-openapi-example/blob/2770b2b2e59832d245c7b0eb0badf6568d7efb53/openapi.yaml)
- OpenAPI specification v3.1.0 - [Tags Object](https://spec.openapis.org/oas/v3.1.0#tag-object)
