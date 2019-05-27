"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const definitelytyped_header_parser_1 = require("definitelytyped-header-parser");
const Lint = require("tslint");
const util_1 = require("../util");
class Rule extends Lint.Rules.AbstractRule {
    apply(sourceFile) {
        return this.applyWithFunction(sourceFile, walk);
    }
}
Rule.metadata = {
    ruleName: "dt-header",
    description: "Ensure consistency of DefinitelyTyped headers.",
    optionsDescription: "Not configurable.",
    options: null,
    type: "functionality",
    typescriptOnly: true,
};
exports.Rule = Rule;
function walk(ctx) {
    const { sourceFile } = ctx;
    const { text } = sourceFile;
    const lookFor = (search, explanation) => {
        const idx = text.indexOf(search);
        if (idx !== -1) {
            ctx.addFailureAt(idx, search.length, util_1.failure(Rule.metadata.ruleName, explanation));
        }
    };
    if (!util_1.isMainFile(sourceFile.fileName, /*allowNested*/ true)) {
        lookFor("// Type definitions for", "Header should only be in `index.d.ts` of the root.");
        lookFor("// TypeScript Version", "TypeScript version should be specified under header in `index.d.ts`.");
        return;
    }
    lookFor("// Definitions by: My Self", "Author name should be your name, not the default.");
    const error = definitelytyped_header_parser_1.validate(text);
    if (error) {
        ctx.addFailureAt(error.index, 1, util_1.failure(Rule.metadata.ruleName, `Error parsing header. Expected: ${definitelytyped_header_parser_1.renderExpected(error.expected)}.`));
    }
    // Don't recurse, we're done.
}
//# sourceMappingURL=dtHeaderRule.js.map