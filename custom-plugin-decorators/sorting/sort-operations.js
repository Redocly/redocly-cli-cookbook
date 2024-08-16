module.exports = SortOperationsAlphabetically

function SortOperationsAlphabetically() {
  console.log("re-ordering operations: alphabetical");
  return {
    Root: {
      leave(root) {
        // find all the operations and sort them
        let operations = Object.getOwnPropertyNames(root.paths).sort();
        let newPaths = {}

        operations.forEach((op) => {
          newPaths[op] = root.paths[op]
        });

        root.paths = newPaths;
      }
    }
  }
}

