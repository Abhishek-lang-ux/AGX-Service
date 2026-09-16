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