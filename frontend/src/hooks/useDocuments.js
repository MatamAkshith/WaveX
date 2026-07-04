import { useState } from 'react';

const API_BASE_URL = 'http://localhost:8000';

/**
 * @typedef {Object} DocumentMetadata
 * @property {string} filename - Original name of the uploaded file.
 * @property {string} upload_date - Timestamp of upload.
 * @property {string} type - Document type category (e.g. PDF, CSV).
 */

/**
 * @typedef {Object} DocumentUploadResponse
 * @property {string} document_id - Generated document identifier.
 * @property {string} message - Upload success confirmation.
 */

/**
 * Hook for managing document ingestion and upload operations.
 */
export function useDocuments() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    /**
     * Lists all uploaded document metadata.
     * @returns {Promise<DocumentMetadata[]>}
     */
    const fetchDocuments = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/documents/`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setDocuments(data);
            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Uploads a document to the server with progress tracking.
     * @param {File} file
     * @returns {Promise<DocumentUploadResponse>}
     */
    const uploadDocument = (file) => {
        return new Promise((resolve, reject) => {
            setIsUploading(true);
            setUploadProgress(0);
            setError(null);

            const xhr = new XMLHttpRequest();
            const formData = new FormData();
            formData.append('file', file);

            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    const percentComplete = Math.round((event.loaded / event.total) * 100);
                    setUploadProgress(percentComplete);
                }
            });

            xhr.addEventListener('load', () => {
                setIsUploading(false);
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        resolve(response);
                    } catch (e) {
                        reject(new Error('Invalid response from server'));
                    }
                } else {
                    try {
                        const errorData = JSON.parse(xhr.responseText);
                        reject(new Error(errorData.detail || `HTTP error! status: ${xhr.status}`));
                    } catch (e) {
                        reject(new Error(`Upload failed with status: ${xhr.status}`));
                    }
                }
            });

            xhr.addEventListener('error', () => {
                setIsUploading(false);
                reject(new Error('Network error during file upload'));
            });

            xhr.addEventListener('abort', () => {
                setIsUploading(false);
                reject(new Error('Upload aborted'));
            });

            xhr.open('POST', `${API_BASE_URL}/documents/upload`);
            xhr.send(formData);
        });
    };

    return {
        fetchDocuments,
        uploadDocument,
        documents,
        uploadProgress,
        isUploading,
        loading,
        error,
    };
}
