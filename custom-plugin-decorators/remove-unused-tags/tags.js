module.exports = {
  id: "tags",
  decorators: {
    oas3: {
      "no-unused-tags": ({ ignore }) => {
        console.log("Checking for unused tags...");
        return {
          Root: {
            // need the whole document for this
            leave(target, ctx) {
              // case-insensitive so use lowercase
              let tagsToIgnore = [];
              if (ignore instanceof Array) {
                for (i = 0; i < ignore.length; i++) {
                  tagsToIgnore.push(ignore[i].toLowerCase());
                }
              }

              // create an array of tags to keep score
              let tags = [];

              for (p in target.paths) {
                // foreach endpoint
                for (operation in target.paths[p]) {
                  // foreach operation
                  for (t in target.paths[p][operation]["tags"]) {
                    // foreach tag
                    let opTag =
                      target.paths[p][operation]["tags"][t].toLowerCase();
                    // count the occurrences
                    if (tags[opTag]) {
                      tags[opTag] = tags[opTag] + 1;
                    } else {
                      tags[opTag] = 1;
                    }
                  }
                }
              }

              let indicesToRemove = [];
              for (tagIndex in target.tags) {
                let tagName = target.tags[tagIndex].name.toLowerCase();
                // if it's on the ignore list, do nothing
                if (tagsToIgnore.includes(tagName)) {
                  continue;
                }

                // otherwise if unused, add to list for removal
                if (tags[tagName] > 0) {
                } else {
                  console.log("Removing unused tag " + tagName);
                  indicesToRemove.push(tagIndex);
                }
              }

              // count backwards to avoid index shifting
              for (let i = indicesToRemove.length - 1; i >= 0; i--) {
                target.tags.splice(indicesToRemove[i], 1);
              }

              return target;
            },
          },
        };
      },
    },
  },
};
