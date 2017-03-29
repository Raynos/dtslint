"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Lint = require("tslint");
const ts = require("typescript");
class Rule extends Lint.Rules.AbstractRule {
    apply(sourceFile) {
        return this.applyWithFunction(sourceFile, walk);
    }
}
Rule.metadata = {
    ruleName: "void-return",
    description: "`void` may only be used as a return type.",
    rationale: "style",
    optionsDescription: "Not configurable.",
    options: null,
    type: "style",
    typescriptOnly: true,
};
Rule.FAILURE_STRING = "Use the `void` type for return types only. Otherwise, use `undefined`.";
exports.Rule = Rule;
function walk(ctx) {
    ts.forEachChild(ctx.sourceFile, recur);
    function recur(node) {
        if (node.kind === ts.SyntaxKind.VoidKeyword && !mayContainVoid(node.parent) && !isReturnType(node)) {
            ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
        }
        else {
            ts.forEachChild(node, recur);
        }
    }
}
function mayContainVoid({ kind }) {
    switch (kind) {
        case ts.SyntaxKind.TypeReference:
        case ts.SyntaxKind.ExpressionWithTypeArguments:
        case ts.SyntaxKind.NewExpression:
        case ts.SyntaxKind.CallExpression:
            return true;
        default:
            return false;
    }
}
function isReturnType(node) {
    let parent = node.parent;
    if (parent.kind === ts.SyntaxKind.UnionType) {
        [node, parent] = [parent, parent.parent];
    }
    return isSignatureDeclaration(parent) && parent.type === node;
}
function isSignatureDeclaration(node) {
    switch (node.kind) {
        case ts.SyntaxKind.ArrowFunction:
        case ts.SyntaxKind.CallSignature:
        case ts.SyntaxKind.FunctionDeclaration:
        case ts.SyntaxKind.FunctionExpression:
        case ts.SyntaxKind.FunctionType:
        case ts.SyntaxKind.MethodDeclaration:
        case ts.SyntaxKind.MethodSignature:
            return true;
        default:
            return false;
    }
}
//# sourceMappingURL=voidReturnRule.js.map