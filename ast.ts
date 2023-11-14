export type NodeType = "Program" | "NumericLiteral" | "Identifier" | "BinaryExpr" | "CallExpr" | "UnaryExpr" | "FunctionDeclaration";

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