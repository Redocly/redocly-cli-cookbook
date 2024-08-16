# A suite of sorting decorators

Authors:
- [`@lornajane`](https://github.com/lornajane), Lorna Mitchell (Redocly)
 
## What this does and why

There are lots of reasons that you'd want to alter the order of the items in your API description, such as putting required fields first, or just ordering things alphabetically (or logically!) to make things consistent and easier to find.
When Redocly only made API documentation tools, the sorting changes were made as part of the docs build.
But now we make more complex tools, and many API pipelines have more than just docs in them too - so these operations are more commonly done with a decorator to transform the API description; then it can be used with any tools.

Redocly CLI has some rules about sorting, that these decorators can help to satisfy:

- [`tags-alphabetical`](https://redocly.com/docs/cli/rules/tags-alphabetical/) rule to error if the `tags` section isn't in alphabetical order by `name`.
- [`required-props-first`](https://redocly.com/docs/cli/rules/tags-alphabetical/) rule to error if an object's properties don't put the required fields first.

This plugin includes decorators to make API descriptions match both of these rules.
Here's a full list of the sorting features:

- `methods`: sorts methods consistently (`GET`, `POST`, `PUT`, `PATCH` and `DELETE`, in that order)
- `enums-alphabetical`: sorts the options for an enum field alphabetically
- `properties-alphabetical`: sorts object properties in schemas alphabetically
- `properties-required-first`: puts the required properties at the top of the list (run this _after_ any other property sorting decorators)
- `tags-alphabetical`: sorts tags alphabetically

## Code

Here's the main plugin entrypoint, it's in `sorting.js`:

```javascript
const SortTagsAlphabetically = require('./sort-tags');
const SortEnumsAlphabetically = require('./sort-enums');
const SortMethods = require('./sort-methods');
const SortPropertiesAlphabetically = require('./sort-props-alpha');
const SortPropertiesRequiredFirst = require('./sort-props-required');

module.exports = {
  id: 'sorting',
  decorators: {
    oas3: {
      'tags-alphabetical': SortTagsAlphabetically,
      'enums-alphabetical': SortEnumsAlphabetically,
      'methods': SortMethods,
      'properties-alphabetical': SortPropertiesAlphabetically,
      'properties-required-first': SortPropertiesRequiredFirst,
    }
  }
}
```

Each of the available decorators is in its own file, rather than copying them here, you can view them in the same directory as this `README`:

- [sort-tags.js](./sort-tags.js)
- [sort-enums.js](./sort-enums.js)
- [sort-methods.js](./sort-methods.js)
- [sort-props-alpha.js](./sort-props-alpha.js)
- [sort-props-required.js](./sort-props-required.js)

You can copy or adapt the plugins here to meet your own needs, changing the sorting algorithms or sorting different fields.
The only thing to look out for is that if you need to re-order the properties of an object, then you should visit the _parent_ of the object, and assign the new object to the key that should be updated.

## Examples

Add the plugin to `redocly.yaml` and enable the decorators:

```yaml
plugins:
  - sorting.js

decorators:
  sorting/methods: on
  sorting/tags-alphabetical: on
  sorting/enums-alphabetical: on
  sorting/properties-alphabetical: on
  sorting/properties-required-first: on

```

Run the [bundle command](https://redocly.com/docs/cli/commands/bundle) and the decorators are applied during bundling.
Your command will look something like the following example:

```bash
redocly bundle openapi.yaml -o updated-openapi.yaml
```

Use your favorite "diff" tool to look at the changes made between your existing API description and the updated version.

Remove or turn off any of the decorators that don't fit your use case, and let us know if there are any other sorting features you need by opening an issue on this repository.

## References

* [`tags-alphabetical' rule](https://redocly.com/docs/cli/rules/tags-alphabetical/)
- [`required-props-first`](https://redocly.com/docs/cli/rules/tags-alphabetical/)

