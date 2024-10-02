module.exports = RequireBashSample;

function RequireBashSample() {
  return {
    XCodeSampleList: {
      enter(codeSampleList, ctx) {
        // Make sure the list contains at least one bash sample
        const hasBashSample = codeSampleList.some((codeSample) => {
          return codeSample.lang === "bash";
        });
        if (!hasBashSample) {
          ctx.report({
            message: `The code sample list must contain at least one bash code sample.`,
          });
        }
      },
    },
  };
}
