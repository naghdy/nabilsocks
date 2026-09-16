import "server-only";

const PRINTIFY_API = "https://api.printify.com/v1";

export class PrintifyError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "PrintifyError";
    this.status = status;
    this.body = body;
  }
}

export type PrintifyAddress = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  region: string;
  address1: string;
  address2: string;
  city: string;
  zip: string;
};

export type PrintifyOrderLine = {
  product_id: string;
  variant_id: number;
  quantity: number;
  external_id?: string;
};

export type PrintifyCreateOrderInput = {
  external_id: string;
  label?: string;
  line_items: PrintifyOrderLine[];
  address_to: PrintifyAddress;
  shipping_method?: number;
  send_shipping_notification?: boolean;
};

export type PrintifyOrder = {
  id: string;
  status?: string;
  external_id?: string;
  metadata?: {
    shop_order_id?: string | number;
    shop_order_label?: string;
  };
};

export type PrintifyOrderList = {
  current_page?: number;
  last_page?: number;
  data?: PrintifyOrder[];
};

function getCredentials() {
  const token = process.env.PRINTIFY_API_TOKEN?.trim();
  const shopId = process.env.PRINTIFY_SHOP_ID?.trim();
  if (!token || !shopId) return null;
  return { token, shopId };
}

export function getPrintifyCredentials() {
  return getCredentials();
}

function shippingMethod() {
  const raw = process.env.PRINTIFY_SHIPPING_METHOD?.trim();
  const parsed = raw ? Number(raw) : 1;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

async function printifyFetch<T>(
  path: string,
  init: RequestInit & { token: string },
): Promise<T> {
  const { token, ...rest } = init;
  const response = await fetch(`${PRINTIFY_API}${path}`, {
    ...rest,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json;charset=utf-8",
      Accept: "application/json",
      ...rest.headers,
    },
    cache: "no-store",
  });
  const text = await response.text();
  let body: unknown = null;
  if (text) {
    try {
      body = JSON.parse(text) as unknown;
    } catch {
      body = text;
    }
  }
  if (!response.ok) {
    const message =
      typeof body === "object" && body && "message" in body
        ? String((body as { message: unknown }).message)
        : `Printify request failed (${response.status})`;
    throw new PrintifyError(message, response.status, body);
  }
  return body as T;
}

export async function createPrintifyOrder(input: PrintifyCreateOrderInput) {
  const credentials = getCredentials();
  if (!credentials) {
    throw new PrintifyError("Printify credentials are not set.", 503, null);
  }
  return printifyFetch<PrintifyOrder>(`/shops/${credentials.shopId}/orders.json`, {
    method: "POST",
    token: credentials.token,
    body: JSON.stringify({
      external_id: input.external_id,
      label: input.label ?? input.external_id,
      line_items: input.line_items,
      shipping_method: input.shipping_method ?? shippingMethod(),
      is_printify_express: false,
      send_shipping_notification: input.send_shipping_notification ?? false,
      address_to: input.address_to,
    }),
  });
}

export async function sendPrintifyOrderToProduction(orderId: string) {
  const credentials = getCredentials();
  if (!credentials) {
    throw new PrintifyError("Printify credentials are not set.", 503, null);
  }
  return printifyFetch<PrintifyOrder>(
    `/shops/${credentials.shopId}/orders/${orderId}/send_to_production.json`,
    {
      method: "POST",
      token: credentials.token,
    },
  );
}

export async function getPrintifyOrder(orderId: string) {
  const credentials = getCredentials();
  if (!credentials) {
    throw new PrintifyError("Printify credentials are not set.", 503, null);
  }
  return printifyFetch<PrintifyOrder>(
    `/shops/${credentials.shopId}/orders/${orderId}.json`,
    {
      method: "GET",
      token: credentials.token,
    },
  );
}

export async function findPrintifyOrderByExternalId(externalId: string) {
  const credentials = getCredentials();
  if (!credentials) {
    throw new PrintifyError("Printify credentials are not set.", 503, null);
  }

  for (let page = 1; page <= 5; page += 1) {
    const list = await printifyFetch<PrintifyOrderList>(
      `/shops/${credentials.shopId}/orders.json?limit=50&page=${page}`,
      {
        method: "GET",
        token: credentials.token,
      },
    );
    const match = (list.data ?? []).find((order) => {
      const metaId = order.metadata?.shop_order_id;
      const metaLabel = order.metadata?.shop_order_label;
      return (
        order.external_id === externalId ||
        metaId === externalId ||
        String(metaId) === externalId ||
        metaLabel === externalId
      );
    });
    if (match) return match;
    const last = list.last_page ?? page;
    if (page >= last) break;
  }
  return null;
}
