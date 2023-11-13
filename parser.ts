import { Stmt, Program, Expr, BinaryExpr, NumerictLiteral, Identifier, NullLiteral } from './ast';
import { tokenize, Token, TokenType } from './lexer';

export default class Parser {
    private tokens: Token[] = [];

    private not_eof(): boolean {
        return this.tokens[0].type !== TokenType.EOF;
    }

    private at() {
        return this.tokens[0] as Token;
    }

    private eat()
    {
        const prev = this.tokens.shift() as Token;
        return prev;
    }

    private expect(type: TokenType, err: any)
    {
        const prev = this.tokens.shift() as Token;
        if(!prev || prev.type !== type) {
            console.error("Parser error:\n", err, prev, " - Expecting: ", type);
            process.exit(1);
        }
        return prev;
    }
    public produceAST(sourceCode: string): Program {
        this.tokens = tokenize(sourceCode);
        const program: Program = {
            kind: "Program",
            body: []
        };

        

        while(this.not_eof()) {
            program.body.push(this.parse_stmt())
        }

        return program;
    }

    private parse_stmt(): Stmt {
        return this.parse_additive_expr();
    }

    private parse_additive_expr(): Expr {
        let left = this.parse_multiplicative_expr();
        while(this.at().value == "+" || this.at().value == "-") {
            const operator = this.eat().value;
            const right = this.parse_multiplicative_expr();
            left = {
                kind: 'BinaryExpr',
                left,
                right,
                operator
            } as BinaryExpr;
        }
        return left;
    }

    private parse_multiplicative_expr(): Expr {
        let left = this.parse_primary_expr();
        while(this.at().value == "/" || this.at().value == "*" || this.at().value == "%") {
            const operator = this.eat().value;
            const right = this.parse_primary_expr();
            left = {
                kind: 'BinaryExpr',
                left,
                right,
                operator
            } as BinaryExpr;
        }
        return left;
    }

    private parse_expr(): Expr {
        return this.parse_primary_expr();
    }

    private parse_primary_expr(): Expr {
        const tk = this.at().type;
        switch(tk) {
            case TokenType.Identifier:
                return { kind: "Identifier", symbol: this.eat().value } as Identifier;
            case TokenType.Number:
                    return { kind: "NumericLiteral", value: parseFloat(this.eat().value) } as NumerictLiteral;
            case TokenType.OpenParen: {
                this.eat();
                const value = this.parse_expr()
                this.expect(
                    TokenType.CloseParen,
                    "Unexpected token found while evaluating parenthesised expression. Expected closing paranthesis"
                );
                return value;
            }
            case TokenType.Null: {
                this.eat();
                return { kind: "NullLiteral", value: "null"} as NullLiteral;
            }
            default:
                console.error("Unexpected token found during parsing!", this.at());
                process.exit(1);
        }
    }

}