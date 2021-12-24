import {
  ExprVisitor,
  Expr,
  LiteralExpr,
  BinaryExpr,
  UnaryExpr,
  GroupingExpr,
} from "./Exp";
import { LoxObject } from "./scanner";
import { IToken } from "./token";
import { RuntimeError } from "./error";

export class Interpreter implements ExprVisitor<LoxObject> {
  interpret(expression: Expr) {
    const value = this.evaluate(expression);
    console.log(this.stringify(value));
  }

  private evaluate(expr: Expr): LoxObject {
    return expr.accept(this);
  }

  private stringify(object: LoxObject) {
    if (object === null) return "nil";

    if (typeof object === "number") {
      let text = object.toString();
      if (text.endsWith(".0")) text = text.substring(0, text.length - 2);
      return text;
    }

    return object.toString();
  }

  private isTruthy(object: LoxObject): boolean {
    if (object === null) return false;
    if (typeof object === "boolean") return object;
    return true;
  }

  private isEqual(a: LoxObject, b: LoxObject): boolean {
    if (a === null && b === null) return true;
    if (a === null) return false;
    return a === b;
  }

  checkNumberOperand(token: IToken, operand: LoxObject): void {
    if (typeof operand === "number") return;
    else throw new RuntimeError("Operand must be a number", token);
  }

  checkNumberOperands(token: IToken, left: LoxObject, right: LoxObject): void {
    if (typeof left === "number" && typeof right === "number") return;
    else throw new RuntimeError("Operands must be numbers", token);
  }

  public visitLiteralExpr(expr: LiteralExpr) {
    return expr.value;
  }

  visitGroupingExpr(expr: GroupingExpr): LoxObject {
    return this.evaluate(expr.expression);
  }

  visitUnaryExpr(expr: UnaryExpr) {
    const right = this.evaluate(expr.right);

    switch (expr.operator.type) {
      case "BANG":
        return !this.isTruthy(right);
      case "MINUS":
        this.checkNumberOperand(expr.operator, right);
        return -(right as number);
    }

    // Unreachable.
    return null;
  }

  visitBinaryExpr(expr: BinaryExpr): LoxObject {
    const left = this.evaluate(expr.left);
    const right = this.evaluate(expr.right);

    switch (expr.operator.type) {
      case "GREATER":
        this.checkNumberOperands(expr.operator, left, right);
        return (left as number) > (right as number);
      case "GREATER_EQUAL":
        this.checkNumberOperands(expr.operator, left, right);
        return (left as number) >= (right as number);
      case "LESS":
        this.checkNumberOperands(expr.operator, left, right);
        return (left as number) < (right as number);
      case "LESS_EQUAL":
        this.checkNumberOperands(expr.operator, left, right);
        return (left as number) <= (right as number);
      case "MINUS":
        this.checkNumberOperands(expr.operator, left, right);
        return (left as number) - (right as number);
      case "BANG_EQUAL":
        return !this.isEqual(left, right);
      case "EQUAL_EQUAL":
        return this.isEqual(left, right);
      case "SLASH":
        this.checkNumberOperands(expr.operator, left, right);
        return (left as number) / (right as number);
      case "STAR":
        this.checkNumberOperands(expr.operator, left, right);
        return (left as number) * (right as number);
      case "PLUS":
        if (typeof left === "number" && typeof right === "number") {
          return left + right;
        }
        if (typeof left === "string" && typeof right === "string") {
          return left + right;
        }
        throw new RuntimeError(
          "Operands must be two numbers or two strings",
          expr.operator
        );
    }

    // Unreachable
    return null;
  }
}
