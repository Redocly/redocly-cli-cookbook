# Check code sample coverage

Authors:
- Laura Rubin (@SansContext)  (with great help from Manny Silva in the Write the Docs Slack)

## What this does and why

This rule checks to see if each operation has examples for a static set of specified languages. In the original case, I have six languages that we try to cover for example code samples, and it's helpful to know which routes are missing which samples, so I can prioritize and burn down patching them.

This loads the `lang:` fields specified in the `x-code-samples` array, and then compares those languages to a `const` list of languages that you specify in the top of `check-sdk-coverage.js`. If you have different wording or different SDKs, you can add those here.

You probably want to set these to `warn` if you think you're going to have a lot of them.

**Tip**: you might want to use these in conjunction with a configurable rule that checks if you even _have_ an `x-code-samples` array...

```yaml
rule/x-code-samples-exist:
    subject:
      type: Operation
      property: x-code-samples
    assertions:
      defined: true
    message: "Each path must have an x-code-samples object."
    severity: warn
```

## Code

### Plugin - `x-code-sample-checks.js`

```js 
const CheckSDKCoverage = require('./rules/check-sdk-coverage.js');

module.exports = function myRulesPlugin() {
  return {
    id: 'x-code-samples-check',
    rules: {
      oas3: {
        'check-sdk-coverage': CheckSDKCoverage
      },
    },
  };
};
```


### Rule - Check SDK Coverage

```js
module.exports = CheckSDKCoverage;

const sdkLanguages = ['bash', 'javascript', 'python', 'ruby', 'java', 'kotlin'];

function CheckSDKCoverage () {
    return {
        XCodeSampleList: {
          enter(codeSampleList, ctx) {
            // Make sure the list contains at least one bash sample
            const hasBashSample = codeSampleList.some((codeSample) => {
              return codeSample.lang === 'bash';
            });
            //check for the other SDK languages by making an array of the lang fields from the code samples
            const langArray = codeSampleList.map((codeSample) => {
              return codeSample.lang;
            });
            //compare the sdkLanguages array with the langArray to find the missing languages, and save them to an array
            const missingLanguages = sdkLanguages.filter((lang) => {
                return !langArray.includes(lang);
            }
            );
            //if there are missing languages, report them as warnings
            // might want to make this less verbose later
            if (missingLanguages.length > 0) {
            ctx.report({
                message: `Only ${langArray.length} code samples: ${langArray.join(', ')} but is missing the following SDK languages: ${missingLanguages.join(', ')}`,
            });
            }
            }
        }
    };
}
```


## Examples


### Spec 

```yaml
post:
  operationId: custom_auth_flow
  summary: Custom Authentication
  description: 
    [...] # Omitted for brevity
  security:
    [...] # Omitted for brevity
  requestBody:
    [...] # Omitted for brevity
  responses:
    [...] # Omitted for brevity
  x-code-samples:
    - lang: bash
      label: cURL
      source:
        $ref: ./code_samples/auth/custom_auth/POST/curl.sh
    - lang: ruby
      label: Ruby SDK
      source:
        $ref: ./code_samples/auth/custom_auth/POST/ruby.rb
    - lang: python
      label: Python SDK
      source:
        $ref: ./code_samples/auth/custom_auth/POST/python.py
    - lang: java
      label: Java SDK
      source:
        $ref: ./code_samples/auth/custom_auth/POST/java.java
    - lang: kotlin
      label: Kotlin SDK
      source:
        $ref: ./code_samples/auth/custom_auth/POST/kotlin.kt
```


### Output

```bash
api-docs/paths/auth/custom.yaml:
  435:5  error    x-code-samples-check/check-sdk-coverage  Only 5 code samples: bash, ruby, python, java, kotlin but is missing the following SDK languages: javascript
```

