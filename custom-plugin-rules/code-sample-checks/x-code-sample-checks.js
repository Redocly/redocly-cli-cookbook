// const RequireBashExample = require('./rules/require-bash-example.js');
const CheckSDKCoverage = require('./rules/check-sdk-coverage.js');



module.exports = function myRulesPlugin() {
  return {
    id: 'x-code-samples-check',
    rules: {
      oas3: {
        // 'require-bash-sample': RequireBashExample, //court
        'check-sdk-coverage': CheckSDKCoverage
      },
    },
  };
};