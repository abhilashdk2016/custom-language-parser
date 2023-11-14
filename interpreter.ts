import { ValueType, RuntimeVal, NumberVal, MK_NULL } from './values';
import { BinaryExpr, Identifier, NodeType, NumerictLiteral, Program, Stmt } from './ast';
import Environment from './environment';

function evaluate_numeric_expr(lhs: NumberVal, rhs: NumberVal, operator: string): NumberVal {
    let result: number;
    if(operator == "+") {
        result = lhs.value + rhs.value;
    } else if(operator == "-") {
        result = lhs.value - rhs.value;
    }else if(operator == "*") {
        result = lhs.value * rhs.value;
    }else if(operator == "/") {
        result = lhs.value / rhs.value;
    } else {
        result = lhs.value % rhs.value;
    }
    
    return {
        value: result,
        type: "number"
    };
}

function evalute_binary_expr(binExpr: BinaryExpr, env: Environment): RuntimeVal {
    const lhs = evaluate(binExpr.left, env);
    const rhs = evaluate(binExpr.right, env);
    if(lhs.type === "number" && rhs.type === "number") {
        return evaluate_numeric_expr(lhs as NumberVal, rhs as NumberVal, binExpr.operator);
    }

    return MK_NULL();
}

function evaluate_program(program: Program, env: Environment): RuntimeVal {
    let lastEvaluated: RuntimeVal = MK_NULL();
    for(const statement of program.body) {
        lastEvaluated = evaluate(statement, env);
    }
    
    return lastEvaluated;
}

function evaluate_identifier(ident: Identifier, env: Environment): RuntimeVal {
    const val = env.lookupVar(ident.symbol);
    return val;
}

export function evaluate(astNode: Stmt, env: Environment): RuntimeVal {
    switch(astNode.kind) {
        case "Identifier":
            return evaluate_identifier(astNode as Identifier, env);
        case "NumericLiteral":
            return {
                value: (astNode as NumerictLiteral).value ,
                type: "number"
            } as NumberVal;
        case "BinaryExpr":
                return evalute_binary_expr(astNode as BinaryExpr, env);
        case "Program":
            return evaluate_program(astNode as Program, env);
        default:
            console.error("No interpretation available for this astNode", JSON.stringify(astNode));
            process.exit(1);
    }
}