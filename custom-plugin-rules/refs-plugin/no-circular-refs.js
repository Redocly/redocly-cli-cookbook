function NoCircularRefs() {
  let depth = 0;
  let maxDepth = 0;
  const pointers = new Set();

  return {
    ref: {
      enter(node, { location, report }) {
        depth++;
        maxDepth = Math.max(maxDepth, depth);
        const thisPointer = location.source.absoluteRef + node.$ref;
        if (pointers.has(thisPointer)) {
          report({
            message: `Circular reference detected: ${thisPointer}`,
            location: location.child("$ref"),
          });
        } else {
          pointers.add(thisPointer);
        }
      },
      leave(node, { location }) {
        depth--;
        const thisPointer = location.source.absoluteRef + node.$ref;
        pointers.delete(thisPointer);
      },
    },
    Root: {
      leave(node, ctx) {
        setTimeout(() => {
          process.stdout.write(`\n\nMaximum $refs depth is ${maxDepth} \n\n`);
        });
      },
    },
  };
}

module.exports = NoCircularRefs;
