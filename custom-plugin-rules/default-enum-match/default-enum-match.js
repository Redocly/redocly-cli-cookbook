module.exports = DefaultEnumMatch;

function DefaultEnumMatch() {
  return {
    Schema: {
      enter(schema, ctx) {
        // If enum and default are defined, default must be one of the enum values
        if (
          schema.enum &&
          typeof schema.default != "undefined" &&
          !schema.enum.includes(schema.default)
        ) {
          ctx.report({
            message: `The default value must be one of the enum values.`,
          });
        }
      },
    },
  };
}
