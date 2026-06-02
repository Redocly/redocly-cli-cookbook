# Spread root-level security to operations after join

Authors:

- [`@Daryna-del`](https://github.com/Daryna-del), Daryna Pastushenko (Redocly)

## What this does and why

When you use `redocly join` to combine multiple API descriptions into one, root-level `security` is not automatically inherited across the joined specs. This is by design — silently applying security requirements from one file to operations defined in another would change their behavior without an explicit declaration.

A common scenario is when one spec (for example, `foo.yaml`) defines shared infrastructure — security schemes and root-level `security` — but has no paths of its own, while another spec (`bar.yaml`) defines all the paths but has no `security` at all. After joining, the operations from `bar.yaml` end up with no security applied.

This decorator (`spread-security-to-operations`) solves that: it reads the root-level `security` from a specified source file and applies it to any operation that doesn't already define its own `security`. It runs as a post-join `bundle` step, giving you full control over which security gets applied and where.

## Code

The `security-plugin` plugin defines the `decorator` section and the plugin `id`:

```javascript
import spreadSecurityToOperations from "./decorator";

export default function plugin() {
  return {
    id: "security-plugin",
    decorators: {
      oas3: {
        "spread-security-to-operations": spreadSecurityToOperations,
      },
    },
  };
}
```

Here's the main part of the decorator (from `decorator.js`):

```javascript
export default function spreadSecurityToOperations({ pathSecurityFile } = {}) {
  return {
    Operation: {
      leave(operation, { config }) {
        const absolutePath = path.isAbsolute(pathSecurityFile)
          ? pathSecurityFile
          : path.resolve(path.dirname(config.configPath), pathSecurityFile);
        const doc = yaml.load(fs.readFileSync(absolutePath, 'utf8'));
        
        if (doc?.security === undefined || operation.security !== undefined) return;
        operation.security = doc?.security;
      },
    },
  };
};
```

Put this file alongside your `redocly.yaml` file, and add the following configuration to `redocly.yaml`:

```yaml
plugins:
  - './plugin.js'

decorators:
  security-plugin/spread-security-to-operations:
    pathSecurityFile: ./foo.yaml
```

The `pathSecurityFile` parameter is the path to the spec file that contains the root-level `security` you want to spread.

## Examples

Given two specs:

**foo.yaml** — defines root-level security, no paths:
```yaml
openapi: 3.1.0
info:
  title: Foo
  version: 1.0.0
security:
  - oauth2: []
components:
  securitySchemes:
    oauth2:
      type: oauth2
      flows:
        authorizationCode:
          authorizationUrl: https://example.com/oauth/authorize
          tokenUrl: https://example.com/oauth/token
          scopes: {}
paths: {}
```

**bar.yaml** — defines paths, no security:
```yaml
openapi: 3.1.0
info:
  title: Bar
  version: 1.0.0
paths:
  /pets:
    get:
      summary: Get pets example
      operationId: getPetsExample
      responses:
        '200':
          description: OK
        '400':
          description: Bad request
```

Run the two-step workflow:

```bash
# Step 1: join the specs
redocly join foo.yaml bar.yaml -o joined.yaml

# Step 2: bundle with the decorator to spread security
redocly bundle joined.yaml -o result.yaml
```

The resulting `result.yaml` will have `security: [oauth2: []]` applied to the `/pets` GET operation, because it had no security of its own.

## References

- [Redocly join command](https://redocly.com/docs/cli/commands/join)
- [Custom decorators in plugins](https://redocly.com/docs/cli/custom-plugins/custom-decorators)
- [Security requirement object (OpenAPI)](https://spec.openapis.org/oas/v3.1.0#security-requirement-object)
