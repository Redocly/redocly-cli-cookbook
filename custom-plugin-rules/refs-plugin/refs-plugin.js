const NoCircularRefs = require("./no-circular-refs");
const NoRefsSiblings = require("./no-refs-siblings");

module.exports = {
  id: "refs-plugin",
  rules: {
    oas3: {
      "no-refs-siblings": NoRefsSiblings,
      "no-circular-refs": NoCircularRefs,
    },
  },
};
