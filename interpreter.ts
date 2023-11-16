import { ValueType, RuntimeVal, NumberVal, MK_NULL, ObjectVal } from './values';
import { AssignmentExpr, BinaryExpr, Identifier, NodeType, NumerictLiteral, ObjectLiteral, Program, Stmt, VarDeclaration } from './ast';
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

function evaluate_object_expr(obj: ObjectLiteral, env: Environment): RuntimeVal {
    const object = { type: "object", properties: new Map() } as ObjectVal;
    for(const { key, value } of obj.properties) {
        // Handles key: value
        const runtimeVal = value === undefined ? env.lookupVar(key) : evaluate(value, env);
        object.properties.set(key, runtimeVal);
    }
    return object;
}

function evaluate_var_declaration(declaration: VarDeclaration, env: Environment): RuntimeVal {
    const value = declaration.value ? evaluate(declaration.value, env) : MK_NULL()
    return env.declareVar(declaration.identifier, value, declaration.constant);
}

function evaluate_assigment_declaration(node: AssignmentExpr, env: Environment): RuntimeVal {
    if(node.assignee.kind !== "Identifier") {
        throw `Invalid assignment inside assignment expression`;
    }
    const varName = ((node.assignee) as Identifier).symbol;
    return env.assignVar(varName, evaluate(node.value, env))
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
        case 'VarDeclaration':
            return evaluate_var_declaration(astNode as VarDeclaration, env);
        case "AssignmentExpr":
            return evaluate_assigment_declaration(astNode as AssignmentExpr, env);
        case "ObjectLiteral":
            return evaluate_object_expr(astNode as ObjectLiteral, env);
        default:
            console.error("No interpretation available for this astNode", JSON.stringify(astNode));
            process.exit(1);
    }
}