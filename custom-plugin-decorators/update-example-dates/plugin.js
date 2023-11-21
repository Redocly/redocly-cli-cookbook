const updateExampleDates = require('./decorator');

module.exports = {
  id: 'dates-plugin',
  decorators: { oas3: {
    'update-example-dates': updateExampleDates
  }},
};
