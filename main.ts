import Environment from "./environment";
import { evaluate } from "./interpreter";
import Parser from "./parser";
import { MK_NULL, MK_NUMBER, NumberVal, MK_BOOL } from "./values";
const readline = require('readline');
var log = console.log;

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


function searchPrompt() {
  rl.question('cmd :> ', (input: any) => {
    if( input == 'exit' )
      return rl.close();
    const parser = new Parser();
    const env = new Environment();
    env.declareVar("x", MK_NUMBER(100));
    env.declareVar("true", MK_BOOL(true));
    env.declareVar("false", MK_BOOL(false));
    env.declareVar("null", MK_NULL());
    //log('You entered: ', input);
    const program = parser.produceAST(input);
    console.log(JSON.stringify(program));
    const result = evaluate(program, env);
    console.log('Result');
    console.log(result);
    console.log('----------\n\n')
    searchPrompt();
  });
}
repl();

async function repl() {
    console.log('Custom Language Parser Repl');
    searchPrompt();
}