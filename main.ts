import Parser from "./parser";
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
    //log('You entered: ', input);
    const program = parser.produceAST(input);
    console.log(JSON.stringify(program));
    searchPrompt();
  });
}
repl();

async function repl() {
    console.log('Custom Language Parser Repl');
    searchPrompt();
}