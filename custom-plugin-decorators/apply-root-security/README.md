# Apply root-level security

Authors:

- [`@Daryna-del`](https://github.com/Daryna-del), Daryna Pastushenko (Redocly)

## What this does and why

When you use `redocly join` to combine multiple API descriptions into one, root-level `security` is not automatically inherited across the joined specs. This is by design — silently applying security requirements from one file to operations defined in another would change their behavior without an explicit declaration.

A common scenario is when one spec (for example, `foo.yaml`) defines shared infrastructure — security schemes and root-level `security` — but has no paths of its own, while another spec (`bar.yaml`) defines all the paths but has no `security` at all. After joining, the operations from `bar.yaml` end up with no security applied.

This decorator (`apply-root-security`) solves that: it reads the root-level `security` from a specified source file (for example `foo.yaml`) and sets it as root-level `security` on the document you are bundling when that document does not already define its own. It runs as a `bundle` step, giving you full control over which file supplies the requirement.

## Code

The `security-plugin` plugin defines the `decorator` section and the plugin `id`:

```javascript
export default function plugin() {
  return {
    id: "security-plugin",
    decorators: {
      oas3: {'apply-root-security': applyRootSecurity },
    },
  }
}
```

Here's the main part of the decorator (from `decorator.js`):

```javascript
export const applyRootSecurity = ({ pathSecurityFile } = {}) => {
  return {
    Root: {
      leave(root, { config }) {
        const doc = resolvePath(pathSecurityFile, config);

        mergeSecurityRequirements(root, doc);
        mergeSecuritySchemes(root, doc);
      },
    },
  };
};
```

The `resolvePath` function resolves the path to the security file and returns its parsed content:

```javascript
function resolvePath(pathSecurityFile, config) {
  const base = config.configPath ? path.dirname(config.configPath) : process.cwd();
  const absolutePath = path.isAbsolute(pathSecurityFile) ? pathSecurityFile : path.resolve(base, pathSecurityFile);
  return yaml.load(fs.readFileSync(absolutePath, 'utf8'));
};
```

The `mergeSecurityRequirements` function appends root-level security requirements from the source file into the target document. If the target already has security requirements defined, the entries are appended rather than replaced:

```javascript
function mergeSecurityRequirements(target, source){
  if (!Array.isArray(source?.security) 
    || JSON.stringify(target.security) === JSON.stringify(source?.security)) return;
  target.security = [...(target.security || []), ...source.security]; 
};
```

The `mergeSecuritySchemes` function merges the security scheme definitions from the source file into `components.securitySchemes` on the target document. If the target already has schemes defined, they are preserved and the new ones are added alongside them:

```javascript
function mergeSecuritySchemes(target, source) {
  if (source?.components?.securitySchemes === undefined) return;
  if (!target.components) target.components = {};
  target.components.securitySchemes = {
    ...target.components.securitySchemes,
    ...source.components.securitySchemes,
  };
};
```

Add the following to `redocly.yaml`:

```yaml
plugins:
  - './plugin.js'

decorators:
  security-plugin/apply-root-security:
    pathSecurityFile: ./foo.yaml
```

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

`result.yaml` will have `security: [{oauth2: []}]` and `components.securitySchemes.oauth2` applied.

## References

- [Redocly join command](https://redocly.com/docs/cli/commands/join)
- [Custom decorators in plugins](https://redocly.com/docs/cli/custom-plugins/custom-decorators)
- [Security requirement object (OpenAPI)](https://spec.openapis.org/oas/v3.1.0#security-requirement-object)
