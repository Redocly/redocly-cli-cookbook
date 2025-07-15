# Swap the summary and description fields

Authors:

- [`@lornajane`](https://github.com/lornajane), Lorna Mitchell (Redocly)

## What this does and why

We sometimes see API descriptions with the fields mixed up.
The most common of these is the `summary` and `description` fields on Operations in OpenAPI, some generators seem to produce the fields with the content reversed.

- Summary: used when the operations are displayed in a list, it should be a very short phrase to describe the operation.
- Description: used to supply more detail, used when the operation is displayed in detail. The description field also suports Markdown.

This decorator takes the content of both fields and (as long as there is some content in the description field), swaps them over.

## Code

The following code snippet shows the decorator, in a file named `swap-fields.js`:

```js
export default function plugin() {
  id: "swap-fields",
  decorators: {
    oas3: {
      "summary-description": () => {
        return {
          Operation: {
            leave(target) {
              let description = "";
              let summary = "";
              if (target.description) {
                description = target.description
              }
              if (target.summary) {
                summary = target.summary
              }

              // only swap them if there is some description content
              if(description.length > 0){
                target.description = summary;
                target.summary = description;
              }
            },
          },
        };
      },
    },
  },
};
```

Put this file alongside your `redocly.yaml` file, and add the following configuration to `redocly.yaml`:

```yaml
plugins:
  - swap-fields.js

decorators:
  swap-fields/summary-description: on
```

When you run `redocly bundle`, the API description(s) will have their field order updated.

## Examples

Before the change (a tiny snippet from the [GitHub API Reference](https://github.com/github/rest-api-description) where I initially spotted this problem) with an OpenAPI structure around it:

```yaml
openapi: 3.1.0
info:
  version: 1.1.4
  title: GitHub v3 REST API
  description: GitHub's v3 REST API.
  license:
    name: MIT
    url: https://spdx.org/licenses/MIT
  termsOfService: https://docs.github.com/articles/github-terms-of-service
  contact:
    name: Support
    url: https://support.github.com/contact?tags=dotcom-rest-api
webhooks:
  branch-protection-configuration-disabled:
    post:
      summary: |-
        This event occurs when there is a change to branch protection configurations for a repository.
        For more information, see "[About protected branches](https://docs.github.com/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)."
        For information about using the APIs to manage branch protection rules, see "[Branch protection rule](https://docs.github.com/graphql/reference/objects#branchprotectionrule)" in the GraphQL documentation or "[Branch protection](https://docs.github.com/rest/branches/branch-protection)" in the REST API documentation.

        To subscribe to this event, a GitHub App must have at least read-level access for the "Administration" repository permission.
      description: All branch protections were disabled for a repository.
      operationId: branch-protection-configuration/disabled
      requestBody:
        required: true
        content:
          application/json:
            schema:
              "$ref": "#/components/schemas/webhook-branch-protection-configuration-disabled"
      responses:
        "200":
          description:
            Return a 200 status to indicate that the data was received
            successfully

components:
  schemas:
    webhook-branch-protection-configuration-disabled:
      title: branch protection configuration disabled event
      type: object
      properties:
        action:
          type: string
          enum:
            - disabled
```

After the decorator has been run, the updated file looks like the following example:

```yaml
openapi: 3.1.0
info:
  version: 1.1.4
  title: GitHub v3 REST API
  description: GitHub's v3 REST API.
  license:
    name: MIT
    url: https://spdx.org/licenses/MIT
  termsOfService: https://docs.github.com/articles/github-terms-of-service
  contact:
    name: Support
    url: https://support.github.com/contact?tags=dotcom-rest-api
webhooks:
  branch-protection-configuration-disabled:
    post:
      summary: All branch protections were disabled for a repository.
      description: |-
        This event occurs when there is a change to branch protection configurations for a repository.
        For more information, see "[About protected branches](https://docs.github.com/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)."
        For information about using the APIs to manage branch protection rules, see "[Branch protection rule](https://docs.github.com/graphql/reference/objects#branchprotectionrule)" in the GraphQL documentation or "[Branch protection](https://docs.github.com/rest/branches/branch-protection)" in the REST API documentation.

        To subscribe to this event, a GitHub App must have at least read-level access for the "Administration" repository permission.
      operationId: branch-protection-configuration/disabled
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/webhook-branch-protection-configuration-disabled"
      responses:
        "200":
          description: Return a 200 status to indicate that the data was received successfully
components:
  schemas:
    webhook-branch-protection-configuration-disabled:
      title: branch protection configuration disabled event
      type: object
      properties:
        action:
          type: string
          enum:
            - disabled
```

You could also edit the plugin to make other field changes as you need.

## References

- [GitHub REST API descriptions](https://github.com/github/rest-api-description)
- [OpenAPI reference](https://spec.openapis.org/oas/latest.html)
