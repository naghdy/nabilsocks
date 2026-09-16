export type CheckoutConfig = {
  stripeConfigured: boolean;
  stripeLive: boolean;
  printifyConfigured: boolean;
  printifyMapped: boolean;
  printifyReady: boolean;
  currency: string;
};

export type OrderConfirmation = {
  sessionId: string | null;
  paid: boolean;
  email: string | null;
  city: string | null;
  country: string | null;
  totalLabel: string | null;
  items: { name: string; size: string; qty: number }[];
  printifyStatus: string | null;
  printifyOrderId: string | null;
  warning: string | null;
};
