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