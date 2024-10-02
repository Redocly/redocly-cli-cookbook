const SortTagsAlphabetically = require('./decorator-alpha');

module.exports = function tagSortingPlugin() {
  return {
    id: 'tag-sorting',
    decorators: {
      oas3: {
        'alphabetical': SortTagsAlphabetically,
      }
    }
  }
}
