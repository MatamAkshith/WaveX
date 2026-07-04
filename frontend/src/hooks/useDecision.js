import { useState } from 'react';

const API_BASE_URL = 'http://localhost:8000';

/**
 * @typedef {Object} ExpertAnalysis
 * @property {string} agent_name - Specialty domain name of the agent.
 * @property {string} analysis - Evaluation notes.
 * @property {string} recommendation - Proposed recommendation.
 */

/**
 * @typedef {Object} DecisionDetailedResponse
 * @property {string} decision_id - Unique decision run tracker ID.
 * @property {string[]} planner - List of expert agents consulted.
 * @property {ExpertAnalysis[]} experts - Array of expert evaluation results.
 * @property {string} recommendation - Synthesized judge consensus verdict.
 * @property {number} confidence - Synthesized confidence score (0.0 to 1.0).
 * @property {string[]} next_steps - Actionable checklist items.
 * @property {string} status - Overall status (e.g. 'completed').
 */

/**
 * @typedef {Object} DecisionInitResponse
 * @property {string} decision_id - Unique tracker ID for the decision run.
 * @property {string} status - Current status of workflow execution.
 */

/**
 * Hook for managing AI Decision Engine integrations.
 */
export function useDecision() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentDecision, setCurrentDecision] = useState(null);
    const [history, setHistory] = useState([]);

    /**
     * Submits a strategic question.
     * @param {string} companyId
     * @param {string} question
     * @returns {Promise<DecisionInitResponse>}
     */
    const createDecision = async (companyId, question) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/decision/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ company_id: companyId, question }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Fetches details of a specific decision run.
     * @param {string} decisionId
     * @returns {Promise<DecisionDetailedResponse>}
     */
    const getDecisionDetails = async (decisionId) => {
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/decision/${decisionId}`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setCurrentDecision(data);
            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            throw err;
        }
    };

    /**
     * Fetches decision history log.
     * @returns {Promise<DecisionDetailedResponse[]>}
     */
    const fetchHistory = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/decision/history`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setHistory(data);
            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        createDecision,
        getDecisionDetails,
        fetchHistory,
        loading,
        error,
        currentDecision,
        history,
    };
}
