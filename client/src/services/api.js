const BASE_URL = "/api";

// Helper function to handle fetch responses
const handleResponse = async (response) => {
  const data = await response.json().catch(() => null);
  
  if (!response.ok) {
    const error = (data && data.message) || response.statusText;
    return Promise.reject(new Error(error));
  }
  
  return { data };
};

// Request creator to append auth header
const createRequest = (method, endpoint, body = null) => {
  const token = localStorage.getItem("token");
  
  const headers = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  const config = {
    method,
    headers,
  };
  
  if (body) {
    config.body = JSON.stringify(body);
  }
  
  return fetch(`${BASE_URL}${endpoint}`, config).then(handleResponse);
};

const api = {
  get: (endpoint) => createRequest("GET", endpoint),
  post: (endpoint, body) => createRequest("POST", endpoint, body),
  put: (endpoint, body) => createRequest("PUT", endpoint, body),
  delete: (endpoint) => createRequest("DELETE", endpoint),
};

export default api;
