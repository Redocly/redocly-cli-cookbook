
function RuleSortMethods() {
  console.log("check method order");
  return {
    PathItem: {
      enter(pathItem, ctx) {
        const methods = Object.getOwnPropertyNames(pathItem);
        const methodOrder = ["post", "patch", "put", "get", "delete"];

        const filteredOrder = methodOrder.filter(item => methods.includes(item));
        // console.log("Want", filteredOrder);

        i = 0;
        while(i < filteredOrder.length) {
          if (methods[i] !== filteredOrder[i]) {
            ctx.report({
                message: `Unexpected method order, expected ${filteredOrder[i]} but found ${methods[i]}`
            });
          }
          i++;
        }
      }
    }
  }
}

module.exports = RuleSortMethods;
