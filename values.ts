import { Stmt } from "./ast";
import Environment from "./environment";

export type ValueType = "null" | "number" | "boolean" | "object" | "native-function" | "function";

export interface RuntimeVal {
    type: ValueType;
}

export interface NullVal extends RuntimeVal {
    type: "null";
    value: null;
}

export interface NumberVal extends RuntimeVal {
    type: "number";
    value: number;
}

export interface BooleanVal extends RuntimeVal {
    type: "boolean";
    value: boolean;
}

export function MK_NUMBER(n: number = 0) {
    return {
        type: "number",
        value: n
    } as NumberVal;
}

export function MK_NULL() {
    return {
        type: "null",
        value: null
    } as NullVal;
}

export function MK_BOOL(n: boolean = true) {
    return {
        type: "boolean",
        value: n
    } as BooleanVal;
}

export interface ObjectVal extends RuntimeVal {
    type: "object";
    properties: Map<string, RuntimeVal>;
}

export type FunctionCall = (args: RuntimeVal[], env: Environment) => RuntimeVal;
export interface NativeFunctionVal extends RuntimeVal {
    type: "native-function";
    call: FunctionCall;
}

export function MK_NativeFunction(call: FunctionCall) {
    return {
        type: "native-function",
        call
    } as NativeFunctionVal;
}

export interface FunctionVal extends RuntimeVal {
    type: "function";
    name: string;
    parameters: string[];
    declarationEnv: Environment;
    body: Stmt[];
}