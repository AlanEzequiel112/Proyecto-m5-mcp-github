import { z } from "zod";

const repoNameRegex = /^[a-zA-Z0-9-]{3,100}$/;

export const repositoryNameSchema = z
  .string()
  .min(3, "El nombre del repositorio debe tener al menos 3 caracteres")
  .max(100, "El nombre del repositorio no puede superar los 100 caracteres")
  .regex(
    repoNameRegex,
    "El nombre del repositorio solo puede contener letras, números y guiones"
  );

export const createRepositorySchema = z.object({
  name: repositoryNameSchema,
  description: z.string().max(300).optional(),
  private: z.boolean().optional().default(false),
});

export const createIssueSchema = z.object({
  owner: z.string().min(1, "El owner es obligatorio"),
  repo: repositoryNameSchema,
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  body: z.string().min(1, "El body es obligatorio"),
});

export const listRepositoriesSchema = z.object({
  perPage: z.number().int().min(1).max(100).optional().default(10),
});

export const createCommitSchema = z.object({
  owner: z.string().min(1, "El owner es obligatorio"),
  repo: repositoryNameSchema,
  path: z.string().min(1, "La ruta del archivo es obligatoria"),
  content: z.string().min(1, "El contenido del archivo es obligatorio"),
  message: z.string().min(3, "El mensaje del commit debe tener al menos 3 caracteres"),
  branch: z.string().min(1).optional().default("main"),
});

export const listIssuesSchema = z.object({
  owner: z.string().min(1, "El owner es obligatorio"),
  repo: repositoryNameSchema,
  state: z.enum(["open", "closed", "all"]).optional().default("open"),
});

export type CreateRepositoryInput = z.infer<typeof createRepositorySchema>;
export type CreateIssueInput = z.infer<typeof createIssueSchema>;
export type ListRepositoriesInput = z.infer<typeof listRepositoriesSchema>;
export type CreateCommitInput = z.infer<typeof createCommitSchema>;
export type ListIssuesInput = z.infer<typeof listIssuesSchema>;