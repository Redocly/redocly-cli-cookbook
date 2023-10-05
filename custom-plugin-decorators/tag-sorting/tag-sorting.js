const SortTagsAlphabetically = require('./decorator-alpha.js');

module.exports = {
  id: 'tag-sorting',
  decorators: {
    oas3: {
      'alphabetical': SortTagsAlphabetically,
    }
  }
	
}
