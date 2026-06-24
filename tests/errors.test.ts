import { describe, expect, it } from "vitest";
import {
  AuthenticationError,
  GitHubAPIError,
  transformError,
} from "../src/errors/index.js";

describe("Errores", () => {
  it("transforma AuthenticationError", () => {
    expect(
      transformError(new AuthenticationError("test"))
    ).toContain("GitHub");
  });

  it("transforma GitHubAPIError", () => {
    expect(
      transformError(new GitHubAPIError("Repo no encontrado"))
    ).toContain("Repo");
  });
});