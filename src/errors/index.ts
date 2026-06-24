export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class GitHubAPIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GitHubAPIError";
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NetworkError";
  }
}

export function transformError(error: unknown): string {
  if (error instanceof ValidationError) {
    return error.message;
  }

  if (error instanceof AuthenticationError) {
    return "No fue posible autenticarse con GitHub. Verifica tu token.";
  }

  if (error instanceof GitHubAPIError) {
    return error.message;
  }

  if (error instanceof NetworkError) {
    return "Ocurrió un problema de red al comunicarse con GitHub.";
  }

  return "Ocurrió un error inesperado.";
}