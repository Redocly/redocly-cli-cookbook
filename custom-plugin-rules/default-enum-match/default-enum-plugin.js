const DefaultEnumMatch = require('./default-enum-match');

module.exports = function myRulesPlugin() {
  return {
    id: 'openapi-default-enum',
    rules: {
      oas3: {
        'default-enum-match': DefaultEnumMatch,
      },
    },
  };
};