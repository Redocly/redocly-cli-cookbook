import updateExampleDates from "./decorator";

export default function plugin() {
  return {
    id: "dates-plugin",
    decorators: {
      oas3: {
        "update-example-dates": updateExampleDates,
      },
    },
  };
}
