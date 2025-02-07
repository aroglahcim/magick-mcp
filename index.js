#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { exec } from 'child_process';
import util from 'util';
import { z } from "zod";

import packageJson from './package.json' with { type: "json" };

const execAsync = util.promisify(exec);

const server = new McpServer({
    name: "Magick Convert",
    version: packageJson.version,
});

server.tool("run-magick-command",
    { argumentsString: z.string(), },
    async ({ argumentsString }) => {
        const { stdout, stderr } = await execAsync(`magick ${argumentsString}`);
        console.error({ stdout, stderr });
        return { content: [{ type: "text", text: stdout }] };
    },
);

const transport = new StdioServerTransport();
await server.connect(transport);
