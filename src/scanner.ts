import { TokenType } from "./tokenType";

export class Scanner {
  private source: string;
  constructor(source: string) {
    this.source = source;
  }

  test() {
    // const token = TokenType.AND;
    console.log("Lox interpreter source: ", this.source);
  }
}
