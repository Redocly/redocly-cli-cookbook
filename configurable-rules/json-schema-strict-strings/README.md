# JSON Schema strict strings

Authors:
- [`adamaltman`](https://github.com/adamaltman) Adam Altman (Redocly)
 
## What this does and why

This requires `minLength` and `maxLength` properties set on a `string` where `enum` isn't defined.

## Code

The first rule checks that a string uses the `minLength` and `maxLength` keywords unless an `enum` is defined.
```yaml
  rule/json-schema-string-has-min-and-max-length:
    subject: 
      type: Schema
    where: 
      - subject: 
          type: Schema
          property: type
        assertions:  
          const: string
      - subject: 
          type: Schema
          property: enum
        assertions: 
          defined: false        
    assertions: 
      required: 
        - minLength
        - maxLength
```

## Examples

The following OpenAPI has schemas prefixed with either `Good` or `Bad` to show the configurable rules catch the likely bad uses of keywords.

```yaml
openapi: 3.1.0
info: 
  title: Unintended schema misconfigurations
  version: 1.0.0
paths: {}
components: 
  schemas: 

    BadString:
      type: string

    GoodStringBecauseEnum:
      type: string
      enum:
        - ABC
        - DEF
        - GHI
        
    GoodStringBecauseMinAndMaxLength:
      type: string
      minLength: 1
      maxLength: 64
```


## References

Inspired by a question from Keith F. 
