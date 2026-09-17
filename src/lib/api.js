const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? "https://api.agxservice.online/api"
    : "http://localhost:5000/api");

export function normalizeAssetUrl(value) {
  if (!value) return "";

  const url = String(value).trim();

  if (url.startsWith("http://")) {
    return `https://${url.slice(7)}`;
  }

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
    formData.append(
      "paymentScreenshot",
      paymentScreenshot
    );
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
   SUPERADMIN DOCUMENTS
========================================================= */

/*
 * Get all client documents
 */

export async function getSuperAdminDocuments() {
  return apiRequest("/superadmin/documents");
}

/*
 * Open document in new browser tab
 *
 * Direct URL cannot be opened safely because the API
 * requires Authorization header.
 *
 * So we fetch the protected file first and create
 * a temporary Blob URL.
 */

export async function openSuperAdminDocument(documentId) {
  const token = getAuthToken();

  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}/superadmin/documents/${encodeURIComponent(
      documentId
    )}/view`,
    {
      method: "GET",
      headers,
    }
  );

  if (!response.ok) {
    let message = "Unable to open document.";

    try {
      const data = await response.json();
      message = data.message || message;
    } catch {
      // Ignore JSON parsing error
    }

    throw new Error(message);
  }

  const blob = await response.blob();

  const blobUrl = URL.createObjectURL(blob);

  const newWindow = window.open(
    blobUrl,
    "_blank",
    "noopener,noreferrer"
  );

  /*
   * If browser popup blocker blocks the new tab,
   * still revoke the temporary URL later.
   */

  setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, 60000);

  return newWindow;
}

/*
 * Download document
 */

export async function downloadSuperAdminDocument(
  documentId
) {
  const token = getAuthToken();

  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}/superadmin/documents/${encodeURIComponent(
      documentId
    )}/download`,
    {
      method: "GET",
      headers,
    }
  );

  if (!response.ok) {
    let message = "Unable to download document.";

    try {
      const data = await response.json();
      message = data.message || message;
    } catch {
      // Ignore JSON parsing error
    }

    throw new Error(message);
  }

  const blob = await response.blob();

  /*
   * Get filename from Content-Disposition
   */

  const contentDisposition =
    response.headers.get("Content-Disposition");

  let filename = `document-${documentId}`;

  if (contentDisposition) {
    const match = contentDisposition.match(
      /filename\*?=(?:UTF-8'')?"?([^"]+)"?/i
    );

    if (match?.[1]) {
      try {
        filename = decodeURIComponent(match[1]);
      } catch {
        filename = match[1];
      }
    }
  }

  /*
   * Create temporary download link
   */

  const blobUrl = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = blobUrl;
  link.download = filename;

  document.body.appendChild(link);

  link.click();

  link.remove();

  setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, 1000);
}

/* =========================================================
   SUPERADMIN PAYMENTS
========================================================= */

/*
 * Get all payments for SuperAdmin
 */
export async function getSuperAdminPayments() {
  return apiRequest("/superadmin/payments");
}


/*
 * Open payment screenshot
 */
export async function openSuperAdminPaymentScreenshot(
  paymentId
) {
  const token = getAuthToken();

  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}/superadmin/payments/${encodeURIComponent(
      paymentId
    )}/view`,
    {
      method: "GET",
      headers,
    }
  );

  if (!response.ok) {
    let message = "Unable to open payment screenshot.";

    try {
      const data = await response.json();
      message = data.message || message;
    } catch {
      // Ignore JSON parsing error
    }

    throw new Error(message);
  }

  const blob = await response.blob();

  const blobUrl = URL.createObjectURL(blob);

  const newWindow = window.open(
    blobUrl,
    "_blank",
    "noopener,noreferrer"
  );

  setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, 60000);

  return newWindow;
}


/*
 * Download payment screenshot
 */
export async function downloadSuperAdminPaymentScreenshot(
  paymentId
) {
  const token = getAuthToken();

  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}/superadmin/payments/${encodeURIComponent(
      paymentId
    )}/download`,
    {
      method: "GET",
      headers,
    }
  );

  if (!response.ok) {
    let message = "Unable to download payment screenshot.";

    try {
      const data = await response.json();
      message = data.message || message;
    } catch {
      // Ignore JSON parsing error
    }

    throw new Error(message);
  }

  const blob = await response.blob();

  const contentDisposition =
    response.headers.get("Content-Disposition");

  let filename = `payment-${paymentId}`;

  if (contentDisposition) {
    const match = contentDisposition.match(
      /filename\*?=(?:UTF-8'')?"?([^"]+)"?/i
    );

    if (match?.[1]) {
      try {
        filename = decodeURIComponent(match[1]);
      } catch {
        filename = match[1];
      }
    }
  }

  const blobUrl = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = blobUrl;
  link.download = filename;

  document.body.appendChild(link);

  link.click();

  link.remove();

  setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, 1000);
}


/*
 * Accept / Reject payment
 *
 * status:
 *   paid     = Accept
 *   rejected = Reject
 */
export async function updateSuperAdminPaymentStatus(
  paymentId,
  status,
  rejectionReason = ""
) {
  return apiRequest(
    `/superadmin/payments/${encodeURIComponent(
      paymentId
    )}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({
        status,
        rejectionReason,
      }),
    }
  );
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
    `/superadmin/users?${params.toString()}`
  );
}

export async function updateSuperAdminUserStatus(
  userId,
  status
) {
  return apiRequest(
    `/superadmin/users/${encodeURIComponent(
      userId
    )}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }
  );
}

export async function updateSuperAdminUserRole(
  userId,
  role
) {
  return apiRequest(
    `/superadmin/users/${encodeURIComponent(
      userId
    )}/role`,
    {
      method: "PATCH",
      body: JSON.stringify({ role }),
    }
  );
}

/* =========================================================
   SUPERADMIN REQUESTS
========================================================= */

export async function getSuperAdminRequests({
  search = "",
  status = "",
} = {}) {
  const params = new URLSearchParams();

  if (search.trim()) {
    params.set("search", search.trim());
  }

  if (status) {
    params.set("status", status);
  }

  const query = params.toString();

  return apiRequest(
    `/superadmin/requests${query ? `?${query}` : ""}`
  );
}


export async function getSuperAdminRequest(requestId) {
  return apiRequest(
    `/superadmin/requests/${encodeURIComponent(requestId)}`
  );
}


export async function updateSuperAdminRequestStatus(
  requestId,
  status
) {
  return apiRequest(
    `/superadmin/requests/${encodeURIComponent(requestId)}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }
  );
}

/* =========================================================
   FORGOT / RESET PASSWORD
========================================================= */

export async function forgotPassword(email) {
  const response = await fetch(
    "https://api.agxservice.online/api/auth/forgot-password",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    },
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Unable to send the reset link.");
  }

  return data;
}

export async function resetPassword(token, password) {
  return apiRequest("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  });
}