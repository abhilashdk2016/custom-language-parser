export type ValueType = "null" | "number" | "boolean" | "object";

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