# `GET` SHOULD NOT define `requestBody` schema

Authors:

- `@jeremyfiel` Jeremy Fiel (ADP)

## What this does and why

Following the HTTP standard and RESTful api principles, a `GET` operation SHOULD NOT include a `requestBody` in an attempt to modify a resource on the server, [RFC9110][1].

## Code

Add this to the `rules` section of your `redocly.yaml`:

```yaml
rules:
  rule/get-should-not-define-requestBody:
    severity: warn
    message: '"GET" SHOULD NOT define a "requestBody" schema'
    subject:
      type: Operation
      filterInParentKeys:
        - get
    assertions:
      disallowed:
        - requestBody

```

This rule will warn if any `PathItem` includes a `GET` operation with a `requestBody` schema definition.

## Examples

Here's a sample of an OpenAPI description:

```yaml
openapi: 3.0.3
info:
  title: Title
  version: 1.0.0
paths:
  /api/v1/thing/{thing-id}:
    get:
      summary: a summary
      description: get with requestBody
      parameters:
        - name: thing-id
          in: path
          required: true
          schema:
            type: string
      requestBody: # <- This will error
        description: a request body for my get operation
        content:
          'application/json':
            schema:
              type: object
              properties:
                some_prop:
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
[1]: https://www.rfc-editor.org/rfc/rfc9110#section-9.3.1-6 "RFC9110"