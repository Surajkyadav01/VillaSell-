/**
 * Cloudinary Direct Client-Side Unsigned Upload Service
 * Cloud Name: rxjfi2wz
 * Upload Preset: villasell_uploads
 */

export interface CloudinaryUploadResponse {
  asset_id?: string;
  public_id?: string;
  version?: number;
  format?: string;
  resource_type?: 'image' | 'video' | 'raw';
  created_at?: string;
  bytes?: number;
  width?: number;
  height?: number;
  url: string;
  secure_url: string;
  duration?: number;
  thumbnail_url?: string;
}

export const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/rxjfi2wz/auto/upload';
export const CLOUDINARY_UPLOAD_PRESET = 'villasell_uploads';

/**
 * Uploads a file (photo or video) directly to Cloudinary using XMLHttpRequest for live progress updates.
 */
export const uploadToCloudinary = (
  file: File,
  onProgress?: (percent: number) => void
): Promise<CloudinaryUploadResponse> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open('POST', CLOUDINARY_UPLOAD_URL, true);

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.min(100, Math.round((event.loaded / event.total) * 100));
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data: CloudinaryUploadResponse = JSON.parse(xhr.responseText);
          resolve(data);
        } catch (e) {
          reject(new Error('Failed to parse Cloudinary response'));
        }
      } else {
        try {
          const errData = JSON.parse(xhr.responseText);
          reject(new Error(errData?.error?.message || `Upload failed with status ${xhr.status}`));
        } catch {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network connection error while uploading to Cloudinary'));
    };

    xhr.ontimeout = () => {
      reject(new Error('Upload timed out, please check your network connection'));
    };

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    xhr.send(formData);
  });
};

/**
 * Checks if a media URL represents a video
 */
export const isVideoUrl = (url?: string): boolean => {
  if (!url) return false;
  return (
    url.includes('/video/upload/') ||
    /\.(mp4|webm|mov|ogg|m4v|avi)($|\?)/i.test(url)
  );
};
