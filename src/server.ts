import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { githubTools } from "./tools/index.js";

const server = new McpServer({
  name: "github-mcp-server",
  version: "1.0.0",
});

for (const tool of githubTools) {
  server.tool(
    tool.name,
    tool.description,
    (tool.inputSchema as any).shape,
    async (input: unknown) => {
      return await tool.handler(input);
    }
  );
}

const transport = new StdioServerTransport();

await server.connect(transport);