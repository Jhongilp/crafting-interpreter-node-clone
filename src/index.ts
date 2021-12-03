import * as fs from "fs";
import * as path from "path";

import { Scanner } from "./scanner";

try {
  const data = fs.readFileSync(path.resolve("src/source.txt"), "utf8");
  const it = new Scanner(data);
  it.scanTokens();
  it.test();
} catch (err) {
  console.error(err);
}