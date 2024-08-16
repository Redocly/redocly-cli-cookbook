module.exports = SortMethods

function SortMethods() {
  console.log("re-ordering methods");
  return {
    Paths: {
      leave(target) {
        // the methods, in order
        const methodList = ['post', 'patch', 'put', 'get', 'delete']

        // for each path in the description 
        let paths = Object.getOwnPropertyNames(target);
        paths.forEach((path) => {
          let newPathItem = {};

          // for each verb in turn
          methodList.forEach((method) => {
            if(target[path][method]) {
              newPathItem[method] = target[path][method];
            }
          });

          // update the path with the new structure
          target[path] = newPathItem;
        });

      }
    }
  }
}
