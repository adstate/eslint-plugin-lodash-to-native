module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description: "lodash map to native array method",
            category: "Best Practices",
            recommended: true,
        },
        schema: [],
    },
    create: function(context) {
        return {
            CallExpression(node) {
                const callee = node.callee;
                const args = node.arguments;

                if (callee.type == 'MemberExpression') {
                    if (callee.object.name === '_' && callee.property.name === 'map') {
                        const obj = args[0];
                        const fn = args[1];
                        
                        const conditionParent = (node.parent.type === 'ConditionalExpression') ? node.parent : node.parent.parent.parent;
                        
                        if (conditionParent != null && (conditionParent.type === 'ConditionalExpression' || conditionParent.type === 'IfStatement')) {
                            const condition = conditionParent.test;

                            if (condition.callee.object.name === 'Array' &&
                                condition.callee.property.name === 'isArray' &&
                                condition.arguments[0].name === obj.name
                            ) {
                                return;
                            }
                        }

                        context.report({
                            node,
                            message: "replace lodash map to native",
                            suggest: [
                                {
                                    desc: "Replace lodash method to native map for Array",
                                    fix: function(fixer) {
                                        const sourceCode = context.getSourceCode();
                                        const fixedCode = `(Array.isArray(${obj.name}) ? ${obj.name}.map(${fn.name}) : ${sourceCode.getText()};`

                                        return fixer.replaceText(node, fixedCode);
                                    }
                                },
                                {
                                    desc: "Replace lodash method to native map for Array",
                                    fix: function(fixer) {
                                        const sourceCode = context.getSourceCode();
                                        const fixedCode = `
                                            if (Array.isArray(${obj.name}) {
                                                return ${obj.name}.map(${fn.name});
                                            } else {
                                                return ${sourceCode.getText()};
                                            }`;
    
                                        return fixer.replaceText(node, fixedCode);
                                    }
                                }
                            ]
                        });
                    }                    
                }
            }
        }
    }
}