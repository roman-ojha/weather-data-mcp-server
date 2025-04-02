// https://modelcontextprotocol.io/introduction

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";

const server = new McpServer({
  name: "Weather Data MCP Server",
  version: "1.0.0",
});
