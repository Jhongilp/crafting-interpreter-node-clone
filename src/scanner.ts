import { TokenType } from "./tokenType";
import { IToken, Token } from "./token";

export class Scanner {
  private source: string;
  private tokens: IToken[] = [];
  private start = 0;
  private current = 0;
  private line = 1;

  static keywords: { [key: string]: TokenType } = {
    and: "AND",
    class: "CLASS",
    else: "ELSE",
    false: "FALSE",
    for: "FOR",
    fun: "FUN",
    if: "IF",
    nil: "NIL",
    or: "OR",
    print: "PRINT",
    return: "RETURN",
    super: "SUPER",
    this: "THIS",
    true: "TRUE",
    var: "VAR",
    while: "WHILE",
  };

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
      case '"':
        this.string();
        break;
      default:
        if (this.isDigit(c)) {
          this.number();
        } else if (this.isAlpha(c)) {
          this.identifier();
        } else {
          console.error("Unexpected character. ", this.line);
        }

        break;
    }
  }

  advance() {
    return this.source.charAt(this.current++);
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

  peekNext() {
    if (this.current + 1 >= this.source.length) {
      return "\0";
    }
    return this.source.charAt(this.current + 1);
  }

  identifier() {
    while (this.isAlphaNumeric(this.peek())) {
      this.advance();
    }

    const text = this.source.substring(this.start, this.current);
    let type = Scanner.keywords[text];
    if (!type) {
      type = "IDENTIFIER";
    }
    this.addToken(type, null);
  }

  number() {
    while (this.isDigit(this.peek())) {
      this.advance();
    }

    // Look for a fractional part.
    if (this.peek() == "." && this.isDigit(this.peekNext())) {
      // Consume the "."
      this.advance();

      while (this.isDigit(this.peek())) {
        this.advance();
      }
    }

    this.addToken(
      "NUMBER",
      parseFloat(this.source.substring(this.start, this.current))
    );
  }

  string() {
    while (this.peek() != '"' && !this.isAtEnd()) {
      if (this.peek() == "\n") {
        this.line++;
      }
      this.advance();
    }

    if (this.isAtEnd()) {
      console.error("Unterminated string. ", this.line);
      return;
    }

    // The closing ".
    this.advance();

    // Trim the surrounding quotes.
    const value = this.source.substring(this.start + 1, this.current - 1);
    this.addToken("STRING", value);
  }

  isAlpha(c: string) {
    return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c == "_";
  }

  isAlphaNumeric(c: string) {
    return this.isAlpha(c) || this.isDigit(c);
  }

  isDigit(c: string) {
    return c >= "0" && c <= "9";
  }

  addToken(type: TokenType, literal: null | string | number) {
    const lexeme = this.source.substring(this.start, this.current);
    console.log("[add_token] lexeme: ", lexeme);
    this.tokens.push(Token({ type, lexeme, literal, line: this.line }));
  }

  test() {
    console.log("Lox interpreter source: ", this.source);
    console.log("Lox interpreter tokens: ", this.tokens);
  }
}
