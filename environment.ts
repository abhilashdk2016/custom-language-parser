import { RuntimeVal } from "./values";

export default class Environment {
    private parent?: Environment;
    private variables: Map<string, RuntimeVal>;

    constructor (parentEnv?: Environment) {
        this.parent = parentEnv;
        this.variables = new Map();
    }

    public declareVar(varName: string, value: RuntimeVal): RuntimeVal {
        if(this.variables.has(varName)) {
            throw `Variable ${varName} is already declared`;
        }
        this.variables.set(varName, value);
        return value;
    }

    public assignVar(varName: string, value: RuntimeVal): RuntimeVal {
        const env = this.resolve(varName);
        env.variables.set(varName, value);
        return value;
    }

    public resolve(varName: string): Environment {
        if(this.variables.has(varName)) {
            return this;
        }
        if(this.parent === undefined) {
            throw `Cannot resolve '${varName}`;
        }

        return this.parent.resolve(varName);
    }

    public lookupVar(varName: string): RuntimeVal {
        const env = this.resolve(varName);
        return env.variables.get(varName) as RuntimeVal;
    }
}