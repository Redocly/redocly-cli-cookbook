const SortTagsAlphabetically = require('./sort-tags');
const SortEnumsAlphabetically= require('./sort-enums');
const SortMethods = require('./sort-methods');
const SortPropertiesAlphabetically = require('./sort-props-alpha');
const SortPropertiesRequiredFirst = require('./sort-props-required');
const RuleSortMethods = require('./rule-sort-methods');


module.exports = function Sorting() {
  return {
    id: 'sorting',
    rules: {
      oas3: {
        'method-sort': RuleSortMethods
      }
    },
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
};