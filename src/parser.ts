import { IToken } from "./token";
import * as ast from "./Exp";
import { Expression, Print, Var, Stmt } from "./Stmt";
import { TokenType } from "./tokenType";
import { errorReporter } from "./error";

export class Parser {
  private tokens: IToken[] = [];
  private current = 0;
  constructor(tokens: IToken[]) {
    this.tokens = tokens;
  }

  parse() {
    const statements: Stmt[] = [];
    try {
      while (!this.isAtEnd()) {
        // statements.push(this.statement());
        statements.push(this.declaration());
      }
    } catch (error) {
      errorReporter.report(error as Error);
      this.synchronize();
      // throw new Error(`Error during parsing. ${error}`);
    }
    return statements;
  }

  private expression() {
    return this.equality();
  }

  private declaration(): Stmt {
    if (this.match("VAR")) {
      return this.varDeclaration();
    }
    return this.statement();
  }

  private statement(): Stmt {
    if (this.match("PRINT")) return this.printStatement();

    return this.expressionStatement();
  }

  private printStatement(): Stmt {
    const value = this.expression();
    this.consume("SEMICOLON", "Expect ';' after value.");
    return new Print(value);
  }

  private varDeclaration(): Stmt {
    const name = this.consume("IDENTIFIER", "Expect variable name.");

    let initializer: ast.Expr | null = null;
    if (this.match("EQUAL")) {
      initializer = this.expression();
    }

    this.consume("SEMICOLON", "Expect ';' after variable declaration.");
    return new Var(name, initializer);
  }

  private expressionStatement(): Stmt {
    const expr = this.expression();
    this.consume("SEMICOLON", "Expect ';' after expression.");
    return new Expression(expr);
  }

  private equality(): ast.Expr {
    let expr = this.comparison();

    while (this.match("BANG_EQUAL", "EQUAL_EQUAL")) {
      const operator = this.previous();
      const right = this.comparison();
      expr = new ast.BinaryExpr(expr, operator, right);
    }
    // console.log("[equality] : ");
    return expr;
  }

  private comparison(): ast.Expr {
    let expr = this.term();

    while (this.match("GREATER", "GREATER_EQUAL", "LESS", "LESS_EQUAL")) {
      const operator = this.previous();
      const right = this.term();
      expr = new ast.BinaryExpr(expr, operator, right);
    }
    // console.log("[comparision] : ");
    return expr;
  }

  private term(): ast.Expr {
    let expr = this.factor();

    while (this.match("MINUS", "PLUS")) {
      const operator = this.previous();
      // console.log("[term] : while: ", operator, expr);
      const right = this.factor();
      // console.log("[term] : RIGHT: ",right);
      expr = new ast.BinaryExpr(expr, operator, right);
    }
    // console.log("[term] : ");
    return expr;
  }

  private factor(): ast.Expr {
    let expr = this.unary();
    // console.log("[factor] : ");

    while (this.match("SLASH", "STAR")) {
      const operator = this.previous();
      const right = this.unary();
      expr = new ast.BinaryExpr(expr, operator, right);
    }

    return expr;
  }

  private unary(): ast.Expr {
    if (this.match("BANG", "MINUS")) {
      const operator = this.previous();
      const right = this.unary();
      return new ast.UnaryExpr(operator, right);
    }

    // console.log("[unary] : ");
    return this.primary();
  }

  private primary(): ast.Expr {
    if (this.match("FALSE")) return new ast.LiteralExpr(false);
    if (this.match("TRUE")) return new ast.LiteralExpr(true);
    if (this.match("NIL")) return new ast.LiteralExpr(null);

    if (this.match("NUMBER", "STRING")) {
      // console.log("[primary] : match NUMBER or STRING: ", this.tokens[this.current - 1]);

      return new ast.LiteralExpr(this.previous().literal);
    }
    if (this.match("IDENTIFIER")) {
      return new ast.Variable(this.previous());
    }
    if (this.match("LEFT_PAREN")) {
      const expr = this.expression();
      this.consume("RIGHT_PAREN", "Expect ')' after expression.");
      return new ast.GroupingExpr(expr);
    }

    throw new Error(`Error ${this.peek()} Expect expression.`);
  }

  private match(...args: TokenType[]) {
    // console.log("[match] args... ", args)
    const result = args.some((type) => {
      if (this.check(type)) {
        this.advance();
        return true;
      }
      return false;
    });

    return result;
  }

  private consume(type: TokenType, message: string): IToken {
    if (this.check(type)) {
      return this.advance();
    }
    const errorMsg = "Error at line: " + this.peek().line + " " + message;
    throw new Error(errorMsg);
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type == type;
  }

  private advance() {
    if (!this.isAtEnd()) {
      this.current++;
    }
    return this.previous(); // TODO why previous() ?
  }

  private isAtEnd() {
    // return peek().type == EOF;
    return this.peek().type == "EOF";
  }

  private peek() {
    // console.log("[peek] : ", this.tokens[this.current])
    return this.tokens[this.current];
    // return tokens.get(this.current);
  }

  private previous() {
    // return this.tokens.get(current - 1);
    return this.tokens[this.current - 1];
  }

  // private ParseError error(Token token, String message) {
  // 	IntroTest.error(token, message);
  // 	return new ParseError();
  // }

  private synchronize() {
    this.advance();

    while (!this.isAtEnd()) {
      if (this.previous().type == "SEMICOLON") {
        return;
      }

      switch (this.peek().type) {
        case "CLASS":
        case "FUN":
        case "VAR":
        case "FOR":
        case "IF":
        case "WHILE":
        case "PRINT":
        case "RETURN":
          return;
      }

      this.advance();
    }
  }
}
