module.exports = SortMethods

function SortMethods() {
  console.log("re-ordering methods");
  return {
    PathItem: {
      leave(pathItem) {
        // the methods, in order
        const methodList = ["post", "patch", "put", "get", "delete"];

        for (const method of methodList) {
          const operation = pathItem[method];
          // For each defined operation, delete it and re-add it to the path so they will be in the correct order:
          if (operation) {
            delete pathItem[method];
            pathItem[method] = operation;
          }
        }
      },
    },
  }
}
