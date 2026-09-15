const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? "https://api.agxservice.online/api"
    : "http://localhost:5000/api");

export function normalizeAssetUrl(value) {
  if (!value) return "";
  const url = String(value).trim();
  if (url.startsWith("http://")) return `https://${url.slice(7)}`;
  return url;
}

/* =========================================================
   AUTH TOKEN
========================================================= */

export function getAuthToken() {
  return (
    localStorage.getItem("agx_token") ||
    sessionStorage.getItem("agx_token")
  );
}

/* =========================================================
   STORED USER
========================================================= */

export function getStoredUser() {
  const raw =
    localStorage.getItem("agx_user") ||
    sessionStorage.getItem("agx_user");

  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/* =========================================================
   SET AUTH SESSION
========================================================= */

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

/* =========================================================
   UPDATE STORED USER
========================================================= */

export function updateStoredUser(user) {
  const storage = localStorage.getItem("agx_token")
    ? localStorage
    : sessionStorage;

  storage.setItem("agx_user", JSON.stringify(user));

  window.dispatchEvent(new Event("agx-auth-change"));
}

/* =========================================================
   CLEAR AUTH SESSION
========================================================= */

export function clearAuthSession() {
  localStorage.removeItem("agx_token");
  localStorage.removeItem("agx_user");

  sessionStorage.removeItem("agx_token");
  sessionStorage.removeItem("agx_user");
  sessionStorage.removeItem("agx_logged_in");

  window.dispatchEvent(new Event("agx-auth-change"));
}

/* =========================================================
   MAIN API REQUEST
========================================================= */

export async function apiRequest(path, options = {}) {
  const token = getAuthToken();

  const headers = new Headers(options.headers || {});

  /*
   * IMPORTANT:
   *
   * Do NOT manually set Content-Type for FormData.
   *
   * Browser automatically creates:
   *
   * multipart/form-data; boundary=....
   *
   * This is required for file uploads.
   */

  const isFormData =
    typeof FormData !== "undefined" &&
    options.body instanceof FormData;

  if (
    options.body !== undefined &&
    !isFormData &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  /*
   * Authorization
   */

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  /*
   * Parse response
   */

  const data = await response.json().catch(() => ({}));

  /*
   * Handle API errors
   */

  if (!response.ok) {
    const error = new Error(
      data.message || "Request failed"
    );

    error.status = response.status;

    throw error;
  }

  return data;
}

/* =========================================================
   SERVICES
========================================================= */

export async function getServices() {
  return apiRequest("/services");
}

export async function getService(slug) {
  return apiRequest(
    `/services/${encodeURIComponent(slug)}`
  );
}

/* =========================================================
   REQUESTS
========================================================= */

export async function getMyRequests() {
  return apiRequest("/requests");
}

export async function getMyRequest(id) {
  return apiRequest(
    `/requests/${encodeURIComponent(id)}`
  );
}

export async function createServiceRequest(payload) {
  return apiRequest("/requests", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function submitRequestWithPayment({
  serviceId,
  serviceSlug,
  title,
  description,
  priority = "normal",
  paymentScreenshot,
}) {
  const formData = new FormData();

  formData.append("serviceId", String(serviceId));
  formData.append("serviceSlug", serviceSlug || "");
  formData.append("title", title || "");
  formData.append("description", description || "");
  formData.append("priority", priority);

  if (paymentScreenshot) {
    formData.append("paymentScreenshot", paymentScreenshot);
  }

  return apiRequest("/requests/submit-with-payment", {
    method: "POST",
    body: formData,
  });
}

/* =========================================================
   PAYMENTS / RAZORPAY
========================================================= */

export async function getMyPayments() {
  return apiRequest("/payments");
}

export async function createPaymentOrder(requestId) {
  return apiRequest("/payments/order", {
    method: "POST",
    body: JSON.stringify({ requestId }),
  });
}

export async function verifyPayment(payload) {
  return apiRequest("/payments/verify", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/* =========================================================
   DOCUMENTS
========================================================= */

export async function getRequestDocuments(requestId) {
  return apiRequest(
    `/documents/request/${encodeURIComponent(requestId)}`
  );
}

/* =========================================================
   UPLOAD REQUEST DOCUMENTS
========================================================= */

export async function uploadRequestDocuments(
  requestId,
  files,
  documentType = ""
) {
  const formData = new FormData();

  for (const file of files) {
    formData.append("documents", file);
  }

  if (documentType) {
    formData.append(
      "documentType",
      documentType
    );
  }

  return apiRequest(
    `/documents/request/${encodeURIComponent(requestId)}`,
    {
      method: "POST",
      body: formData,
    }
  );
}

/* =========================================================
   DELETE REQUEST DOCUMENT
========================================================= */

export async function deleteRequestDocument(documentId) {
  return apiRequest(
    `/documents/${encodeURIComponent(documentId)}`,
    {
      method: "DELETE",
    }
  );
}

/* =========================================================
   NOTIFICATIONS
========================================================= */

export async function getNotifications() {
  return apiRequest("/notifications");
}

export async function markNotificationAsRead(id) {
  return apiRequest(
    `/notifications/${encodeURIComponent(id)}/read`,
    {
      method: "PATCH",
    }
  );
}

export async function markAllNotificationsAsRead() {
  return apiRequest("/notifications/read-all", {
    method: "PATCH",
  });
}

export async function deleteNotification(id) {
  return apiRequest(
    `/notifications/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    }
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

export async function getDashboard() {
  return apiRequest("/dashboard");
}

/* =========================================================
   SUPERADMIN
========================================================= */

export async function getSuperAdminDashboard() {
  return apiRequest("/superadmin/dashboard");
}

/* =========================================================
   SUPERADMIN USERS
========================================================= */

export async function getSuperAdminUsers({
  search = "",
  role = "",
  status = "",
  page = 1,
  limit = 20,
} = {}) {
  const params = new URLSearchParams();

  if (search.trim()) {
    params.set("search", search.trim());
  }

  if (role) {
    params.set("role", role);
  }

  if (status) {
    params.set("status", status);
  }

  params.set("page", String(page));
  params.set("limit", String(limit));

  return apiRequest(
    `/superadmin/users?${params.toString()}`,
  );
}


export async function updateSuperAdminUserStatus(
  userId,
  status,
) {
  return apiRequest(
    `/superadmin/users/${encodeURIComponent(userId)}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    },
  );
}


export async function updateSuperAdminUserRole(
  userId,
  role,
) {
  return apiRequest(
    `/superadmin/users/${encodeURIComponent(userId)}/role`,
    {
      method: "PATCH",
      body: JSON.stringify({ role }),
    },
  );
}