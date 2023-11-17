import Environment from "./environment";
import { evaluate } from "./interpreter";
import Parser from "./parser";
import { MK_NULL, MK_NUMBER, NumberVal, MK_BOOL, MK_NativeFunction, RuntimeVal } from "./values";
const readline = require('readline');
var log = console.log;

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


function searchPrompt(env: Environment) {
  rl.question('cmd :> ', (input: any) => {
    if( input == 'exit' )
      return rl.close();
    const parser = new Parser();
    //log('You entered: ', input);
    const program = parser.produceAST(input);
    console.log(JSON.stringify(program));
    const result = evaluate(program, env);
    console.log('Result');
    console.log(result);
    console.log('----------\n\n')
    searchPrompt(env);
  });
}
repl();

async function repl() {
    console.log('Custom Language Parser Repl');
    const env = new Environment();
    env.declareVar("true", MK_BOOL(true), true);
    env.declareVar("false", MK_BOOL(false), true);
    env.declareVar("null", MK_NULL(), true);
    // Define a native method
    env.declareVar('print', MK_NativeFunction((args, scope) => {
      return MK_NULL();
    }), true);
    env.declareVar('currentTime', MK_NativeFunction((args: RuntimeVal[], scope: Environment) => {
      return MK_NUMBER(Date.now());
    }), true);
    searchPrompt(env);
}