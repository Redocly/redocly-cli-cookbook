# Variant of the `operation-operationId` rule that excludes `OPTIONS` operations

Author:
- [@nickcorby](https://github.com/nickcorby)

## What this does and why

This rule extends the built-in rule [operation-operationId](https://redocly.com/docs/cli/rules/oas/operation-operationId) by filtering out set operations e.g. `OPTIONS`.

This rule can be tweaked to exclude any combination of operations, or inversely to **include** set operations. 

## Code

> If you are using a ruleset that includes the `operation-operationId` rule (like `recommended`), you will need to disable this rule in order for the configurable rule to apply.
> 
> e.g. if your `redocly.yaml` file contains:
>
> ```yaml
> extends:
>   - recommended
> ```
> You will need to include the following snippet in the `rules` property:
>
> ```yaml
>   rules:
>     operation-operationId: off
> ```

This rule is added to your `redocly.yaml` file:

```yaml
rule/operation-operationId-exclude-OPTIONS:
  subject:
    type: Operation
    filterOutParentKeys:
      - options
  assertions:
    required:
      - operationId
  message: Operation is missing 'operationId' property.
  severity: error
```

The `filterOutParentKeys` property allows you to define which operations you would like to exclude from the rule:

```yaml
    type: Operation
    filterOutParentKeys:
      - options
```

This can be extended to multiple operations:

```yaml
    type: Operation
    filterOutParentKeys:
      - options
      - delete
```

Alternatively, you can use the `filterInParentKeys` property to define which operations you would like to include in the rule:

```yaml
    type: Operation
    filterInParentKeys:
      - get
      - post
```

## Examples

With the rule configured with `severity: error`, the following snippet of a `GET` operation will trigger this rule & display an error:

```yaml
get:
  tags:
  - Endpoint
  summary: "Example endpoint."
  parameters:
  - name: "Authorization"
    in: "header"
    description: "Auth Token"
    required: true
    schema:
      type: "string"
  responses:
    "200":
      description: "200 response"
      headers:
        Access-Control-Allow-Origin:
          schema:
            type: "string"
      content:
        application/json:
          schema:
            $ref: ../models/200Response.yaml
    "400":
      description: "400 response"
      headers:
        Access-Control-Allow-Origin:
          schema:
            type: "string"
      content:
        application/json:
          schema:
            $ref: ../models/ErrorResponse.yaml
  security:
  - Authorizer: []
  - api_key: []
```

However, the following snippet of an `OPTIONS` operation **won't** trigger the rule:

```yaml
options:
  tags:
  - Endpoint
  summary: "Example endpoint."
  parameters:
  - name: "Authorization"
    in: "header"
    description: "Auth Token"
    required: true
    schema:
      type: "string"
  responses:
    "200":
      description: "200 response"
      headers:
        Access-Control-Allow-Origin:
          schema:
            type: "string"
      content:
        application/json:
          schema:
            $ref: ../models/200Response.yaml
    "400":
      description: "400 response"
      headers:
        Access-Control-Allow-Origin:
          schema:
            type: "string"
      content:
        application/json:
          schema:
            $ref: ../models/ErrorResponse.yaml
  security:
  - Authorizer: []
  - api_key: []
```

## References

Assisted by [AlbinaBlazhko17](https://github.com/AlbinaBlazhko17)
