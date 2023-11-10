# Redocly CLI Cookbook

A community collection of rulesets, configuration, custom plugins and other additions for [Redocly CLI](https://github.com/Redocly/redocly-cli). We know our users have some great tips, examples, and code to share, and this is the place to do just that. We would love to have your [contributions](#contributing) here too!

> [!IMPORTANT]
> Redocly are the repository maintainers, but we can't thoroughly test everything here. Please browse, share, and use what you find at your own risk.

If you're new to Redocly CLI, start with the [documentation](https://redocly.com/docs/cli/) to get up and running, then come back here to pick out any elements you would like to re-use yourself. To keep up with new developments, either subscribe to the project repository, or [sign up for the Redocly product newsletter](https://redocly.com/product-updates/).

## Usage

Use the content here as a starting point for your own work.

1. Take a look at what's available in each category, and pick any that you think apply to your situation.

2. Each section links to the documentation for that feature, incase you need an introduction or refresher.

3. Copy and paste the examples you want to use into your own setup, then edit them to fit your own needs.

If you come up with something new, please consider sharing it here by opening a pull request.

## Categories

### Rulesets

Combine existing [built-in rules](https://redocly.com/docs/cli/rules/built-in-rules/) in ways that serve a specific purpose, and make a [resuable ruleset](https://redocly.com/docs/cli/guides/configure-rules/#create-a-reusable-ruleset).

### Configurable rules

There are some fantastic examples of [configurable rules](https://redocly.com/docs/cli/rules/configurable-rules/) in the wild, we hope the list here inspires you to share more of your own!

- [Ban certain words from descriptions](configurable-rules/description-banned-words/)
- [Require `items` field for schemas of type `array`](configurable-rules/required-items-for-array-schemas/)
- [Ensure sentence case in operation summaries](configurable-rules/operation-summary-sentence-case)

### Custom plugins

The [custom plugin](https://redocly.com/docs/cli/custom-plugins/) is the ultimate in extensibility, but it's an advanced feature. Try these plugins for inspiration and to get you started. Rather than including the whole plugin, there are also sections for individual rules and decorators further down.

#### Decorators (for custom plugins)

- [Tag sorting](./custom-plugin-decorators/tag-sorting) - put your tags list in alphabetical order.

#### Rules (for custom plugins)

### Miscellaneous (including tips and tricks)

Share anything that didn't fit the existing categories here.

## Contributing

Please share your best Redocly CLI usage with us! Each item should be shared in its own pull request, following the existing directory structure and including the [README template](readme-template.md) copied into each folder. Full instructions are in the [CONTRIBUTING file](CONTRIBUTING.md).

## Requests

If there's something you think should be in the collection and it isn't, let us know! Open an issue, and describe the problem you'd like to see solved with Redocly CLI. We can't make promises, but we are pretty sure someone out there will know the answer.
