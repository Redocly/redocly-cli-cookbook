# Spread root-level security to operations after join

Authors:

- [`@Daryna-del`](https://github.com/Daryna-del), Daryna Pastushenko (Redocly)

## What this does and why

When you use `redocly join` to combine multiple API descriptions into one, root-level `security` is not automatically inherited across the joined specs. This is by design — silently applying security requirements from one file to operations defined in another would change their behavior without an explicit declaration.

A common scenario is when one spec (for example, `foo.yaml`) defines shared infrastructure — security schemes and root-level `security` — but has no paths of its own, while another spec (`bar.yaml`) defines all the paths but has no `security` at all. After joining, the operations from `bar.yaml` end up with no security applied.

This decorator (`apply-root-security`) solves that: it reads the root-level `security` from a specified source file (for example `foo.yaml`) and sets it as root-level `security` on the document you are bundling when that document does not already define its own. It runs as a `bundle` step, giving you full control over which file supplies the requirement.

## Code

The following code snippet shows the decorator, in a file named `plugin.js`:

```javascript
export default function plugin() {
  return {
    id: "security-plugin",
    decorators: {
      oas3: {
        'apply-root-security': ({ pathSecurityFile } = {}) => {
          return {
            Root: {
              leave(root, { config }) {
                const doc = resolvePath(pathSecurityFile, config);
                
                if (doc?.security !== undefined || root.security === undefined){
                root.security = doc?.security;
                }

                if (doc.components?.securitySchemes !== undefined) {
                  if (!root.components) {
                    root.components = {};
                  }
                  root.components.securitySchemes = {
                    ...root.components.securitySchemes,
                    ...doc.components.securitySchemes,
                  };
                }
              },
            },
          };
        },
      },
    },
  }
}
```

Put this file alongside your `redocly.yaml` file, and add the following configuration to `redocly.yaml`:

```yaml
plugins:
  - './plugin.js'

decorators:
  security-plugin/spread-root-security:
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

Run:

```bash
redocly bundle bar.yaml -o result.yaml
```

The resulting `result.yaml` will have `security: [oauth2: []]` and `securitySchema` applied.

## References

- [Redocly join command](https://redocly.com/docs/cli/commands/join)
- [Custom decorators in plugins](https://redocly.com/docs/cli/custom-plugins/custom-decorators)
- [Security requirement object (OpenAPI)](https://spec.openapis.org/oas/v3.1.0#security-requirement-object)
