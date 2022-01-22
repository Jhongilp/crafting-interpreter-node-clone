import { IToken } from "./token";
import { LoxObject } from "./scanner";

export interface Expr {
  accept<R>(visitor: ExprVisitor<R>): R;
}

export interface ExprVisitor<R> {
  visitBinaryExpr(expr: BinaryExpr): R;
  visitGroupingExpr(expr: GroupingExpr): R;
  visitLiteralExpr(expr: LiteralExpr): R;
  visitUnaryExpr(expr: UnaryExpr): R;
  visitVariableExpr(expr: Variable): R;
}

export class BinaryExpr implements Expr {
  left: Expr;
  operator: IToken;
  right: Expr;

  constructor(left: Expr, operator: IToken, right: Expr) {
    this.left = left;
    this.operator = operator;
    this.right = right;
  }

  accept<R>(visitor: ExprVisitor<R>): R {
    return visitor.visitBinaryExpr(this);
  }
}

export class GroupingExpr implements Expr {
  expression: Expr;

  constructor(expression: Expr) {
    this.expression = expression;
  }

  accept<R>(visitor: ExprVisitor<R>): R {
    return visitor.visitGroupingExpr(this);
  }
}

export class LiteralExpr implements Expr {
  value: LoxObject;

  constructor(value: LoxObject) {
    this.value = value;
  }

  accept<R>(visitor: ExprVisitor<R>): R {
    return visitor.visitLiteralExpr(this);
  }
}

export class UnaryExpr implements Expr {
  operator: IToken;
  right: Expr;

  constructor(operator: IToken, right: Expr) {
    this.operator = operator;
    this.right = right;
  }

  accept<R>(visitor: ExprVisitor<R>): R {
    return visitor.visitUnaryExpr(this);
  }
}
export class Variable implements Expr {
  name: IToken;

  constructor(name: IToken) {
    this.name = name;
  }

  accept<R>(visitor: ExprVisitor<R>) {
    return visitor.visitVariableExpr(this);
  }
}
