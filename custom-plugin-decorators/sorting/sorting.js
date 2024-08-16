const SortTagsAlphabetically = require('./sort-tags');
const SortMethods = require('./sort-methods');

module.exports = {
  id: 'sorting',
  decorators: {
    oas3: {
      'tags-alphabetical': SortTagsAlphabetically,
      'methods': SortMethods,
    }
  }
	
}
