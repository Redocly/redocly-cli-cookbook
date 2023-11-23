# Substitute datetime placeholders in an API description

Authors:

- [`@tatomyr`](https://github.com/tatomyr), Andrew Tatomyr (Redocly)

## What this does and why

When an API description includes datetime values, it's nice if they present soon or realistic date values.
This decorator provides the functionality to replace a special datetime placeholder, `$DateTimeNow`, with the current date and time when bundling the API description.
You can also use expressions to add a set number of days to the value, for example `$DateTimeNow + 10 days`.

> [!WARNING]
> Placeholders aren't supported by all OpenAPI tools. Using this approach, you should bundle your OpenAPI to apply the decorators before passing the API description to other tools.

## Code

The `dates-plugin` plugin defines the `decorator` section and the plugin `id`:

```javascript
const updateExampleDates = require("./decorator");

module.exports = {
  id: "dates-plugin",
  decorators: {
    oas3: {
      "update-example-dates": updateExampleDates,
    },
  },
};
```

Here's the main part of the decorator (from `decorator.js`):

```javascript
function updateExampleDates() {
  return {
    // Covers the 'examples' keyword (including examples in the 'components' section)
    Example: {
      enter(example) {
        traverseAndReplaceWithComputedDateTime(example.value);
      },
    },
    // Covers the 'example' in media type objects
    MediaType: {
      enter(mediaTypeObject) {
        if (mediaTypeObject.example) {
          traverseAndReplaceWithComputedDateTime(mediaTypeObject.example);
        }
      },
    },
    // Covers the 'example' in schemas
    Schema: {
      enter(schema) {
        if (schema.example) {
          traverseAndReplaceWithComputedDateTime(schema);
        }
      },
    },
  };
}
```

The decorator operates on the `Example`, `MediaType` and `Schema` nodes to cover the different ways of specifying examples.

The `traverseAndReplaceWithComputedDateTime` function traverses the tree of nodes and replaces the values that contain the specific `$DateTimeNow` variable in examples with a computed datetime value:

```javascript
function traverseAndReplaceWithComputedDateTime(value) {
  if (typeof value === "object" && value !== null) {
    for (const key in value) {
      if (typeof value[key] === "string" && /\$DateTimeNow/.test(value[key])) {
        // Replacing the template with a computed datetime value
        value[key] = computeDateTemplate(value[key]);
      } else {
        traverseAndReplaceWithComputedDateTime(value[key]);
      }
    }
  }
}
```

The `computeDateTemplate` function is a very basic datetime calculator that can only add days to the current date, but it illustrates the idea and you can extend it to meet your own specific needs:

```javascript
function computeDateTemplate(template) {
  const substitutedExpression = template
    .replace("$DateTimeNow", Date.now()) // Replacing the variable with the current date in milliseconds
    .replace(/(\d+)\s*days?/g, (_, t) => t * 1000 * 60 * 60 * 24) // Replacing days with milliseconds
    .trim();
  const calculated = substitutedExpression // A basic calculator
    .split(/\s*\+\s*/)
    .reduce((sum, item) => sum + +item, 0);
  return new Date(calculated).toISOString();
}
```

## Examples

Add the plugin to `redocly.yaml` and enable the decorator:

```yaml
plugins:
  - ./plugin.js

decorators:
  dates-plugin/update-example-dates: on
```

Given the following API description, the decorator will replace `$DateTimeNow` with the current date and `$DateTimeNow + 7d` with the date a week from now:

```yaml
openapi: 3.1.0
paths:
  /date-time:
    get:
      responses:
        200:
          content:
            application/json:
              example:
                somewhere-in-the-past: 2023-11-06T12:00:00.000Z
                today: $DateTimeNow # Will be replaced with the current date
                in-a-week: $DateTimeNow + 7 days # Will be replaced with the date in a week
```

Please note that API descriptions are static text documents, so the dates will get updated only when the description gets bundled.

## References

- [Redocly documentation on examples in OpenAPI](https://redocly.com/docs/openapi-visual-reference/schemas/#example-and-examples)

- [OpenAPI Specification on Media Type Objects](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#media-type-object)
