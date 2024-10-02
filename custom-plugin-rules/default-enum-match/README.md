# Default is an Enum

Authors:
- [@hawkeyexl](https://github.com/hawkeyexl) Manny Silva ([Doc Detective](https://doc-detective.com))

## What this does and why

This rule makes sure that when a schema has both `default` and `enum` properties, the `default` property is set to one of the values in the `enum` array. This is useful for API documentation where you want to make sure that the default value is valid.

## Code

### Redocly config - `redocly.yaml`

Update your Redocly configuration file to include the plugin and rule. Update paths as necessary.

```yaml
plugins:
  - './defaut-enum-plugin.js'

rules:
  openapi-default-enum/default-enum-match: error
```

### Plugin - `defaut-enum-plugin.js`

The plugin defines the rule and returns it. Update paths as necessary.

```js 
const DefaultEnumMatch = require('./default-enum-match');

module.exports = function myRulesPlugin() {
  return {
    id: 'openapi-default-enum',
    rules: {
      oas3: {
        'default-enum-match': RequireBashSample,
      },
    },
  };
};
```

### Rule - `default-enum-match.js`

```js
module.exports = DefaultEnumMatch;

function DefaultEnumMatch() {
  return {
    Schema: {
      enter(schema, ctx) {
        // If enum and default are defined, default must be one of the enum values
        if (
          schema.enum &&
          typeof schema.default != "undefined" &&
          !schema.enum.includes(schema.default)
        ) {
          ctx.report({
            message: `The default value must be one of the enum values.`,
          });
        }
      },
    },
  };
}

```

## Examples

Given an OpenAPI description with the following schema:

```yaml
color:
    type: string
    enum:
      - blue
      - red
      - yellow
    default: green
```

You get the following output:

```text
The default value must be one of the enum values.

50 | color:
51 |     type: string
52 |     enum:
53 |       - blue
54 |       - red
55 |       - yellow
56 |     default: green

Error was generated by the openapi-default-enum/default-enum-match rule.
```