# Operation summary uses sentence casing

Authors:
- [`@TaylorKrusen`](https://github.com/TaylorKrusen) Taylor Krusen (Redocly) 

## What this does and why

**What** -- this rule enforces a consistent patterns of capitalization on Operation summaries.  

**Why** -- "Sentence casing vs title casing" may be the "tabs vs spaces" of the writing world, but being _consistent_ is often more important than being right. At Redocly, we prefer sentence casing for Operation summaries. By adding this configurable rule to our linter, we ensure our entire team writes them that way.

## Code

Here's how the configurable rule looks in the `redocly.yaml` file:

```yaml
rules:  
  rule/operation-summary-sentence-case:
    subject:
      type: Operation
      property: summary
    message: "Operation summary must be sentence cased."
    assertions: 
      pattern: /^[A-Z]+[^A-Z]+$/
```

> [!NOTE]
This rule can be repurposed for other fields with a single sentence, but not multiple sentences.

### Rule explanation
This rule asserts that each Operation `summary` matches the regex defined in `pattern`. The regex we defined matches strings that:
1. Start with an uppercase letter
2. Are followed by 1+ characters that are _not_ uppercase letters
3. End with a character that is _not_ an uppercase letter
  
**Tip**: Building a regex for your own rule? A tool like [regexr](https://regexr.com/) can be quite useful.

## Examples

Summaries _with_ sentence casing (correct):

```yaml
  /zoo-tickets: 
    post:
      summary: Buy zoo tickets
  /zoo-ticket/{ticketId}:    
    get:
      summary: Get zoo ticket
```

Summaries _without_ sentence casing (incorrect):

```yaml
  /zoo-tickets: 
    post:
      summary: Buy Zoo tickets
  /zoo-ticket/{ticketId}:    
    get:
      summary: get Zoo ticket
```

