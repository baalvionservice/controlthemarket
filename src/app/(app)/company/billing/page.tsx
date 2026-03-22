

import { getInvoicesByUserId } from "@/lib/api";
import { BillingDashboard } from "./billing-dashboard";

// For prototype, we'll use a hardcoded user ID. In a real app, this would come from auth.
const CURRENT_USER_ID = 'user-2';

export default async function BillingPage() {
  const { data: invoices } = await getInvoicesByUserId(CURRENT_USER_ID);

  return (
    <BillingDashboard initialInvoices={invoices || []} />
  );
}
