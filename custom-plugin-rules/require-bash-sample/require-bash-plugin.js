const RequireBashSample = require('./require-bash-sample');

module.exports = function myRulesPlugin() {
  return {
    id: 'openapi-bash-sample',
    rules: {
      oas3: {
        'require-bash-sample': RequireBashSample,
      },
    },
  };
};