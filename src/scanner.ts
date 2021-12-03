import { TokenType } from "./tokenType";
import { IToken, Token } from "./token";

export class Scanner {
  private source: string;
  private tokens: IToken[] = [];
  private start = 0;
  private current = 0;
  private line = 1;

  constructor(source: string) {
    this.source = source;
  }

  scanTokens(): IToken[] {
    console.log("source length: ", this.source.length);
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }
    return this.tokens;
  }

  isAtEnd() {
    return this.current >= this.source.length;
  }

  scanToken() {
    const c = this.advance();
    // console.log("char: ", c);
    switch (c) {
      case "(":
        this.addToken("LEFT_PAREN", null);
        break;
      case ")":
        this.addToken("RIGHT_PAREN", null);
        break;
      case "{":
        this.addToken("LEFT_BRACE", null);
        break;
      case "}":
        this.addToken("RIGHT_BRACE", null);
        break;
      case ",":
        this.addToken("COMMA", null);
        break;
      case ".":
        this.addToken("DOT", null);
        break;
      case "-":
        this.addToken("MINUS", null);
        break;
      case "+":
        this.addToken("PLUS", null);
        break;
      case ";":
        this.addToken("SEMICOLON", null);
        break;
      case "*":
        this.addToken("STAR", null);
        break;
      case "!":
        this.addToken(this.match("=") ? "BANG_EQUAL" : "BANG", null);
        break;
      case "=":
        this.addToken(this.match("=") ? "EQUAL_EQUAL" : "EQUAL", null);
        break;
      case "<":
        this.addToken(this.match("=") ? "LESS_EQUAL" : "LESS", null);
        break;
      case ">":
        this.addToken(this.match("=") ? "GREATER_EQUAL" : "GREATER", null);
        break;
      case "/":
        if (this.match("/")) {
          // A comment goes until the end of the line.
          while (this.peek() != "\n" && !this.isAtEnd()) {
            this.advance();
          }
        } else {
          this.addToken("SLASH", null);
        }
        break;
      case " ":
      case "\r":
      case "\t":
        // Ignore whitespace.
        break;

      case "\n":
        this.line++;
        break;
      default:
        // if (isDigit(c)) {
        //   number();
        // } else if (isAlpha(c)) {
        //   identifier();
        // } else {
        //   IntroTest.error(line, "Unexpected character.");
        // }

        break;
    }
  }

  advance() {
    return this.source.charAt(this.current++);
  }

  addToken(type: TokenType, literal: null | {}) {
    const lexeme = this.source.substring(this.start, this.current);
    console.log("[add_token] lexeme: ", lexeme);
    this.tokens.push(Token({ type, lexeme, literal, line: this.line }));
  }

  match(expected: string) {
    if (this.isAtEnd()) {
      return false;
    }
    if (this.source.charAt(this.current) != expected) {
      return false;
    }

    this.current++;
    return true;
  }

  peek() {
    if (this.isAtEnd()) {
      return "\0";
    }
    return this.source.charAt(this.current);
  }

  test() {
    // const token = TokenType.AND;
    console.log("Lox interpreter source: ", this.source);
    console.log("Lox interpreter tokens: ", this.tokens);
  }
}
