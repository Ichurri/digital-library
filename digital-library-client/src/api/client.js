const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

export async function apiPost(path, data, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(options.headers||{}) },
    body: JSON.stringify(data),
    ...options
  });
  let json;
  try { json = await res.json(); } catch { json = {}; }
  if (!res.ok) {
    const message = json.error || json.message || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return json;
}

export async function apiGet(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'GET',
    headers: { 'Accept': 'application/json', ...(options.headers||{}) },
    ...options
  });
  let json;
  try { json = await res.json(); } catch { json = {}; }
  if (!res.ok) {
    const message = json.error || json.message || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return json;
}
