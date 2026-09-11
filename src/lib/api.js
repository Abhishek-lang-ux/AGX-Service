const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function getAuthToken() {
  return localStorage.getItem("agx_token") || sessionStorage.getItem("agx_token");
}

export function getStoredUser() {
  const raw =
    localStorage.getItem("agx_user") || sessionStorage.getItem("agx_user");
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setAuthSession(token, user, remember = false) {
  const storage = remember ? localStorage : sessionStorage;
  const otherStorage = remember ? sessionStorage : localStorage;

  otherStorage.removeItem("agx_token");
  otherStorage.removeItem("agx_user");

  storage.setItem("agx_token", token);
  storage.setItem("agx_user", JSON.stringify(user));

  sessionStorage.setItem("agx_logged_in", "true");
  window.dispatchEvent(new Event("agx-auth-change"));
}

export function updateStoredUser(user) {
  const storage = localStorage.getItem("agx_token")
    ? localStorage
    : sessionStorage;

  storage.setItem("agx_user", JSON.stringify(user));
  window.dispatchEvent(new Event("agx-auth-change"));
}

export function clearAuthSession() {
  localStorage.removeItem("agx_token");
  localStorage.removeItem("agx_user");
  sessionStorage.removeItem("agx_token");
  sessionStorage.removeItem("agx_user");
  sessionStorage.removeItem("agx_logged_in");
  window.dispatchEvent(new Event("agx-auth-change"));
}

export async function apiRequest(path, options = {}) {
  const token = getAuthToken();

  const headers = new Headers(options.headers || {});
  if (options.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    const error = new Error(data.message || "Request failed");
    error.status = response.status;
    throw error;
  }

  return data;
}


export async function getServices() {
  return apiRequest("/services");
}

export async function getService(slug) {
  return apiRequest(`/services/${encodeURIComponent(slug)}`);
}

export async function getMyRequests() {
  return apiRequest("/requests");
}

export async function getMyRequest(id) {
  return apiRequest(`/requests/${encodeURIComponent(id)}`);
}

export async function createServiceRequest(payload) {
  return apiRequest("/requests", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}


export async function getRequestDocuments(requestId) {
  return apiRequest(`/documents/request/${encodeURIComponent(requestId)}`);
}

export async function uploadRequestDocuments(requestId, files, documentType = "") {
  const formData = new FormData();

  for (const file of files) {
    formData.append("documents", file);
  }

  if (documentType) {
    formData.append("documentType", documentType);
  }

  const token = getAuthToken();
  const headers = new Headers();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(
    `${API_BASE_URL}/documents/request/${encodeURIComponent(requestId)}`,
    {
      method: "POST",
      headers,
      body: formData,
    },
  );

  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    const error = new Error(data.message || "Document upload failed");
    error.status = response.status;
    throw error;
  }

  return data;
}

export async function deleteRequestDocument(documentId) {
  return apiRequest(`/documents/${encodeURIComponent(documentId)}`, {
    method: "DELETE",
  });
}

export async function getNotifications() {
  return apiRequest("/notifications");
}

export async function markNotificationAsRead(id) {
  return apiRequest(`/notifications/${encodeURIComponent(id)}/read`, {
    method: "PATCH",
  });
}

export async function markAllNotificationsAsRead() {
  return apiRequest("/notifications/read-all", {
    method: "PATCH",
  });
}

export async function deleteNotification(id) {
  return apiRequest(`/notifications/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}


export async function getDashboard() {
  return apiRequest("/dashboard");
}
