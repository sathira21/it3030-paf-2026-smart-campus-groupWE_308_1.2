/**
 * ticketService.js
 * 
 * Utility service to interact with the Smart Campus Spring Boot Ticket API endpoints.
 * Handles OAuth2 authorization bindings, generic JSON mappings, and standard error handling.
 */

const API_BASE_URL = '/api/tickets'; // Modified to use Vite proxy

/**
 * Helper utility to acquire the OAuth2 token securely.
 * This should connect to your Context/Redux store or window.localStorage logic.
 */
const getAuthToken = () => {
    return localStorage.getItem('oauth2_token');
};

/**
 * Standard fetch wrapper automating authorization headers and robust JSON parsing bounds.
 */
const fetchWithAuth = async (endpoint, options = {}) => {
    const token = getAuthToken();
    
    // Auto-detect if FormData is being passed (e.g. for File attachments). 
    // If it is FormData, do NOT explicitly set Content-Type so the browser calculates the multipart boundary!
    const isFormData = options.body instanceof FormData;
    
    const headers = {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`; // Append OAuth2 token
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
        
        // Short-circuit on 204 No Content mapped from our Spring Controller
        if (response.status === 204) {
            return null;
        }
        
        const data = await response.json().catch(() => ({})); // Handle raw text falls silently
        
        if (!response.ok) {
            // Unpack custom TicketErrorResponse if present
            const errorMessage = data.message || data.error || `HTTP error! Status: ${response.status}`;
            throw new Error(errorMessage);
        }
        
        return data;
    } catch (error) {
        console.error(`TicketService Error on [${options.method || 'GET'} ${endpoint}]:`, error);
        throw error;
    }
};

/* ============================================================================
 * INTERFACE EXPORTS
 * ============================================================================ */

/**
 * Creates a brand new incident ticket.
 * @param {Object} ticketData - Contains title, category, description, priority...
 */
export const createTicket = async (ticketData) => {
    return await fetchWithAuth('/create', {
        method: 'POST',
        body: JSON.stringify(ticketData)
    });
};

/**
 * Uploads evidence images mapped to our multipart array logic
 * @param {number|string} ticketId 
 * @param {File[]} fileArray 
 */
export const uploadEvidence = async (ticketId, fileArray) => {
    const formData = new FormData();
    fileArray.forEach(file => {
        formData.append('files', file); // 'files' matches @RequestParam("files") perfectly
    });

    return await fetchWithAuth(`/${ticketId}/evidence`, {
        method: 'POST',
        body: formData
    });
};

/**
 * Gets active tickets for the user viewing context natively.
 * Supports our /all and /my branches.
 */
export const getTickets = async (scope = 'all', status = 'ALL') => {
    const targetEndpoint = scope === 'my' ? `/my` : `/all?status=${status}`;
    return await fetchWithAuth(targetEndpoint, {
        method: 'GET'
    });
};

/**
 * Modifies the workflow state of the Ticket
 * @param {number|string} ticketId 
 * @param {string} newStatus - E.g. 'OPEN', 'IN_PROGRESS', 'RESOLVED'
 */
export const updateTicketStatus = async (ticketId, newStatus) => {
    return await fetchWithAuth(`/${ticketId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
    });
};

/**
 * Submits a new contextual comment bridging precisely with TicketCommentRequest DTO
 * @param {number|string} ticketId 
 * @param {string} authorEmail 
 * @param {string} commentText 
 */
export const addComment = async (ticketId, authorEmail, commentText) => {
    return await fetchWithAuth(`/${ticketId}/comments`, {
        method: 'POST',
        body: JSON.stringify({
            author: authorEmail,
            commentText: commentText
        })
    });
};

/**
 * Executes our restrictive comment ownership deletion route
 * @param {number|string} ticketId 
 * @param {number|string} commentId 
 * @param {string} currentAuthorEmail 
 */
export const deleteComment = async (ticketId, commentId, currentAuthorEmail) => {
    return await fetchWithAuth(`/${ticketId}/comments/${commentId}?author=${encodeURIComponent(currentAuthorEmail)}`, {
        method: 'DELETE'
    });
};
