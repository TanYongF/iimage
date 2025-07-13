import oss from '../utils/oss.js';
import { Readable } from 'stream';
import fs from 'fs';

export async function mcpDelete(id: string): Promise<boolean> {
    const result = await oss.deleteOSSFile(id);
    return !!(result && result.success);
}


export async function mcpDownload(id: string): Promise<Readable | null> {
    const fileStream = await oss.getOSSFileStream(id);
    return fileStream || null;
}

export async function mcpInfo(id: string): Promise<any> {
    const info = await oss.getOSSFileInfo(id);
    return info;
}


export async function mcpUpload(filePath: string, fileName?: string): Promise<{ url: string, id: string, size: number }> {
    const fileBuffer = fs.readFileSync(filePath);
    // 这里假设 uploadToOSS 接收 { buffer, originalname } 结构
    const result = await oss.uploadToOSS({ buffer: fileBuffer, originalname: fileName || 'uploaded-image.png' });
    return {
        url: result.url,
        id: result.fileName,
        size: fileBuffer.length
    };
} 