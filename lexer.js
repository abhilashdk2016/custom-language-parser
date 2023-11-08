"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenize = exports.TokenType = void 0;
var TokenType;
(function (TokenType) {
    TokenType[TokenType["Number"] = 0] = "Number";
    TokenType[TokenType["Identifier"] = 1] = "Identifier";
    TokenType[TokenType["Equals"] = 2] = "Equals";
    TokenType[TokenType["OpenParen"] = 3] = "OpenParen";
    TokenType[TokenType["CloseParen"] = 4] = "CloseParen";
    TokenType[TokenType["BinaryOperator"] = 5] = "BinaryOperator";
    TokenType[TokenType["Let"] = 6] = "Let";
    TokenType[TokenType["Const"] = 7] = "Const";
})(TokenType || (exports.TokenType = TokenType = {}));
var KEYWORDS = {
    "let": TokenType.Let,
    "const": TokenType.Const
};
function token(value, type) {
    if (value === void 0) { value = ""; }
    return { value: value, type: type };
}
function isAlpha(src) {
    return src.toUpperCase() != src.toLowerCase();
}
function isSkippable(str) {
    return str === ' ' || str === '\n' || str === '\t';
}
function isInt(str) {
    var c = str.charCodeAt(0);
    var bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)];
    return (c >= bounds[0] && c <= bounds[1]);
}
function tokenize(sourceCode) {
    var tokens = new Array();
    var src = sourceCode.split("");
    // Build each token
    while (src.length > 0) {
        if (src[0] === '(') {
            tokens.push(token(src.shift(), TokenType.OpenParen));
        }
        else if (src[0] === ')') {
            tokens.push(token(src.shift(), TokenType.CloseParen));
        }
        else if (src[0] === '+' || src[0] === "-" || src[0] === "*" || src[0] === "/") {
            tokens.push(token(src.shift(), TokenType.BinaryOperator));
        }
        else if (src[0] === "=") {
            tokens.push(token(src.shift(), TokenType.Equals));
        }
        else {
            if (isInt(src[0])) {
                var num = "";
                while (src.length > 0 && isInt(src[0])) {
                    num += src.shift();
                }
                tokens.push(token(num, TokenType.Number));
            }
            else if (isAlpha(src[0])) {
                var ident = "";
                while (src.length > 0 && isAlpha(src[0])) {
                    ident += src.shift();
                }
                // check for reserved keywords
                var reserved = KEYWORDS[ident];
                if (reserved === undefined) {
                    tokens.push(token(ident, TokenType.Identifier));
                }
                else {
                    tokens.push(token(ident, reserved));
                }
            }
            else if (isSkippable(src[0])) {
                src.shift();
            }
            else {
                console.log('Unrecognized character: ', src[0]);
                return process.exit(1);
            }
        }
    }
    return tokens;
}
exports.tokenize = tokenize;
var fs_1 = require("fs");
var path_1 = require("path");
var source = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, './test.txt'), 'utf-8');
console.log(source);
for (var _i = 0, _a = tokenize(source); _i < _a.length; _i++) {
    var token_1 = _a[_i];
    console.log(token_1);
}
