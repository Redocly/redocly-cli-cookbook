const SortTagsAlphabetically = require('./decorator-alpha');

module.exports = {
  id: 'tag-sorting',
  decorators: {
    oas3: {
      'alphabetical': SortTagsAlphabetically,
    }
  }
	
}
