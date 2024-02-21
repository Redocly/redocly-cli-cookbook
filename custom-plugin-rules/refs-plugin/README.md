# Inspect $refs usage in an OpenAPI description

Authors:

- [`@tatomyr`](https://github.com/tatomyr) Andrew Tatomyr (Redocly)

## What this does and why

Dealing with $refs might be quite a challenge sometimes.
This plugin introduces a few rules that could give insights into how the $refs are used.

### No $refs siblings

OpenAPI specification generally is somewhat intricate about the $refs usage.
Particularly, OAS 3.0 does not allow siblings to $refs at all, while OAS 3.1 allows $ref objects to contain `description` and `summary` properties.

On the other hand, Schema objects could contain the `$ref` property, and the applications have to decide how to merge the properties (see the [JSON Schema Draft](https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-00#section-7.7.1.1)).
Again, depending on the draft version, the `$ref` property could be the only property in the Schema object (specifically in Draft 4-7, all other properties are ignored), or it could be combined with other properties (in the newer versions).

This rule aims at OAS 3.1 and checks that there are no other properties in Reference objects except for `description` and `summary`.

Note that this particular rule is a simple example. For checking all complex cases, the rule should be adjusted appropriately.

### No circular $refs

Although the OpenAPI specification allows circular references, sometimes they cause unexpected issues, so it is helpful to be able to trace them.
This rule highlights $refs with circular references.

Also, this rule calculates the depth of the $refs tree and prints it out after the linting is done.

## Code

The `no-refs-siblings` rule runs the `ref` visitor on every node containing a reference to check whether it contains any other property except for `description`, `summary`, and the `$ref` itself.
If it does, the rule reports an error:

```js
function NoRefsSiblings() {
  return {
    ref: {
      enter(node, { report, location }) {
        const { $ref, description, summary, ...ignored } = node;
        for (const prop of Object.keys(ignored)) {
          report({
            message: `Ignored property found in Reference Object: ${prop}`,
            location: location.child(prop).key(),
          });
        }
      },
    },
  };
}
```

The `no-circular-refs` rule visits every `ref` node twice: on entering and on leaving.

On entering, it adds the current node pointer (which unambiguously identifies the node location) to the `pointers` array and checks whether it already contains that value.
If it does, it means there's already a node somewhere above that contains a reference to this particular node.
Also, it increments the `depth` counter and updates the `maxDepth` value if necessary.

On leaving, it removes the current node from the `refs` array and decrements the `depth` counter.

Finally, when the `Root` node is left, the rule prints out the maximum depth of the $refs tree:

```js
function NoCircularRefs() {
  let depth = 0;
  let maxDepth = 0;
  const pointers = new Set();

  return {
    ref: {
      enter(node, { location, report }) {
        depth++;
        maxDepth = Math.max(maxDepth, depth);
        const thisPointer = location.source.absoluteRef + node.$ref;
        if (pointers.has(thisPointer)) {
          report({
            message: `Circular reference detected: ${thisPointer}`,
            location: location.child("$ref"),
          });
        } else {
          pointers.add(thisPointer);
        }
      },
      leave(node, { location }) {
        depth--;
        const thisPointer = location.source.absoluteRef + node.$ref;
        pointers.delete(thisPointer);
      },
    },
    Root: {
      leave(node, ctx) {
        setTimeout(() => {
          process.stdout.write(`\n\nMaximum $refs depth is ${maxDepth} \n\n`);
        });
      },
    },
  };
}
```

That works because of the way Redocly CLI applies visitors to document's nodes.
It starts by entering the first node (Root), then goes down to the deepest node trying to resolve the $refs tree, then bubbles up in reverse order, and finishes by leaving the same root node it has started from.

## Examples

Given the following OpenAPI description, you'll get the errors about possibly ignored `foo` property and the circular reference in the `surroundingLocations` property:

```yaml
openapi: 3.1.0
info:
  title: Refs test
  version: 1.0.0
paths:
  /event-locations:
    get:
      responses:
        200:
          description: Success
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/LocationsList"
components:
  schemas:
    LocationsList:
      type: array
      items:
        $ref: "#/components/schemas/EventLocation"
        foo: Ignored property # <- error
    EventLocation:
      type: object
      description: Circular!
      properties:
        name:
          type: string
        surroundingLocations:
          description: Allowed field.
          $ref: "#/components/schemas/LocationsList" # <- circular reference
```

Make sure to import the plugin and turn on the rules in your `redocly.yaml` file:

```yaml
plugins:
  - refs-plugin.js
rules:
  refs-plugin/no-refs-siblings: warn
  refs-plugin/no-circular-refs: warn
```

## References

- [Reference object](https://spec.openapis.org/oas/v3.1.0#reference-object).
- [How to use JSON references ($refs)](https://redocly.com/docs/resources/ref-guide/).
- [Siblings to $refs](https://redocly.com/docs/resources/all-of/#siblings-to-ref-s).
- [JSON Schemas $ref](https://json-schema.org/understanding-json-schema/structuring#dollarref).
- [JSON Schema Draft on Schema objects containing $refs](https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-00#section-7.7.1.1).
