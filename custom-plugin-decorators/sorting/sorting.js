const SortTagsAlphabetically = require('./sort-tags');
const SortOperationsAlphabetically = require('./sort-operations');
const SortEnumsAlphabetically= require('./sort-enums');
const SortMethods = require('./sort-methods');
const SortPropertiesAlphabetically = require('./sort-props-alpha');
const SortPropertiesRequiredFirst = require('./sort-props-required');


module.exports = {
  id: 'sorting',
  decorators: {
    oas3: {
      'tags-alphabetical': SortTagsAlphabetically,
      'operations-alphabetical': SortOperationsAlphabetically,
      'enums-alphabetical': SortEnumsAlphabetically,
      'methods': SortMethods,
      'properties-alphabetical': SortPropertiesAlphabetically,
      'properties-required-first': SortPropertiesRequiredFirst,
    }
  }
	
}
