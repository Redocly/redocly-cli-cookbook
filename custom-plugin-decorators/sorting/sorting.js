const SortTagsAlphabetically = require('./sort-tags');
const SortEnumsAlphabetically= require('./sort-enums');
const SortMethods = require('./sort-methods');
const SortPropertiesAlphabetically = require('./sort-props-alpha');
const SortPropertiesRequiredFirst = require('./sort-props-required');


module.exports = function Sorting() {
  return {
    id: 'sorting',
    decorators: {
      oas3: {
        'tags-alphabetical': SortTagsAlphabetically,
        'enums-alphabetical': SortEnumsAlphabetically,
        'methods': SortMethods,
        'properties-alphabetical': SortPropertiesAlphabetically,
        'properties-required-first': SortPropertiesRequiredFirst,
      }
    }
  }
}
