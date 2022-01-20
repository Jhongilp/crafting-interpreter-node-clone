import * as fs from "fs";
import * as path from "path";

import { Scanner } from "./scanner";
import { Parser } from "./parser";
import { Interpreter } from './interpreter';

try {
  const interpreter = new Interpreter()
  const data = fs.readFileSync(path.resolve("src/source.txt"), "utf8");
  const it = new Scanner(data);

  const tokens = it.scanTokens();
  console.log("tokens: ", tokens);
  const parser = new Parser(tokens);
  // const expression = parser.parse();
  const statements = parser.parse();
  console.log("statements: ", statements);
  // it.test();
  interpreter.interpret(statements);
} catch (err) {
  console.error(err);
}
