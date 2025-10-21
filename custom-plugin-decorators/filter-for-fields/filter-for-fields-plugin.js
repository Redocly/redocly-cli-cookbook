import FilterForFields from "./filter-for-fields-decorator.js";

/** @type {import('@redocly/cli').DecoratorsConfig} */
const filterForFieldsDecorator = {
  oas3: {
    "filter-for-fields-decorator": FilterForFields,
  },
};

export default function filterForFieldsPlugin() {
  return {
    id: "filter-for-fields-plugin",
    decorators: filterForFieldsDecorator,
  };
}
