/** @type {import('@redocly/cli').OasDecorator} */
export default function FilterForFields({ severity, ...fieldsToFilterFor }) {
  return {
    // As we are filtering out entire paths, we need to do this at the Root level, and not at the PathItem level.
    // You cannot set a PathItem to null or undefined to remove it.
    Root: {
      leave(node) {
        const fieldsToFilterForIsAValidObject =
          fieldsToFilterFor &&
          typeof fieldsToFilterFor === "object" &&
          !Array.isArray(fieldsToFilterFor) &&
          Object.keys(fieldsToFilterFor).length > 0;

        if (!fieldsToFilterForIsAValidObject) {
          return;
        }

        Object.entries(node.paths).map(([path, pathObject]) => {
          Object.entries(pathObject).map(([httpMethod, httpMethodObject]) => {
            const hasAllDecoratorKeys = Object.entries(fieldsToFilterFor).every(
              ([fieldToFilterFor, fieldValueToFilterFor]) =>
                httpMethodObject.hasOwnProperty(fieldToFilterFor) &&
                httpMethodObject[fieldToFilterFor] === fieldValueToFilterFor,
            );

            if (!hasAllDecoratorKeys) {
              if (Object.keys(pathObject).length === 1) {
                // If there's only one HTTP method, delete the whole path object.
                // Otherwise, the path object will be left as an empty object.
                delete node.paths[path];

                return;
              }

              delete node.paths[path][httpMethod];
            }
          });
        });
      },
    },
  };
}
