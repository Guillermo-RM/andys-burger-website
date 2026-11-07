import { requireAdmin } from "@/lib/admin/access";
import { Dashboard } from "@/features/facturas/dashboard";
import { getDashboardData } from "@/features/facturas/data";
import "@/features/facturas/invoices.css";

export default async function Invoices() {
  await requireAdmin();
  const data = await getDashboardData();
  const currentMonth = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/Costa_Rica",
    year: "numeric",
    month: "2-digit",
  }).format(new Date());

  return <>
    <header className="hero">
      <p className="eyebrow">Control de gastos</p>
      <h1>Facturas</h1>
    </header>
    <Dashboard {...data} currentMonth={currentMonth} />
  </>;
}
