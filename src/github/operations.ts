import { octokit } from "./client.js";
import {
  CreateCommitInput,
  CreateIssueInput,
  CreateRepositoryInput,
  ListIssuesInput,
  ListRepositoriesInput,
} from "../schemas/index.js";
import { AuthenticationError, GitHubAPIError, NetworkError } from "../errors/index.js";

function handleGitHubError(error: any): never {
  if (error.status === 401) {
    throw new AuthenticationError("Token inválido o no autorizado.");
  }

  if (error.status === 403) {
    throw new GitHubAPIError("No tienes permisos suficientes o alcanzaste el límite de GitHub.");
  }

  if (error.status === 404) {
    throw new GitHubAPIError("El repositorio solicitado no fue encontrado. Verifica el owner y el nombre.");
  }

  if (error.status >= 500) {
    throw new NetworkError("GitHub no respondió correctamente.");
  }

  throw new GitHubAPIError(error.message ?? "Error desconocido de GitHub.");
}

export async function createRepository(input: CreateRepositoryInput) {
  try {
    const response = await octokit.repos.createForAuthenticatedUser({
      name: input.name,
      description: input.description,
      private: input.private,
    });

    return {
      name: response.data.name,
      url: response.data.html_url,
      private: response.data.private,
    };
  } catch (error) {
    handleGitHubError(error);
  }
}

export async function listRepositories(input: ListRepositoriesInput) {
  try {
    const response = await octokit.repos.listForAuthenticatedUser({
      per_page: input.perPage,
      sort: "updated",
    });

    return response.data.map((repo) => ({
      name: repo.name,
      url: repo.html_url,
      private: repo.private,
    }));
  } catch (error) {
    handleGitHubError(error);
  }
}

export async function createIssue(input: CreateIssueInput) {
  try {
    const response = await octokit.issues.create({
      owner: input.owner,
      repo: input.repo,
      title: input.title,
      body: input.body,
    });

    return {
      number: response.data.number,
      title: response.data.title,
      url: response.data.html_url,
      state: response.data.state,
    };
  } catch (error) {
    handleGitHubError(error);
  }
}

export async function listIssues(input: ListIssuesInput) {
  try {
    const response = await octokit.issues.listForRepo({
      owner: input.owner,
      repo: input.repo,
      state: input.state,
    });

    return response.data.map((issue) => ({
      number: issue.number,
      title: issue.title,
      url: issue.html_url,
      state: issue.state,
    }));
  } catch (error) {
    handleGitHubError(error);
  }
}

export async function createCommit(input: CreateCommitInput) {
  try {
    let sha: string | undefined;

    try {
      const existingFile = await octokit.repos.getContent({
        owner: input.owner,
        repo: input.repo,
        path: input.path,
        ref: input.branch,
      });

      if (!Array.isArray(existingFile.data) && "sha" in existingFile.data) {
        sha = existingFile.data.sha;
      }
    } catch {
      sha = undefined;
    }

    const response = await octokit.repos.createOrUpdateFileContents({
      owner: input.owner,
      repo: input.repo,
      path: input.path,
      message: input.message,
      content: Buffer.from(input.content).toString("base64"),
      branch: input.branch,
      sha,
    });

    return {
      commitSha: response.data.commit.sha,
      url: response.data.commit.html_url,
      path: input.path,
    };
  } catch (error) {
    handleGitHubError(error);
  }
}