const rule = require("../../../lib/rules/map");
const RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester();

ruleTester.run("map", rule, {
    valid: [
        `function test() {
            if (Array.isArray(collection)) {
                return collection.map(fn);
             } else {
                 return _.map(collection, fn);
             }
        }`,
        "(Array.isArray(collection)) ? collection.map(fn) : _.map(collection, fn);"
    ],
    invalid: [
        {
            code: "_.map(collection, fn)",
            errors: [{
                message: "replace lodash map to native",
                type: "CallExpression",
            }],
        },
        {
            code: `function test() {
               return _.map(collection, fn);
            }`,
            errors: [{
                message: "replace lodash map to native",
                type: "CallExpression",
            }],
        }
    ]
});