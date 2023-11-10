module.exports = ValidateMarkdown
const markdownlint = require("markdownlint");
const config = {
  // the list is here https://github.com/DavidAnson/markdownlint#rules--aliases
  MD013: {line_length: 120},
  MD041: false, // first line should be h1
  MD047: false, // should end with newline
}

function checkString(description, ctx) {
  let options = {
    "strings": {
      "desc": description
    },
    "config": config
  };
  markdownlint(options, function callback(err, result) {
    if (!err) {
      // if there's no problem do nothing
      if (result.desc.length) { // desc is the key in the options.strings object
        let lines = description.split("\n");

        result.desc.forEach((desc) => {
          message = desc.ruleDescription;
          // add line number context for longer entries
          if (desc.lineNumber > 1 ) {
            message = message + " (near: " + lines[desc.lineNumber].substring(0,20) + "... )";
          }

          ctx.report({
            message: message,
            location: ctx.location.child('description'),
          });
        });

      }
    }
  });
}

function ValidateMarkdown() {
  console.log("OpenAPI Markdown: validate");
  return {
   Info: {
      enter(target, ctx) {
        if(target["description"]) {
          return checkString(target["description"], ctx);
          
        }
      }
    },
   Operation: {
      enter(target, ctx) {
        if(target["description"]) {
          return checkString(target["description"], ctx);
          
        }
      }
    },
   Parameter: {
      enter(target, ctx) {
        if(target["description"]) {
          return checkString(target["description"], ctx);
          
        }
      }
    },
    Tag: {
      enter(target, ctx) {
        if(target["description"]) {
          return checkString(target["description"], ctx);
          
        }
      }
    },
  }
}
