import { IToken } from "./token";
import { LoxObject } from "./scanner";
import { RuntimeError } from "./error";

export class Environment {
  values: { [key: string]: LoxObject } = {};

  get(name: IToken) {
    if (this.values[name.lexeme]) {
      return this.values[name.lexeme];
    }
    throw new RuntimeError(`Undefined variable ${name.lexeme}`, name);
  }

  define(name: string, value: LoxObject) {
    this.values[name] = value;
  }
}
