
import { getInvoices } from "@/lib/api";
import { BillingDashboard } from "./billing-dashboard";

export default async function BillingPage() {
  const invoices = await getInvoices();

  return (
    <BillingDashboard initialInvoices={invoices} />
  );
}
