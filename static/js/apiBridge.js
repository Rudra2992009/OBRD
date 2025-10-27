/**
 * apiBridge.js
 * Acts as a communication layer between OBRD front-end and Python FastAPI backend.
 * Location: OBRD/static/js/apiBridge.js
 */

// Base URL of your deployed FastAPI server
const API_BASE = 'http://localhost:8500';  // change to your production endpoint

export async function detectObjectsFromServer(frameBlob) {
  try {
    const form = new FormData();
    form.append('frame', frameBlob);
    const res = await fetch(`${API_BASE}/detect`, {
      method: 'POST',
      body: form
    });
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    return await res.json();  // returns list of detections
  } catch (err) {
    console.error('API Bridge Error:', err);
    return [];
  }
}

export async function getServerStatus() {
  try {
    const res = await fetch(`${API_BASE}/status`);
    if (!res.ok) throw new Error(`Status check failed: ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('API unreachable:', err);
    return { online: false };
  }
}
