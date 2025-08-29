/**
 * S3 Storage Types and Utilities for use on client and server
 *
 * This file contains types, interfaces, and utilities that can be used on both
 * client and server sides. This file must not contain any server-specific code.
 */

// Types for S3 configuration
export interface S3Config {
  endpoint: string;
  region: string;
  bucket: string;
  accessKey: string;
  secretKey: string;
  forcePathStyle?: boolean; // Needed for some S3-compatible providers
  publicUrl?: string; // Optional custom public URL for the bucket
}

// For client-to-server file upload
export interface FileUploadRequest {
  fileData: string; // Base64 encoded file data
  fileName: string;
  fileType: string;
  folder?: string;
  customFileName?: string;
}

// Supported file types
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

// Maximum file size (5MB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Options for file uploads
export interface UploadOptions {
  folder?: string; // Optional folder path within bucket
  fileName?: string; // Optional custom filename
  contentType?: string; // Optional content type override
  maxSize?: number; // Optional file size limit override
}

// Browser-compatible UUID generator
export function generateUUID(): string {
  // Use crypto.randomUUID() if available (modern browsers and Node.js)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback implementation for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Validates a file before upload (can be used in client code)
 */
export async function validateFile(
  file: File,
  options?: { maxSize?: number; allowedTypes?: string[] }
) {
  const maxSize = options?.maxSize || MAX_FILE_SIZE;
  const allowedTypes = options?.allowedTypes || ALLOWED_FILE_TYPES;

  if (file.size > maxSize) {
    throw new Error(
      `File too large. Maximum size is ${maxSize / (1024 * 1024)}MB`
    );
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Unsupported file type. Please upload a valid image file.');
  }

  return true;
}
