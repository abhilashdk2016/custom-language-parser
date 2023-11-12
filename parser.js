"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lexer_1 = require("./lexer");
var Parser = /** @class */ (function () {
    function Parser() {
        this.tokens = [];
    }
    Parser.prototype.not_eof = function () {
        return this.tokens[0].type !== lexer_1.TokenType.EOF;
    };
    Parser.prototype.at = function () {
        return this.tokens[0];
    };
    Parser.prototype.eat = function () {
        var prev = this.tokens.shift();
        return prev;
    };
    Parser.prototype.produceAST = function (sourceCode) {
        this.tokens = (0, lexer_1.tokenize)(sourceCode);
        var program = {
            kind: "Program",
            body: []
        };
        while (this.not_eof()) {
            program.body.push(this.parse_stmt());
        }
        return program;
    };
    Parser.prototype.parse_stmt = function () {
        return this.parse_additive_expr();
    };
    Parser.prototype.parse_additive_expr = function () {
        var left = this.parse_multiplicative_expr();
        while (this.at().value == "+" || this.at().value == "-") {
            var operator = this.eat().value;
            var right = this.parse_multiplicative_expr();
            left = {
                kind: 'BinaryExpr',
                left: left,
                right: right,
                operator: operator
            };
        }
        return left;
    };
    Parser.prototype.parse_multiplicative_expr = function () {
        var left = this.parse_primary_expr();
        while (this.at().value == "/" || this.at().value == "*" || this.at().value == "%") {
            var operator = this.eat().value;
            var right = this.parse_primary_expr();
            left = {
                kind: 'BinaryExpr',
                left: left,
                right: right,
                operator: operator
            };
        }
        return left;
    };
    Parser.prototype.parse_expr = function () {
        return this.parse_primary_expr();
    };
    Parser.prototype.parse_primary_expr = function () {
        var tk = this.at().type;
        switch (tk) {
            case lexer_1.TokenType.Identifier:
                return { kind: "Identifier", symbol: this.eat().value };
            case lexer_1.TokenType.Number:
                return { kind: "NumericLiteral", value: parseFloat(this.eat().value) };
            default:
                console.error("Unexpected token found during parsing!", this.at());
                process.exit(1);
        }
    };
    return Parser;
}());
exports.default = Parser;
