export type NodeType = 
"Program"
| "VarDeclaration" 
| "NumericLiteral" 
| "Identifier" 
| "BinaryExpr" 
| "CallExpr" 
| "UnaryExpr" 
| "FunctionDeclaration"
| "AssignmentExpr"
| "Property"
| "ObjectLiteral";

export interface Stmt {
    kind: NodeType;
}

export interface Program extends Stmt {
    kind: "Program";
    body: Stmt[];
}

export interface Expr extends Stmt {}

export interface BinaryExpr extends Expr {
    left: Expr;
    right: Expr;
    operator: string;
}

export interface Identifier extends Expr {
    kind: "Identifier";
    symbol: string;
}

export interface NumerictLiteral extends Expr {
    kind: "NumericLiteral";
    value: number;
}
export interface VarDeclaration extends Stmt {
    kind: "VarDeclaration";
    constant: boolean;
    identifier: string;
    value?: Expr;
}

export interface AssignmentExpr extends Expr {
    kind: "AssignmentExpr";
    assignee: Expr;
    value: Expr;
}
export interface Property extends Expr {
    kind: "Property";
    key: string;
    value?: Expr
}
export interface ObjectLiteral extends Expr {
    kind: "ObjectLiteral";
    properties: Property[]
}