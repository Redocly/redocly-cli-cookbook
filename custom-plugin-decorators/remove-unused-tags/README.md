# Remove unused tags

Authors:
- [`@lornajane`](https://github.com/lornajane), Lorna Mitchell (Redocly)
 

## What this does and why

A custom plugin with a decorator that looks at each operation in the API description, and counts how many times each tag is used. Any that are not used by any operation are removed.

There is support for an array of tags to ignore; these tags won't be removed from the API description even if they are unused.

This is a useful decorator to use when you are reducing a larger OpenAPI file for a specific output case. Using the [filter-out decorator](https://redocly.com/docs/cli/decorators/filter-out/) for example can leave tags that are no longer needed.

## Code

The plugin code itself is in `tags.js`:

```js
module.exports = {
  id: "tags",
  decorators: {
    oas3: {
      "no-unused-tags": ({ ignore }) => {
        console.log("Checking for unused tags...");
        return {
          Root: {
            // need the whole document for this
            leave(target, ctx) {
              // case-insensitive so use lowercase
              let tagsToIgnore = [];
              if (ignore instanceof Array) {
                for (i = 0; i < ignore.length; i++) {
                  tagsToIgnore.push(ignore[i].toLowerCase());
                }
              }

              // create an array of tags to keep score
              let tags = [];

              for (p in target.paths) {
                // foreach endpoint
                for (operation in target.paths[p]) {
                  // foreach operation
                  for (t in target.paths[p][operation]["tags"]) {
                    // foreach tag
                    let opTag =
                      target.paths[p][operation]["tags"][t].toLowerCase();
                    // count the occurrences
                    if (tags[opTag]) {
                      tags[opTag] = tags[opTag] + 1;
                    } else {
                      tags[opTag] = 1;
                    }
                  }
                }
              }

              let indicesToRemove = [];
              for (tagIndex in target.tags) {
                let tagName = target.tags[tagIndex].name.toLowerCase();
                // if it's on the ignore list, do nothing
                if (tagsToIgnore.includes(tagName)) {
                  continue;
                }

                // otherwise if unused, add to list for removal
                if (tags[tagName] > 0) {
                } else {
                  console.log("Removing unused tag " + tagName);
                  indicesToRemove.push(tagIndex);
                }
              }

              // count backwards to avoid index shifting
              for (let i = indicesToRemove.length - 1; i >= 0; i--) {
                target.tags.splice(indicesToRemove[i], 1);
              }

              return target;
            },
          },
        };
      },
    },
  },
};
```

In summary, this code does the following:

1. Convert the supplied `ignore` array to all be lowercase, so that we can be case-insensitive.

2. Evaluate the whole document so that we can pick out the operations and tags information needed.

3. Check each operation and record all the tags that are used.

4. Compare this list with the tags declared in the OpenAPI document, and identify any that are unused and not marked to ignore.

5. Removes the marked tags.

6. Return the updated OpenAPI data.

To use the custom decorator, add configuration like the following to the `redocly.yaml` file:

```yaml
plugins:
  - './tags.js'

decorators:
  tags/no-unused-tags: on
```

If there are tags that should be preserved even though they are unused, add them to the ignore list:

```yaml
plugins:
  - './tags.js'

decorators:
  tags/no-unused-tags:
    ignore:
      - extra
      - KeepMe
```

Apply the decorator by running the bundle command:

```bash
redocly bundle openapi.yaml -o openapi-tidy.yaml
```

The new file `openapi-tidy.yaml` contains the API description with only the in-use tags included.

The checking is case-insensitive (it seems more likely to mistype a tag's case than to intentionally have two tags named the same with different case - although I'm sure both exist somewhere!).

## Examples

Start by adding the decorator to `redocly.yaml` and including some ignore settings:

```yaml
plugins:
  - './tags.js'

decorators:
  tags/no-unused-tags:
    ignore:
      - extra
      - KeepMe
```

Given an API description that uses only the `Events` and `Tickets` tags, the tags section would be transformed to remove the other tags.

**Before bundling/decorating**:

```yaml
tags:
  - name: Tickets
    description: Museum tickets for general entrance or special events.
  - name: Extraneous
    description: This tag isn't used by any of the endpoints, so that should be detected and corrected.
  - name: Extra
    description: This tag isn't used by any of the endpoints, but we're keeping it anyway.
  - name: Events
    description: Special events hosted by the Museum
```

Run the decorator and observe the API description tags section **after bundling/decorating**:

```yaml
tags:
  - name: Tickets
    description: Museum tickets for general entrance or special events.
  - name: Extra
    description: This tag isn't used by any of the endpoints, but we're keeping it anyway.
  - name: Events
    description: Special events hosted by the Museum
```

Use this decorator to tidy up when leftover tags remain in an OpenAPI description.

## References

- Inspired by [issue #953 on Redocly CLI](https://github.com/Redocly/redocly-cli/issues/953).
