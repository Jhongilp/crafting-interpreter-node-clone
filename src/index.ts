import * as fs from "fs";
import * as path from "path";

import { Scanner } from "./scanner";
import { Parser } from "./parser";

try {
  const data = fs.readFileSync(path.resolve("src/source.txt"), "utf8");
  const it = new Scanner(data);

  const tokens = it.scanTokens();
  console.log("tokens: ", tokens);
  const parser = new Parser(tokens);
  const expression = parser.parse();
  console.log("expression: ", expression);
  // it.test();
} catch (err) {
  console.error(err);
}
