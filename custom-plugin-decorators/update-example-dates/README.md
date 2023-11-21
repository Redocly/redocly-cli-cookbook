# Decorator to substitute date templates in an API description

Authors:

- [`@tatomyr`](https://github.com/tatomyr), Andrew Tatomyr (Redocly)

## What this does and why

When rendering an API description it might be useful to use current dates in examples.
Let's say, we want to use a special datetime template, like `$DateTimeNow + 10 days` where the `$DateTimeNow` variable stands for the current date. Also, let's use only the `+` operator for the sake of simplicity.

This decorator provides functionality to substitute the basic date templates with the actual values when bundling an API description.

## Code

The `date-time` plugin only defines the `decorator` section and the plugin `id`:

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

Here's the main part of the decorator:

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

It operates on the `Example`, `MediaType` and `Schema` nodes to cover the different ways of specifying examples (see the [specification](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#media-type-object)).

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

In this example we'll consider a very basic datetime calculator that can only add days to the current date, but it should be enough to illustrate the idea:

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

Given the following API description, the decorator will replace `$DateTimeNow` with the current date and `$DateTimeNow + 7d` with the date in a week:

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
