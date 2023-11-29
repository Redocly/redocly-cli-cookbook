# Decorator to add x-openai-isConsequential tag to GET operations

Authors:

- [`@adamaltman`](https://github.com/adamaltman), Adam Altman (Redocly)

## What this does and why

OpenAI Actions uses OpenAPI to enable GPTs to make API calls.

It has support for a [consequential flag](https://platform.openai.com/docs/actions/consequential-flag):

> If the field isn't present, we default all GET operations to false and all other operations to true

If you want to set the GET operations to true too, then this decorator is for you.

## Code

The code is entirely in `openai-is-consequential.js`:

```javascript
module.exports = {
  id: "openai-plugin",
  decorators: {
    oas3: {
      "is-consequential": OpenAIConsequential,
    },
  },
};

/** @type {import('@redocly/cli').OasDecorator} */
function OpenAIConsequential() {
  return {
    PathItem(PathItem) {
      if (PathItem["get"]) {
        PathItem["get"]["x-openai-isConsequential"] = true;
      }
    },
  };
}
```

The code sets the plugin name to `openai-plugin` and adds a decorator named `is-consequential`.

It operates on the `PathItem` element (in OpenAPI 3.x descriptions).

The conditional logic applies to `get` operations. Modify the `if` statement if you want to target different operations.

## Examples

Add the plugin to `redocly.yaml` and enable the decorator:

```yaml
plugins:
  - ./openai-is-consequential.js

decorators:
  openai-plugin/is-consequential: on
```

Here is an example of an operation before and after:

**Before**:

```yaml
/aml-settings:
  get:
    summary: Retrieve AML settings
    operationId: GetAmlSettings
    x-sdk-operation-name: getAmlSettings
    description: Retrieves AML settings.
    responses:
      "200":
        description: AML settings retrieved.
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/AmlSettings"
      "401":
        $ref: "#/components/responses/Unauthorized"
      "403":
        $ref: "#/components/responses/Forbidden"
      "404":
        $ref: "#/components/responses/NotFound"
```

**After**:

```yaml
/aml-settings:
  get:
    summary: Retrieve AML settings
    operationId: GetAmlSettings
    x-sdk-operation-name: getAmlSettings
    description: Retrieves AML settings.
    responses:
      "200":
        description: AML settings retrieved.
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/AmlSettings"
      "401":
        $ref: "#/components/responses/Unauthorized"
      "403":
        $ref: "#/components/responses/Forbidden"
      "404":
        $ref: "#/components/responses/NotFound"
    x-openai-isConsequential: true
```

🎉 Notice `x-openai-isConsequential: true` at the last line of the after example.

## References

- [`x-openai-isConsequential' flag](https://platform.openai.com/docs/actions/consequential-flag)
- The [`PathItem` types documentation](https://redocly.com/docs/openapi-visual-reference/path-item/#types)
