import { TokenType } from "./tokenType";

export type IToken = {
  type: TokenType;
  lexeme: string;
  literal: any;
  line: number;
};

export function Token({ type, lexeme, literal, line }: IToken) {
  return {
    type,
    lexeme,
    literal,
    line,
  };
}
