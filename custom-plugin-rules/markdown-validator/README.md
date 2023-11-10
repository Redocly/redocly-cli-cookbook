# Validate Markdown descriptions

Authors:
- [`@lornajane`](https://github.com/lornajane) Lorna Mitchell (Redocly)
 

## What this does and why

Writing Markdown within YAML/JSON can be awkward, and our usual Markdown tooling may not be available. This plugin adds a rule that uses a third-party Markdown validator library, the excellent [markdownlint](https://github.com/DavidAnson/markdownlint), to pick the `description` fields from your OpenAPI description, and make sure it's valid. This can really help to catch typos and formatting problems, especially in longer descriptions or large APIs.

By using an existing library, we get all the power and configurability of this specialist tool, and so you can edit and adapt this plugin to meet your own Markdown preferences.

## Code

This rule is built on the `markdownlint` library, so we need a `package.json` file to specify the dependency:

```json
{
  "name": "redocly-openapi-markdown-plugin",
  "version": "1.0.0",
  "description": "",
  "main": "openapi-markdown.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "MIT",
  "dependencies": {
    "markdownlint": "^0.31.1"
  }
}
```

Make sure to install the dependency using your favorite package manager. For example I use `npm` so my installation command is:

```
npm install
```

The entry point for the plugin code is in `openapi-markdown.js`:

```js
const ValidateMarkdown = require('./rule-validate-markdown.js');

module.exports = {
  id: 'openapi-markdown',
  rules: {
    oas3: {
      'validate': ValidateMarkdown,
    }
  }
	
}
```

The rule itself is in `rule-validate-markdown.js`:

```js
module.exports = ValidateMarkdown
const markdownlint = require("markdownlint");
const config = {
  // the list is here https://github.com/DavidAnson/markdownlint#rules--aliases
  MD013: {line_length: 120},
  MD041: false, // first line should be h1
  MD047: false, // should end with newline
}

function checkString(description, ctx) {
  let options = {
    "strings": {
      "desc": description
    },
    "config": config
  };
  markdownlint(options, function callback(err, result) {
    if (!err) {
      // if there's no problem do nothing
      if (result.desc.length) { // desc is the key in the options.strings object
        let lines = description.split("\n");

        result.desc.forEach((desc) => {
          message = desc.ruleDescription;
          // add line number context for longer entries
          if (desc.lineNumber > 1 ) {
            message = message + " (near: " + lines[desc.lineNumber].substring(0,20) + "... )";
          }

          ctx.report({
            message: message,
            location: ctx.location.child('description'),
          });
        });

      }
    }
  });
}

function ValidateMarkdown() {
  console.log("OpenAPI Markdown: validate");
  return {
   Info: {
      enter(target, ctx) {
        if(target["description"]) {
          return checkString(target["description"], ctx);
          
        }
      }
    },
   Operation: {
      enter(target, ctx) {
        if(target["description"]) {
          return checkString(target["description"], ctx);
          
        }
      }
    },
   Parameter: {
      enter(target, ctx) {
        if(target["description"]) {
          return checkString(target["description"], ctx);
          
        }
      }
    },
    Tag: {
      enter(target, ctx) {
        if(target["description"]) {
          return checkString(target["description"], ctx);
          
        }
      }
    },
  }
}
```

To control the markdown validation rules in use, edit the config at the top of the file. 

Bring the plugin into your `redocly.yaml` file like this:

```yaml
plugins:
  - 'plugins/openapi-markdown.js'

rules:
  openapi-markdown/validate: warn
```

When you lint your API descriptions, you'll see warnings for any invalid markdown found in the description fields.

## Examples

Given an OpenAPI description with these opening lines:

```yaml
openapi: 3.1.0
info: 
  title: Redocly Museum API
  description: |-
    A fake, but awesome Museum API for interacting with museum services and information.


    ## Made by Redocly
    Built with love by [Redocly](https://redocly.com).
  version: 1.0.0
```

Linting (with `--format=stylish` for brevity) produces the following output:

```
validating museum.yaml...
OpenAPI Markdown: validate
museum.yaml:
  4:16  warning  openapi-markdown/validate  Multiple consecutive blank lines (near: ## Details... )
  4:16  warning  openapi-markdown/validate  Headings should be surrounded by blank lines (near: Built with love by [... )

museum.yaml: validated in 70ms

Woohoo! Your API description is valid. 🎉
You have 2 warnings.
```

You can configure markdownlint to pick up (or ignore) any aspects of markdown that it knows about.

## References

Built on [markdownlint](https://github.com/DavidAnson/markdownlint).
