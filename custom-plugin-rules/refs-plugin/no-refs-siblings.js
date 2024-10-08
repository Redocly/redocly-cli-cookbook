function NoRefsSiblings() {
  return {
    ref: {
      enter(node, { report, location }) {
        const { $ref, description, summary, ...ignored } = node;
        for (const prop of Object.keys(ignored)) {
          report({
            message: `Ignored property found in Reference Object: ${prop}`,
            location: location.child(prop).key(),
          });
        }
      },
    },
  };
}

module.exports = NoRefsSiblings;
