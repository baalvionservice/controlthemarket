import { getInvoices } from "@/lib/api";
import { InvoiceList } from "./invoice-list";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default async function InvoicesPage() {
  const invoices = await getInvoices();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
         <div>
            <h2 className="font-headline text-3xl font-bold tracking-tight">
                Invoices
            </h2>
            <p className="text-muted-foreground">
                Manage your invoices and billing history.
            </p>
        </div>
        <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export All
        </Button>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Invoice History</CardTitle>
            <CardDescription>
                An overview of all your past and present invoices.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <InvoiceList initialData={invoices} />
        </CardContent>
      </Card>
    </div>
  );
}
