export enum TokenType {
    Null,
    Number,
    Identifier,
    Equals,
    OpenParen,
    CloseParen,
    BinaryOperator,
    Let,
    Const,
    EOF
}

const KEYWORDS: Record<string, TokenType> = {
    "let": TokenType.Let,
    "const": TokenType.Const,
    null: TokenType.Null
}

export interface Token {
    value: string,
    type: TokenType
}

function token(value = "", type: TokenType): Token {
    return { value, type } as Token; 
}

function isAlpha(src: string) {
    return src.toUpperCase() != src.toLowerCase();
}

function isSkippable(str: string) {
    return str === ' ' || str === '\n' || str === '\t';
}

function isInt(str: string) {
    const c = str.charCodeAt(0);
    const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)];
    return (c >= bounds[0] && c <= bounds[1]);
}

export function tokenize(sourceCode: string): Token[] {
    const tokens = new Array<Token>();
    const src = sourceCode.split("");

    // Build each token
    while(src.length > 0) {
        if(src[0] === '(') {
            tokens.push(token(src.shift(), TokenType.OpenParen));
        } else if(src[0] === ')') {
            tokens.push(token(src.shift(), TokenType.CloseParen));
        } else if(src[0] === '+' || src[0] === "-" || src[0] === "*" || src[0] === "/" || src[0] === "%") {
            tokens.push(token(src.shift(), TokenType.BinaryOperator));
        } else if(src[0] === "=") {
            tokens.push(token(src.shift(), TokenType.Equals));
        } else {
            if(isInt(src[0])) {
                let num = "";
                while(src.length > 0 && isInt(src[0])) {
                    num += src.shift();
                }
                tokens.push(token(num, TokenType.Number));
            } else if(isAlpha(src[0])) {
                let ident = "";
                while(src.length > 0 && isAlpha(src[0])) {
                    ident += src.shift();
                }
                // check for reserved keywords
                const reserved = KEYWORDS[ident];
                if(typeof reserved === "number") {
                    tokens.push(token(ident, reserved));
                } else {
                    tokens.push(token(ident, TokenType.Identifier));
                }
            } else if(isSkippable(src[0])) {
                src.shift();
            } else {
                console.log('Unrecognized character: ', src[0]);
                return process.exit(1);
            }
        }
    }
    tokens.push({ type: TokenType.EOF, value: "EndOfFile" })
    return tokens;
}

// import { readFileSync } from 'fs';
// import { join } from 'path';
// const source = readFileSync(join(__dirname, './test.txt'), 'utf-8');
// console.log(source);
// for(const token of tokenize(source)) {
//     console.log(token);
// }