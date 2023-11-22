# `POST` SHOULD define `requestBody` schema

Authors:

- `@jeremyfiel` Jeremy Fiel (ADP)

## What this does and why

Following the HTTP standard and RESTful API principles, a `POST` request SHOULD include a `requestBody` indicating the contents of the request to the server. In some cases, when using a command pattern (`/actions/{action-id}`), you may allow a `requestBody` to be omitted; this rule provides for the option to ignore a particular uri pattern. The other constraint on this rule is the `deprecated` property should not be defined to avoid linting deprecated endpoints, unnecessarily.

## Code

Add this to the `rules` section of your `redocly.yaml`:

```yaml
rules:
  rule/post-should-define-requestBody:
    severity: error
    message: '"POST" SHOULD define a "requestBody" schema unless using an "actions" pattern'
    subject:
      type: Operation
    where:
      - subject:
          type: PathItem
          matchParentKeys: /^([\w-\{\}/.](?<!/actions))*$/ 
          # here you can define your own uri pattern to ignore if providing a requestBody is not required.
          # The negation happens in this portion of the regex `(?<!/actions)`.
          # The regex takes the entire uri pattern string and then uses a "negative lookbehind" from the end of the string to find the pattern to be negated.
        assertions:
          defined: true
      - subject:
          type: Operation
          filterInParentKeys:
            - post
        assertions:
          disallowed:
            - deprecated
    assertions:
      required:
        - requestBody
```

This rule will error if any URI pattern, other than the ignored pattern, includes a `POST` request without the `requestBody` schema definition.
Note the `where` section is used to filter the rule to only apply to `POST`, non-`deprecated`, and optionally ignored uri patterns.

## Examples

Here's a sample of an OpenAPI description:

Only one error is expected from this example because the second uri includes the `/actions` pattern ignored by the rule.

```yaml
openapi: 3.0.3
info:
  title: Title
  version: 1.0.0
paths:
  /api/v1/thing:
    post:
      summary: a summary
      description: post missing requestBody
      responses:
        "200":
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties: 
                  some_prop:
                    type: string
  /api/v1/thing/{thing-id}/actions/{action-id}:
    post:
      summary: a summary
      description: post missing requestBody
      parameters: 
        - name: thing-id
          in: path
          required: true
          schema:
            type: string
        - name: action-id
          in: path
          required: true
          schema:
            type: string
      responses:
        "200":
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties: 
                  some_prop:
                    type: string
```
