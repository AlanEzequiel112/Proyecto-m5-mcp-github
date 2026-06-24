import { z } from "zod";
import {
  createCommitSchema,
  createIssueSchema,
  createRepositorySchema,
  listIssuesSchema,
  listRepositoriesSchema,
} from "../schemas/index.js";
import {
  createCommit,
  createIssue,
  createRepository,
  listIssues,
  listRepositories,
} from "../github/operations.js";
import { transformError, ValidationError } from "../errors/index.js";

async function runTool<T>(
  schema: z.ZodSchema<T>,
  input: unknown,
  operation: (data: T) => Promise<unknown>
) {
  try {
    const parsedInput = schema.parse(input);
    const result = await operation(parsedInput);

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.issues.map((issue) => issue.message).join(". ");
      throw new ValidationError(message);
    }

    throw error;
  }
}

export const githubTools = [
  {
    name: "create_repository",
    description:
      "Crea un nuevo repositorio en la cuenta autenticada de GitHub. Úsalo cuando el usuario quiera crear un repositorio nuevo.",
    inputSchema: createRepositorySchema,
    handler: async (input: unknown) => {
      try {
        return await runTool(createRepositorySchema, input, createRepository);
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: transformError(error) }],
          isError: true,
        };
      }
    },
  },
  {
    name: "list_repositories",
    description:
      "Lista repositorios del usuario autenticado en GitHub. Úsalo cuando el usuario quiera ver sus repositorios.",
    inputSchema: listRepositoriesSchema,
    handler: async (input: unknown) => {
      try {
        return await runTool(listRepositoriesSchema, input, listRepositories);
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: transformError(error) }],
          isError: true,
        };
      }
    },
  },
  {
    name: "create_issue",
    description:
      "Crea un issue en un repositorio específico de GitHub. Requiere owner, repo, title y body.",
    inputSchema: createIssueSchema,
    handler: async (input: unknown) => {
      try {
        return await runTool(createIssueSchema, input, createIssue);
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: transformError(error) }],
          isError: true,
        };
      }
    },
  },
  {
    name: "list_issues",
    description:
      "Lista issues de un repositorio específico de GitHub. Permite filtrar por open, closed o all.",
    inputSchema: listIssuesSchema,
    handler: async (input: unknown) => {
      try {
        return await runTool(listIssuesSchema, input, listIssues);
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: transformError(error) }],
          isError: true,
        };
      }
    },
  },
  {
    name: "create_commit",
    description:
      "Crea o modifica un archivo en un repositorio de GitHub mediante un commit. Requiere owner, repo, path, content y message.",
    inputSchema: createCommitSchema,
    handler: async (input: unknown) => {
      try {
        return await runTool(createCommitSchema, input, createCommit);
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: transformError(error) }],
          isError: true,
        };
      }
    },
  },
];