// shared/api.ts

const BASE_URL = "http://localhost:5000"

// =====================
// CORE FETCH WRAPPER
// =====================

async function request(
  url: string,
  method: string = "GET",
  body?: any,
  token?: string
) {
  const res = await fetch(`${BASE_URL}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || "API Error")
  }

  return data
}

// =====================
// AUTH
// =====================

export const AuthAPI = {
  login: (payload: { username: string; password: string }) =>
    request("/auth/login", "POST", payload),
}

// =====================
// PRODUCTS
// =====================

export const ProductAPI = {
  getAll: (token: string) =>
    request("/products", "GET", undefined, token),

  search: (q: string, token: string) =>
    request(`/products/search?q=${q}`, "GET", undefined, token),

  getByBarcode: (code: string, token: string) =>
    request(`/products/barcode/${code}`, "GET", undefined, token),

  create: (data: any, token: string) =>
    request("/products", "POST", data, token),

  update: (id: number, data: any, token: string) =>
    request(`/products/${id}`, "PUT", data, token),

  delete: (id: number, token: string) =>
    request(`/products/${id}`, "DELETE", undefined, token),
}

// =====================
// SALES
// =====================

export const SalesAPI = {
  create: (data: any, token: string) =>
    request("/sales/create", "POST", data, token),

  getById: (id: number, token: string) =>
    request(`/sales/${id}`, "GET", undefined, token),

  returnSale: (data: any, token: string) =>
    request("/sales/return", "POST", data, token),
}

// =====================
// PURCHASE
// =====================

export const PurchaseAPI = {
  create: (data: any, token: string) =>
    request("/purchase/create", "POST", data, token),

  getById: (id: number, token: string) =>
    request(`/purchase/${id}`, "GET", undefined, token),
}

// =====================
// INVENTORY
// =====================

export const InventoryAPI = {
  getAll: (token: string) =>
    request("/inventory", "GET", undefined, token),

  movements: (token: string) =>
    request("/inventory/movements", "GET", undefined, token),

  lowStock: (token: string) =>
    request("/inventory/low-stock", "GET", undefined, token),

  adjust: (data: any, token: string) =>
    request("/inventory/adjust", "POST", data, token),
}

// =====================
// PARTIES
// =====================

export const PartyAPI = {
  getAll: (token: string) =>
    request("/parties", "GET", undefined, token),

  getById: (id: number, token: string) =>
    request(`/parties/${id}`, "GET", undefined, token),

  create: (data: any, token: string) =>
    request("/parties", "POST", data, token),

  update: (id: number, data: any, token: string) =>
    request(`/parties/${id}`, "PUT", data, token),

  ledger: (id: number, token: string) =>
    request(`/parties/${id}/ledger`, "GET", undefined, token),
}

// =====================
// REPORTS
// =====================

export const ReportAPI = {
  dashboard: (token: string) =>
    request("/reports/dashboard", "GET", undefined, token),

  sales: (from: string, to: string, token: string) =>
    request(`/reports/sales?from=${from}&to=${to}`, "GET", undefined, token),

  topProducts: (token: string) =>
    request("/reports/top-products", "GET", undefined, token),

  inventoryValue: (token: string) =>
    request("/reports/inventory-value", "GET", undefined, token),

  receivables: (token: string) =>
    request("/reports/receivables", "GET", undefined, token),
}