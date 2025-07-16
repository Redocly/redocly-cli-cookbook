# Remove extensions

Authors:

- @nicobao (when working full time at @CIDgravity)

## What this does and why

Go through each node of an OpenAPI document, and remove any given [OpenAPI Extensions](https://spec.openapis.org/oas/v3.1.0#specification-extensions) (must start with `x-`).

Why? See <https://github.com/Redocly/redocly-cli/issues/867#issuecomment-1816872180>

## Code

The plugin itself can be found in [`remove-extensions.js'](./remove-extensions.js). The rest of this section shows you how to set up and use the plugin.

Create a `plugin.js` file to refer to this file:

```js
import RemoveExtensions from "./remove-extensions";

/** @type {import('@redocly/cli').DecoratorsConfig} */
const decorators = {
  oas3: {
    "remove-extensions": RemoveExtensions,
  },
};

export default function plugin() {
  return {
    id: "plugin",
    decorators,
  };
}
```

Create/edit `redocly.yaml` as follows (edit with your own settings):

```yml
apis:
  unchanged@latest:
    root: ./petstore.yaml
  with-plugin@latest:
    root: ./petstore.yaml
    decorators:
      plugin/remove-extensions:
        extensions:
          - x-amazon*
          - x-google*
plugins:
  - ./plugin.js
```

Run the `bundle` command to remove all the [GCP](https://cloud.google.com/endpoints/docs/openapi/openapi-extensions) and [AWS](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-swagger-extensions.html) custom OpenAPI extensions from the OpenAPI description:

```bash
redocly bundle with-plugin@latest --output dist/with-plugin.yaml
```

The `extensions` parameter is optional. If empty or not set, it will remove all extensions (elements starting with `x-`). The accepted values for the `extensions` param are:

- `extensions: <regex-valid-extension>`
- `extensions: <list-of-regex-valid-extension>`
- `extensions: <empty>`

Regular expressions follow [Javascript Regex convention](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions).

## Examples

With the same config as above.

Input OpenAPI (`petstore.yaml`):

```yaml
openapi: 3.0.0
info:
  description:
    "This is a sample server Petstore server.  You can find out more about
    Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net,
    #swagger](http://swagger.io/irc/).  For this sample, you can use the api key
    `special-key` to test the authorization filters."
  version: 1.0.2
  title: Swagger Petstore
  termsOfService: http://swagger.io/terms/
  contact:
    email: apiteam@swagger.io
  license:
    name: Apache 2.0
    url: http://www.apache.org/licenses/LICENSE-2.0.html
tags:
  - name: pet
    description: Everything about your Pets
    externalDocs:
      description: Find out more
      url: http://swagger.io
  - name: store
    description: Access to Petstore orders
  - name: user
    description: Operations about user
    externalDocs:
      description: Find out more about our store
      url: http://swagger.io
x-amazon-apigateway-api-key-source: HEADER,
paths:
  /pet:
    post:
      x-google-plugin-key-auth:
        name: key-auth
        enabled: true
      tags:
        - pet
      summary: Add a new pet to the store
      description: ""
      operationId: addPet
      requestBody:
        $ref: "#/components/requestBodies/Pet"
      responses:
        "405":
          description: Invalid input
    put:
      x-google-plugin-key-auth:
        name: key-auth
        enabled: true
      x-internal: true
      tags:
        - pet
      summary: Update an existing pet
      description: ""
      operationId: updatePet
      requestBody:
        $ref: "#/components/requestBodies/Pet"
      responses:
        "400":
          description: Invalid ID supplied
        "404":
          description: Pet not found
        "405":
          description: Validation exception
  /pet/findByStatus:
    get:
      x-google-plugin-key-auth:
        name: key-auth
        enabled: true
      tags:
        - pet
      summary: Finds Pets by status
      description: Multiple status values can be provided with comma separated strings
      operationId: findPetsByStatus
      parameters:
        - name: status
          in: query
          description: Status values that need to be considered for filter
          required: true
          explode: true
          schema:
            type: array
            items:
              type: string
              enum:
                - available
                - pending
                - sold
              default: available
      responses:
        "200":
          description: successful operation
          content:
            application/xml:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/Pet"
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/Pet"
        "400":
          description: Invalid status value
  /pet/findByTags:
    get:
      tags:
        - pet
      summary: Finds Pets by tags
      description:
        Multiple tags can be provided with comma separated strings. Use tag1,
        tag2, tag3 for testing.
      operationId: findPetsByTags
      parameters:
        - name: tags
          in: query
          description: Tags to filter by
          required: true
          explode: true
          schema:
            type: array
            items:
              type: string
      responses:
        "200":
          description: successful operation
          content:
            application/xml:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/Pet"
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/Pet"
        "400":
          description: Invalid tag value
      deprecated: true
  "/pet/{petId}":
    get:
      tags:
        - pet
      summary: Find pet by ID
      description: Returns a single pet
      operationId: getPetById
      parameters:
        - name: petId
          in: path
          description: ID of pet to return
          required: true
          schema:
            type: integer
            format: int64
      responses:
        "200":
          description: successful operation
          content:
            application/xml:
              schema:
                $ref: "#/components/schemas/Pet"
            application/json:
              schema:
                $ref: "#/components/schemas/Pet"
        "400":
          description: Invalid ID supplied
        "404":
          description: Pet not found
externalDocs:
  description: Find out more about Swagger
  url: http://swagger.io
servers:
  - url: https://petstore.swagger.io/v2
components:
  requestBodies:
    Pet:
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/Pet"
        application/xml:
          schema:
            $ref: "#/components/schemas/Pet"
      description: Pet object that needs to be added to the store
      required: true
  schemas:
    Category:
      type: object
      properties:
        id:
          type: integer
          format: int64
        name:
          type: string
      xml:
        name: Category
    Tag:
      type: object
      properties:
        id:
          type: integer
          format: int64
        name:
          type: string
      xml:
        name: Tag
    Pet:
      type: object
      required:
        - name
        - photoUrls
      properties:
        id:
          type: integer
          format: int64
        category:
          $ref: "#/components/schemas/Category"
        name:
          x-internal: true
          type: string
          example: doggie
        photoUrls:
          type: array
          xml:
            name: photoUrl
            wrapped: true
          items:
            type: string
        tags:
          type: array
          xml:
            name: tag
            wrapped: true
          items:
            $ref: "#/components/schemas/Tag"
        status:
          x-internal: true
          type: string
          description: pet status in the store
          enum:
            - available
            - pending
            - sold
      xml:
        name: Pet
```

Output OpenAPI (`with-plugin.yaml`):

```yaml
openapi: 3.0.0
info:
  description:
    "This is a sample server Petstore server.  You can find out more about
    Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net,
    #swagger](http://swagger.io/irc/).  For this sample, you can use the api key
    `special-key` to test the authorization filters."
  version: 1.0.2
  title: Swagger Petstore
  termsOfService: http://swagger.io/terms/
  contact:
    email: apiteam@swagger.io
  license:
    name: Apache 2.0
    url: http://www.apache.org/licenses/LICENSE-2.0.html
tags:
  - name: pet
    description: Everything about your Pets
    externalDocs:
      description: Find out more
      url: http://swagger.io
  - name: store
    description: Access to Petstore orders
  - name: user
    description: Operations about user
    externalDocs:
      description: Find out more about our store
      url: http://swagger.io
paths:
  /pet:
    post:
      tags:
        - pet
      summary: Add a new pet to the store
      description: ""
      operationId: addPet
      requestBody:
        $ref: "#/components/requestBodies/Pet"
      responses:
        "405":
          description: Invalid input
    put:
      x-internal: true
      tags:
        - pet
      summary: Update an existing pet
      description: ""
      operationId: updatePet
      requestBody:
        $ref: "#/components/requestBodies/Pet"
      responses:
        "400":
          description: Invalid ID supplied
        "404":
          description: Pet not found
        "405":
          description: Validation exception
  /pet/findByStatus:
    get:
      tags:
        - pet
      summary: Finds Pets by status
      description: Multiple status values can be provided with comma separated strings
      operationId: findPetsByStatus
      parameters:
        - name: status
          in: query
          description: Status values that need to be considered for filter
          required: true
          explode: true
          schema:
            type: array
            items:
              type: string
              enum:
                - available
                - pending
                - sold
              default: available
      responses:
        "200":
          description: successful operation
          content:
            application/xml:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/Pet"
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/Pet"
        "400":
          description: Invalid status value
  /pet/findByTags:
    get:
      tags:
        - pet
      summary: Finds Pets by tags
      description:
        Multiple tags can be provided with comma separated strings. Use tag1,
        tag2, tag3 for testing.
      operationId: findPetsByTags
      parameters:
        - name: tags
          in: query
          description: Tags to filter by
          required: true
          explode: true
          schema:
            type: array
            items:
              type: string
      responses:
        "200":
          description: successful operation
          content:
            application/xml:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/Pet"
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/Pet"
        "400":
          description: Invalid tag value
      deprecated: true
  "/pet/{petId}":
    get:
      tags:
        - pet
      summary: Find pet by ID
      description: Returns a single pet
      operationId: getPetById
      parameters:
        - name: petId
          in: path
          description: ID of pet to return
          required: true
          schema:
            type: integer
            format: int64
      responses:
        "200":
          description: successful operation
          content:
            application/xml:
              schema:
                $ref: "#/components/schemas/Pet"
            application/json:
              schema:
                $ref: "#/components/schemas/Pet"
        "400":
          description: Invalid ID supplied
        "404":
          description: Pet not found
externalDocs:
  description: Find out more about Swagger
  url: http://swagger.io
servers:
  - url: https://petstore.swagger.io/v2
components:
  requestBodies:
    Pet:
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/Pet"
        application/xml:
          schema:
            $ref: "#/components/schemas/Pet"
      description: Pet object that needs to be added to the store
      required: true
  schemas:
    Category:
      type: object
      properties:
        id:
          type: integer
          format: int64
        name:
          type: string
      xml:
        name: Category
    Tag:
      type: object
      properties:
        id:
          type: integer
          format: int64
        name:
          type: string
      xml:
        name: Tag
    Pet:
      type: object
      required:
        - name
        - photoUrls
      properties:
        id:
          type: integer
          format: int64
        category:
          $ref: "#/components/schemas/Category"
        name:
          x-internal: true
          type: string
          example: doggie
        photoUrls:
          type: array
          xml:
            name: photoUrl
            wrapped: true
          items:
            type: string
        tags:
          type: array
          xml:
            name: tag
            wrapped: true
          items:
            $ref: "#/components/schemas/Tag"
        status:
          x-internal: true
          type: string
          description: pet status in the store
          enum:
            - available
            - pending
            - sold
      xml:
        name: Pet
```

## References

Copyright CIDgravity, @nicobao, 2022.

Copy-pasted from:

- https://github.com/CIDgravity/redoc-plugins
- https://github.com/nicobao/redoc-plugins

This decorator was originally licensed under both the Apache v2 license and the MIT license.
