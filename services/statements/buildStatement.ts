import { Statement } from "./types";

export function buildStatement(
  statement: Statement
) {
  return {
    ...statement,
    generatedAt: new Date().toISOString(),
  };
}
