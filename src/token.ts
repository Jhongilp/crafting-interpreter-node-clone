import { TokenType } from "./tokenType";

export function Token(
  type: TokenType,
  lexeme: string,
  literal: any,
  line: number
) {
  return {
    type,
    lexeme,
    literal,
    line,
  };
}
