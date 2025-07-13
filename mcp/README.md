# PhotoOmmit MCP Server

A Model Context Protocol (MCP) server for PhotoOmmit image upload service with Alibaba Cloud OSS integration.

## Features

- 🖼️ **Image Upload**: Upload local images to Alibaba Cloud OSS
- 📥 **Image Download**: Download images from OSS by file ID
- 🗑️ **Image Delete**: Delete images from OSS storage
- ℹ️ **Image Info**: Get detailed information about stored images
- 🔐 **Secure**: Environment-based configuration for OSS credentials
- 🚀 **Fast**: Optimized for high-performance image operations

## Installation

```bash
npm install @tans-dev/photoommit-mcp
```

## Quick Start

### 1. Set up environment variables

Create a `.env` file with your OSS configuration:

```env
OSS_ACCESS_KEY_ID=your_access_key_id
OSS_ACCESS_KEY_SECRET=your_access_key_secret
OSS_BUCKET=your_bucket_name
OSS_REGION=your_region
OSS_ENDPOINT=your_endpoint
```

### 2. Use as CLI tool

```bash
# Install globally
npm install -g @tans-dev/photoommit-mcp

# Run the MCP server
photoommit-mcp
```

### 3. Use as library

```javascript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import photoommitMCP from '@tans-dev/photoommit-mcp';

// Create and start MCP server
const server = new McpServer({
    name: "photoommit-mcp",
    version: "1.0.0",
    capabilities: {
        resources: {},
        tools: {},
    },
});

// Register tools
photoommitMCP.registerTools(server);

const transport = new StdioServerTransport();
await server.connect(transport);
```

## Available Tools

### 1. image-upload-oss

Upload a local image file to OSS.

**Parameters:**
- `filePath` (string): Local file path
- `fileName` (string, optional): Custom filename

**Returns:**
```json
{
  "id": "unique_file_id",
  "url": "https://your-bucket.oss-region.aliyuncs.com/PhotoOmmit/filename.jpg",
  "size": 12345,
  "message": "上传成功"
}
```

### 2. image-download-oss

Download an image from OSS by file ID.

**Parameters:**
- `id` (string): OSS file unique ID

**Returns:**
- Image data as base64 encoded string with MIME type

### 3. image-delete-oss

Delete an image from OSS storage.

**Parameters:**
- `id` (string): OSS file unique ID

**Returns:**
```json
{
  "id": "file_id",
  "success": true,
  "message": "删除成功"
}
```

### 4. image-info-oss

Get detailed information about a stored image.

**Parameters:**
- `id` (string): OSS file unique ID

**Returns:**
```json
{
  "id": "file_id",
  "url": "https://your-bucket.oss-region.aliyuncs.com/PhotoOmmit/filename.jpg",
  "size": 12345,
  "uploadTime": "Wed, 21 Oct 2023 07:28:00 GMT"
}
```

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OSS_ACCESS_KEY_ID` | Alibaba Cloud Access Key ID | Yes |
| `OSS_ACCESS_KEY_SECRET` | Alibaba Cloud Access Key Secret | Yes |
| `OSS_BUCKET` | OSS bucket name | Yes |
| `OSS_REGION` | OSS region (e.g., `oss-cn-hangzhou`) | Yes |
| `OSS_ENDPOINT` | OSS endpoint URL | Yes |

### OSS Configuration

The MCP server automatically configures OSS with the following settings:
- **Secure**: HTTPS enabled by default
- **Timeout**: 60 seconds
- **Directory**: `PhotoOmmit/` (files are stored in this subdirectory)

## Development

### Prerequisites

- Node.js >= 18.0.0
- TypeScript
- Alibaba Cloud OSS account

### Setup

```bash
# Clone the repository
git clone https://github.com/TanYongF/iimage.git
cd iimage/mcp

# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run dev
```

### Build

```bash
npm run build
```

### Test

```bash
npm test
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

- 📧 Email: tan13621251388@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/TanYongF/iimage/issues)
- 📖 Documentation: [GitHub Wiki](https://github.com/TanYongF/iimage/wiki)

## Changelog

### v1.0.0
- Initial release
- Basic image upload/download/delete operations
- OSS integration
- MCP protocol support 