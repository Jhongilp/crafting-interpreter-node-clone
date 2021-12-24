import { IToken } from "./token";

export class SyntaxError extends Error {
  name = "SyntaxError"
  message: string
  line?: number
  where?: string

  constructor(message: string, line?: number, where?: string) {
    super()
    this.message = message
    this.line = line
    this.where = where
  }
}

export class RuntimeError extends Error {
  name = "RuntimeError"
  message: string
  token: IToken

  constructor(message: string, token: IToken) {
    super()
    this.message = message
    this.token = token
  }
}