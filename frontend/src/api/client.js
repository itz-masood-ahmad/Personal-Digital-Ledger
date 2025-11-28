const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// CONFIGURATION
export const API_BASE_URL = '/api';
export const MOCK_MODE = false; 

export const endpoints = {
  auth: { 
    login: '/auth/login', 
    register: '/auth/register',
    forgotPassword: '/auth/forgot-password',
    changePassword: '/auth/change-password'
  },
  accounts: '/accounts',
  budgets: '/budgets',
  investments: '/investments',
  debts: '/debts',
  credits: '/credits',
  users: '/users'
};

export const apiCall = async (endpoint, method = 'GET', body = null, user = null, type = 'DEFAULT') => {
  if (MOCK_MODE) {
    return { ok: true, json: async () => ({}) };
  }

  const headers = { 'Content-Type': 'application/json' };
  let url = `${API_BASE_URL}${endpoint}`;

  if (user) {
    // 1. GLOBAL SECURITY: ApiKeyFilter requires this on ALL protected paths
    // We apply this to everything except the public auth endpoints (which don't have a 'user' yet)
    headers['X-API-KEY'] = user.apiKey;

    // 2. CONTROLLER SPECIFIC REQUIREMENTS
    // Some controllers specifically ask for 'userEmail' in the header
    if (['BUDGET', 'DEBT'].includes(type)) {
      headers['userEmail'] = user.email;
    } 
    
    // 3. QUERY PARAMETERS
    // InvestmentController looks for 'userEmail' in the URL
    else if (type === 'INVESTMENT') {
      const separator = url.includes('?') ? '&' : '?';
      url += `${separator}userEmail=${user.email}`;
    }
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMessage = errorData?.message || errorData?.error || `Error ${response.status}: ${response.statusText}`;
    throw new Error(errorMessage);
  }

  return response;
};