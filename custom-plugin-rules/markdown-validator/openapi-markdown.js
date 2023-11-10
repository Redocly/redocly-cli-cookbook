const ValidateMarkdown = require('./rule-validate-markdown.js');

module.exports = {
  id: 'openapi-markdown',
  rules: {
    oas3: {
      'validate': ValidateMarkdown,
    }
  }
	
}
