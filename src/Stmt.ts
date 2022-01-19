import { IToken } from "./token";
import { Expr } from "./Exp";

export interface Stmt {
  accept<R>(visitor: Visitor<R>): R;
}

interface Visitor<R> {
  visitExpressionStmt(stmt: Expression): R;
  visitPrintStmt(stmt: Print): R;
  visitVarStmt(stmt: Var): R;
}

export class Expression implements Stmt {
  expression: Expr;
  constructor(expression: Expr) {
    this.expression = expression;
  }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitExpressionStmt(this);
  }
}

export class Print implements Stmt {
  expression: Expr;
  constructor(expression: Expr) {
    this.expression = expression;
  }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitPrintStmt(this);
  }
}

export class Var implements Stmt {
  initializer: Expr;
  name: IToken;

  constructor(name: IToken, initializer: Expr) {
    this.initializer = initializer;
    this.name = name;
  }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitVarStmt(this);
  }
}
