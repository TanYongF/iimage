import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { mcpUpload, mcpDownload, mcpDelete, mcpInfo } from './tool/index.js';
import path from 'path';
import mime from 'mime';

// Create server instance
const server = new McpServer({
    name: "image-uploader",
    version: "1.0.0",
    capabilities: {
        resources: {},
        tools: {},
    },
});


// 注册 mcpUpload 工具
server.tool(
    "image-upload-oss",
    "上传本地文件到 OSS 云存储。传入本地文件路径（filePath），可选自定义 OSS 文件名（fileName）。返回上传后的文件访问链接、唯一 ID 及文件大小。",
    {
        filePath: z.string().describe("本地文件路径"),
        fileName: z.string().optional().describe("文件名，可选")
    },
    async ({ filePath, fileName }) => {
        const name = fileName || path.basename(filePath);
        const result = await mcpUpload(filePath, name);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        id: result.id,
                        url: result.url,
                        size: result.size,
                        message: "上传成功"
                    })
                }
            ]
        };
    },
);

// 注册 mcpDownload 工具
server.tool(
    "image-download-oss",
    "根据 OSS 文件唯一 ID 下载文件，返回文件流信息。适用于将 OSS 文件保存到本地或进行后续处理。",
    {
        id: z.string().describe("OSS 文件唯一 ID"),
    },
    async ({ id }) => {
        const stream = await mcpDownload(id);
        if (!stream) {
            return { content: [{ type: "text", text: JSON.stringify({ code: 1, message: "未找到文件", data: null }) }] };
        }
        // 将 stream 转为 buffer
        const chunks: Buffer[] = [];
        for await (const chunk of stream) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);
        const base64 = buffer.toString('base64');
        const mimeType = mime.getType(id) || 'application/octet-stream';
        return {
            content: [
                {
                    type: "image",
                    data: base64,
                    mimeType
                }
            ]
        };
    },
);

// 注册 mcpDelete 工具
server.tool(
    "image-delete-oss",
    "根据 OSS 文件唯一 ID 删除云端文件。删除成功返回提示，未找到或失败会有相应提示。",
    {
        id: z.string().describe("OSS 文件唯一 ID")
    },
    async ({ id }) => {
        const ok = await mcpDelete(id);
        return {
            content: [
                { type: "text", text: JSON.stringify({ id, success: ok, message: ok ? "删除成功" : "删除失败或未找到文件" }) }
            ]
        };
    },
);

// 注册 mcpInfo 工具
server.tool(
    "image-info-oss",
    "根据 OSS 文件唯一 ID 查询文件详细信息，包括访问链接、大小、上传时间等。",
    {
        id: z.string().describe("OSS 文件唯一 ID")
    },
    async ({ id }) => {
        const info = await mcpInfo(id);
        if (!info) {
            return { content: [{ type: "text", text: JSON.stringify({ error: "未找到文件信息" }) }] };
        }
        return {
            content: [
                { type: "text", text: JSON.stringify(info) }
            ]
        };
    },
);

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Weather MCP Server running on stdio");
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});