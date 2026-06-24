import { describe, expect, it } from "vitest";
import {
  createRepositorySchema,
  createIssueSchema,
} from "../src/schemas/index.js";

describe("Schemas", () => {
  it("acepta repositorio válido", () => {
    const result = createRepositorySchema.safeParse({
      name: "mi-repo",
      description: "test",
    });

    expect(result.success).toBe(true);
  });

  it("rechaza repositorio inválido", () => {
    const result = createRepositorySchema.safeParse({
      name: "a",
    });

    expect(result.success).toBe(false);
  });

  it("acepta issue válido", () => {
    const result = createIssueSchema.safeParse({
      owner: "ezequiel",
      repo: "repo-test",
      title: "Bug",
      body: "Descripción",
    });

    expect(result.success).toBe(true);
  });

  it("rechaza issue sin título", () => {
    const result = createIssueSchema.safeParse({
      owner: "ezequiel",
      repo: "repo-test",
      title: "",
      body: "Descripción",
    });

    expect(result.success).toBe(false);
  });
});