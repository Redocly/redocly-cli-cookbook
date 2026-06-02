import spreadSecurityToOperations from "./decorator";

export default function plugin() {
  return {
    id: "security-plugin",
    decorators: {
      oas3: {
        "spread-security-to-operations": spreadSecurityToOperations,
      },
    },
  };
}
