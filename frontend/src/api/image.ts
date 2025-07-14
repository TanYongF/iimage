import axios from 'axios';

export interface UploadResult {
  url: string;
  fileName: string;
}

export async function uploadImageToOSS(file: File): Promise<UploadResult> {
  const formData = new FormData();
  formData.append('image', file);
  const response = await axios.post('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
} 