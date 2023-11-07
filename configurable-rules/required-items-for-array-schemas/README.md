# Require `items` field for schemas of type `array`

Authors:

- `@tatomyr` Andrew Tatomyr (Redocly)

## What this does and why

When declaring a JSON Schema, it's possible to define an array without specifying what type of items are in the array.
Linting with Redocly tools simply omits this, as it is considered an arbitrary array with any kind of item.
However, to enforce the explicitness, you can use a [configurable rule](https://redocly.com/docs/cli/rules/configurable-rules/).

## Code

Add this to the `rules` section of your `redocly.yaml`:

```yaml
rules:
  rule/required-items-in-array-schemas:
    subject:
      type: Schema
    assertions:
      required:
        - items
    where:
      - subject:
          type: Schema
          property: type
        assertions:
          const: array
    message: The 'items' field is required for schemas of array type.
```

This rule will error if an array is declared without an `items` field.

## Examples

Here's a sample of an OpenAPI description:

```yaml

---
components:
  schemas:
    # This will error
    noItems:
      type: array
    # This will pass
    withItems:
      type: array
      items:
        type: string
```
