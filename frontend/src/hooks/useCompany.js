import { useState } from 'react';

const API_BASE_URL = 'http://localhost:8000';

/**
 * @typedef {Object} CompanyCreatePayload
 * @property {string} name - Legal or trade name of the company.
 * @property {string} industry - Industry domain the company operates in.
 * @property {string} size - Number of employees or scale category.
 * @property {string} [description] - Optional brief overview of operations.
 */

/**
 * @typedef {Object} CompanyCreateResponse
 * @property {string} id - Generated company ID.
 * @property {string} message - Confirmation message.
 */

/**
 * Hook for company profile management.
 */
export function useCompany() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successData, setSuccessData] = useState(null);

    /**
     * Sends a POST request to register a company profile.
     * @param {CompanyCreatePayload} payload
     * @returns {Promise<CompanyCreateResponse>}
     */
    const createCompany = async (payload) => {
        setLoading(true);
        setError(null);
        setSuccessData(null);

        try {
            const response = await fetch(`${API_BASE_URL}/company/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setSuccessData(data);
            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        createCompany,
        loading,
        error,
        successData,
    };
}
