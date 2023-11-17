import { Stmt, Program, Expr, BinaryExpr, NumerictLiteral, Identifier, VarDeclaration, AssignmentExpr, Property, ObjectLiteral, CallExpr, MemberExpr, FunctionDeclaration} from './ast';
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
        switch(this.at().type) {
            case TokenType.Let:
            case TokenType.Const:
                return this.parse_var_declaration();
            case TokenType.Fn:
                return this.parse_function_declaration();
            default:
                return this.parse_expr();
        }
    }
    parse_function_declaration(): Stmt {
        this.eat(); // move pasts fn token
        const name = this.expect(TokenType.Identifier, "Expected Function Name following fn keyword").value;
        const args = this.parse_args();
        const params: string[] = [];
        // check if all parameters are string 
        for(const arg of args) {
            if(arg.kind !== "Identifier") {
                throw "Inside function declaration expected parameters of type string";
            }

            params.push((arg as Identifier).symbol);
        }

        this.expect(TokenType.OpenBrace, "Function declaration should begin with brace");

        const body: Stmt[] = [];
        while(this.at().type !== TokenType.EOF && this.at().type !== TokenType.CloseBrace) {
            body.push(this.parse_stmt());
        }

        this.expect(TokenType.CloseBrace, "Closing brace expected at the end of function declaration");

        const fn = {
            body, name, parameters: params, kind: "FunctionDeclaration"
        } as FunctionDeclaration;

        return fn;
    }

    private parse_var_declaration(): Stmt {
        const isConstant = this.eat().type === TokenType.Const;
        const identifier = this.expect(TokenType.Identifier, "Expected identifier name following let or const keywords").value;
        if(this.at().type === TokenType.Semicolon) 
        {
            this.eat();
            if(isConstant) {
                throw "Value must be assigned for constant expression";
            }
            return {
                kind: "VarDeclaration",
                identifier,
                constant: isConstant,
                value: undefined
            } as VarDeclaration;
        }

        this.expect(TokenType.Equals, "Expected equals token following identifier in variable declaration");
        const declaration = {
            kind: "VarDeclaration",
            value: this.parse_expr(),
            constant: isConstant,
            identifier
        } as VarDeclaration;

        this.expect(TokenType.Semicolon, "Variable declarations must end with semicolon");
        return declaration;
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

    // bar.x()
    private parse_call_member_expr(): Expr {
        const member = this.parse_member_expr();
        if(this.at().type === TokenType.OpenParen) {
            return this.parse_call_expr(member);
        }

        return member;
    }

    private parse_call_expr(calle: Expr): Expr {
        let call_expr: Expr = {
            kind: "CallExpr",
            calle,
            args: this.parse_args()
        } as CallExpr;
        // bar.x()() -> if the function returns another function
        if(this.at().type === TokenType.OpenParen) {
            call_expr = this.parse_call_expr(call_expr);
        }

        return call_expr;
    }

    private parse_args(): Expr[] {
        this.expect(TokenType.OpenParen, "Expected open paranthesis");
        const args = this.at().type === TokenType.CloseParen ? [] : this.parse_arguments_list();
        this.expect(TokenType.CloseParen, "Missing closing paranthesis inside arguments list");
        return args;
    }

    private parse_arguments_list(): Expr[] {
        const args = [this.parse_assignment_expr()];
        while(this.at().type === TokenType.Comma && this.eat()) {
            args.push(this.parse_assignment_expr())
        }

        return args;
    }

    private parse_member_expr(): Expr {
        let object = this.parse_primary_expr();
        while(this.at().type === TokenType.Dot || this.at().type === TokenType.OpenBracket) {
            const operator = this.eat();
            let property: Expr;
            let computed: boolean;
            // non-computed properties -> obj.expr
            if(operator.type === TokenType.Dot) {
                computed = false;
                property = this.parse_primary_expr(); // this should be an identifier
                if(property.kind !== "Identifier") {
                    throw `Dot operator cannot be used without right hand side being an identifier`
                }
            } else {
                // this -> obj[computedValue]
                computed = true;
                property = this.parse_expr();
                this.expect(TokenType.CloseBracket, 'Missing close bracket in computed value');
            }
            object = {
                kind: 'MemberExpr',
                property,
                object,
                computed
            } as MemberExpr;
        }

        return object;
        
    }

    private parse_multiplicative_expr(): Expr {
        let left = this.parse_call_member_expr();
        while(this.at().value == "/" || this.at().value == "*" || this.at().value == "%") {
            const operator = this.eat().value;
            const right = this.parse_call_member_expr();
            left = {
                kind: 'BinaryExpr',
                left,
                right,
                operator
            } as BinaryExpr;
        }
        return left;
    }

    private parse_object_expr(): Expr {
        if(this.at().type !== TokenType.OpenBrace) {
            return this.parse_additive_expr();
        }

        this.eat(); // move past open brace
        const properties = new Array<Property>();
        while(this.not_eof() && this.at().type !== TokenType.CloseBrace) {
            const key = this.expect(TokenType.Identifier, "Object literal key expected").value;
            // Allows shorthand key: pair becoming { key, } 
            if(this.at().type === TokenType.Comma) {
                this.eat(); // move past comma
                properties.push({ key, kind: "Property"} as Property);
                continue;
            } // Allows shorthand key: pair becoming { key } 
            else if(this.at().type === TokenType.CloseBrace) {
                properties.push({ key, kind: "Property"} as Property);
                continue;
            }

            // { key: val }
            this.expect(TokenType.Colon, "Missing colon after identifier");
            //this.eat();
            const value = this.parse_expr();
            properties.push({ kind: "Property", value, key });
            if(this.at().type !== TokenType.CloseBrace) {
                this.expect(TokenType.Comma, "Expected Comma or Closing Bracket following the property");
            }
        }
        this.expect(TokenType.CloseBrace, "Object literal missing closing brace");
        return {
            kind: "ObjectLiteral",
            properties
        } as ObjectLiteral;
    }

    private parse_assignment_expr(): Expr {
        let left = this.parse_object_expr();
        if(this.at().type === TokenType.Equals) {
            this.eat();
            const value = this.parse_assignment_expr();
            return { value, assignee: left, kind: "AssignmentExpr" } as AssignmentExpr;
        }

        return left;
    }

    private parse_expr(): Expr {
        return this.parse_assignment_expr();
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
            default:
                console.error("Unexpected token found during parsing!", this.at());
                process.exit(1);
        }
    }

}