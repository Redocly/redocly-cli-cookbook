# String schemas length defined

Authors:
- [`adamaltman`](https://github.com/adamaltman) Adam Altman (Redocly)
 
## What this does and why

This requires `minLength` and `maxLength` properties set on a `string` where `enum` isn't defined.

## Code

The rule checks that a `string` uses the `minLength` and `maxLength` keywords unless an `enum` is defined.

It does this by using a combination `requireAny` and `mutuallyRequired`.

```yaml
  rule/string-schemas-length-defined:
    subject: 
      type: Schema
    where: 
      - subject: 
          type: Schema
          property: type
        assertions:  
          const: string
    assertions: 
      requireAny: 
        - minLength
        - maxLength
        - enum
      mutuallyRequired: 
        - minLength
        - maxLength
```

## Examples

The following OpenAPI has schemas prefixed with either `Good` or `Bad` to show the configurable rules catch the likely bad uses of keywords.

```yaml
openapi: 3.1.0
info: 
  title: For testing strict string definitions
  version: 1.0.0
paths: {}
components: 
  schemas: 

    LuckyNumber: # should not be caught be these rules
      type: integer

    BadString:
      type: string

    BadStringWithMinLength:
      type: string
      minLength: 1

    BadStringWithMaxLength:
      type: string
      maxLength: 64
    
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
