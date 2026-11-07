"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Invoice } from "./types";
import { CalendarIcon, ReceiptIcon, SearchIcon, TrendIcon } from "./icons";

type Props = {
  currentMonth: string;
  invoices: Invoice[];
  sourceLabel: string;
  sourceIsLive: boolean;
};

type Period = "month" | "quarter" | "semester" | "year" | "total";

const colones = new Intl.NumberFormat("es-CR", { style: "currency", currency: "CRC", maximumFractionDigits: 0 });
const dateFormat = new Intl.DateTimeFormat("es-CR", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
const monthFormat = new Intl.DateTimeFormat("es-CR", { month: "long", year: "numeric", timeZone: "UTC" });
const normalizeProductName = (name: string) => name.trim().replace(/\s+/g, " ").toLocaleLowerCase("es-CR");
const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function getLocalIsoDate() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

export function Dashboard({ invoices, sourceLabel, sourceIsLive, currentMonth }: Props) {
  const router = useRouter();
  const [supplier, setSupplier] = useState("Todos");
  const [period, setPeriod] = useState<Period>("month");
  const [chosenMonth, setChosenMonth] = useState("");
  const [followLatestMonth, setFollowLatestMonth] = useState(true);
  const [newInvoices, setNewInvoices] = useState<Invoice[]>([]);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [manualFormOpen, setManualFormOpen] = useState(false);
  const [manualName, setManualName] = useState("");
  const [manualSupplier, setManualSupplier] = useState("");
  const [manualTotal, setManualTotal] = useState("");
  const [manualQuantity, setManualQuantity] = useState("1");
  const [manualUnit, setManualUnit] = useState("unidad");
  const [manualDate, setManualDate] = useState("");
  const [manualUnitPrice, setManualUnitPrice] = useState("");
  const [manualNotice, setManualNotice] = useState("");
  const [manualError, setManualError] = useState("");
  const [manualSaving, setManualSaving] = useState(false);

  const allInvoices = useMemo(() => {
    const byId = new Map([...invoices, ...newInvoices].map((invoice) => [invoice.id, invoice]));
    return Array.from(byId.values());
  }, [invoices, newInvoices]);

  const allItems = useMemo(
    () => [...allInvoices].reverse().flatMap((invoice) => invoice.items),
    [allInvoices],
  );
  const suppliers = useMemo(() => ["Todos", ...Array.from(new Set(allInvoices.map((invoice) => invoice.supplier)))], [allInvoices]);
  const availableMonths = useMemo(() => Array.from(new Set([
    ...allInvoices.map((invoice) => invoice.date.slice(0, 7)),
    ...(currentMonth ? [currentMonth] : []),
  ])).sort().reverse(), [allInvoices, currentMonth]);
  const latestInvoiceMonth = useMemo(
    () => allInvoices.map((invoice) => invoice.date.slice(0, 7)).sort().at(-1),
    [allInvoices],
  );
  const latestAvailableMonth = latestInvoiceMonth ?? currentMonth;
  const selectedMonth = followLatestMonth ? latestAvailableMonth : chosenMonth;

  useEffect(() => {
    const refreshWhenVisible = () => {
      if (document.visibilityState !== "visible") return;
      router.refresh();
    };
    const intervalId = window.setInterval(refreshWhenVisible, 30_000);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [router]);

  const latestDate = useMemo(() => {
    const dates = allInvoices.map((invoice) => invoice.date).sort();
    return new Date(`${dates.at(-1) ?? new Date().toISOString().slice(0, 10)}T00:00:00Z`);
  }, [allInvoices]);
  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      const matchesSupplier = supplier === "Todos" || item.supplier === supplier;
      const itemDate = new Date(`${item.date}T00:00:00Z`);
      const sameYear = itemDate.getUTCFullYear() === latestDate.getUTCFullYear();
      const itemMonth = itemDate.getUTCMonth();
      const latestMonth = latestDate.getUTCMonth();
      const matchesPeriod = period === "total"
        || (period === "year" && sameYear)
        || (period === "semester" && sameYear && Math.floor(itemMonth / 6) === Math.floor(latestMonth / 6))
        || (period === "quarter" && sameYear && Math.floor(itemMonth / 3) === Math.floor(latestMonth / 3))
        || (period === "month" && item.date.startsWith(selectedMonth));
      return matchesSupplier && matchesPeriod;
    });
  }, [allItems, latestDate, period, selectedMonth, supplier]);

  const filteredTotal = filteredItems.reduce((sum, item) => sum + item.total, 0);
  const visibleInvoiceIds = new Set(filteredItems.map((item) => item.invoiceId));
  const filteredTax = allInvoices.filter((invoice) => visibleInvoiceIds.has(invoice.id)).reduce((sum, invoice) => sum + invoice.tax, 0);
  const chartData = useMemo(() => {
    const buckets = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(Date.UTC(latestDate.getUTCFullYear(), latestDate.getUTCMonth() - (5 - index), 1));
      return {
        key: `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`,
        month: monthNames[date.getUTCMonth()],
        total: 0,
      };
    });
    const bucketsByKey = new Map(buckets.map((bucket) => [bucket.key, bucket]));
    for (const invoice of allInvoices) {
      const bucket = bucketsByKey.get(invoice.date.slice(0, 7));
      if (bucket) bucket.total += invoice.total;
    }
    return buckets;
  }, [allInvoices, latestDate]);
  const maxMonth = Math.max(1, ...chartData.map((month) => month.total));
  const productTotal = filteredItems.reduce((sum, item) => sum + item.total, 0);
  const productDistribution = useMemo(() => {
    const totals = new Map<string, { name: string; total: number }>();
    for (const item of filteredItems) {
      const name = item.description.trim().replace(/\s+/g, " ");
      const key = normalizeProductName(name);
      const current = totals.get(key);
      totals.set(key, { name: current?.name ?? name, total: (current?.total ?? 0) + item.total });
    }
    return Array.from(totals.values()).sort((a, b) => b.total - a.total);
  }, [filteredItems]);

  function openManualForm() {
    setEditingInvoice(null);
    setManualName("");
    setManualSupplier("");
    setManualTotal("");
    setManualQuantity("1");
    setManualUnit("unidad");
    setManualUnitPrice("");
    setManualDate(getLocalIsoDate());
    setManualNotice("");
    setManualError("");
    setManualFormOpen(true);
  }

  function closeManualForm() {
    setManualFormOpen(false);
    setEditingInvoice(null);
  }

  function openManualEdit(invoice: Invoice) {
    const item = invoice.items[0];
    if (!item || !invoice.id.startsWith("MANUAL-")) return;
    setEditingInvoice(invoice);
    setManualName(item.description);
    setManualSupplier(invoice.supplier === "proveedor sin factura" ? "" : invoice.supplier);
    setManualTotal(String(invoice.total));
    setManualQuantity(String(item.quantity));
    setManualUnit(item.unit || "unidad");
    setManualDate(invoice.date);
    setManualUnitPrice(String(item.unitPrice));
    setManualNotice("");
    setManualError("");
    setManualFormOpen(true);
  }

  async function handleManualSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = manualName.trim().toLocaleLowerCase("es-CR");
    const provider = manualSupplier.trim().toLocaleLowerCase("es-CR") || "proveedor sin factura";
    const total = Number(manualTotal);
    const quantity = Number(manualQuantity);
    const enteredUnitPrice = Number(manualUnitPrice);
    if (!name || !manualDate || !Number.isFinite(total) || total <= 0 || !Number.isFinite(quantity) || quantity <= 0) return;

    setManualError("");
    setManualSaving(true);
    try {
      const isEditing = Boolean(editingInvoice);
      const response = await fetch("/admin/api/invoices", {
        method: isEditing ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          supplier: provider,
          total,
          quantity,
          unit: manualUnit,
          date: manualDate,
          unitPrice: manualUnitPrice && Number.isFinite(enteredUnitPrice) && enteredUnitPrice > 0 ? enteredUnitPrice : undefined,
          ...(editingInvoice ? { invoiceId: editingInvoice.id } : {}),
        }),
      });
      const result = await response.json() as { invoice?: Invoice; error?: string };
      if (!response.ok || !result.invoice) throw new Error(result.error || "No fue posible guardar la factura.");

      setNewInvoices((current) => [...current.filter((invoice) => invoice.id !== result.invoice?.id), result.invoice as Invoice]);
      setPeriod("month");
      setChosenMonth(manualDate.slice(0, 7));
      setFollowLatestMonth(manualDate.slice(0, 7) >= (latestAvailableMonth ?? ""));
      setSupplier("Todos");
      setManualName("");
      setManualSupplier("");
      setManualTotal("");
      setManualQuantity("1");
      setManualUnit("unidad");
      setManualUnitPrice("");
      setManualFormOpen(false);
      setEditingInvoice(null);
      setManualNotice(`${name} se ${isEditing ? "actualizó" : "guardó"} en Google Sheets.`);
    } catch (error) {
      setManualError(error instanceof Error ? error.message : "No fue posible guardar la factura.");
    } finally {
      setManualSaving(false);
    }
  }

  return (
    <div className="invoice-module">
      <div className="invoice-content">
        <header className="topbar">
          <div className="topbar-actions">
            <span className={`source-status ${sourceIsLive ? "is-live" : "is-fallback"}`} aria-label={sourceLabel}><i aria-hidden="true" /><span>{sourceLabel}</span></span>
            <button className="manual-add-button" type="button" onClick={openManualForm}><span aria-hidden="true">+</span> Factura manual</button>
          </div>
        </header>

        <section className={`filters ${period === "month" ? "has-month" : ""}`} aria-label="Filtros de gastos">
          <label className="select-field"><CalendarIcon /><span className="sr-only">Período</span><select value={period} onChange={(event) => setPeriod(event.target.value as Period)}><option value="month">Mes</option><option value="quarter">Trimestre</option><option value="semester">Semestre</option><option value="year">Anual</option><option value="total">Total</option></select></label>
          {period === "month" && <label className="select-field month-field"><span className="sr-only">Mes específico</span><select value={selectedMonth} onChange={(event) => { setChosenMonth(event.target.value); setFollowLatestMonth(event.target.value === latestAvailableMonth); }}>{availableMonths.map((month) => <option value={month} key={month}>{monthFormat.format(new Date(`${month}-01T00:00:00Z`))}</option>)}</select></label>}
          <label className="select-field supplier-field"><span className="sr-only">Proveedor</span><select value={supplier} onChange={(event) => setSupplier(event.target.value)}>{suppliers.map((name) => <option key={name}>{name}</option>)}</select></label>
        </section>
        {manualNotice && <div className="manual-notice" role="status">{manualNotice}</div>}

        <section className="metric-grid" id="resumen">
          <article className="metric-card primary"><div className="metric-label"><span>Total en productos</span><span className="icon-chip"><TrendIcon /></span></div><strong>{colones.format(filteredTotal)}</strong><p>Suma según los filtros seleccionados</p></article>
          <article className="metric-card"><div className="metric-label"><span>Facturas</span><ReceiptIcon /></div><strong>{visibleInvoiceIds.size}</strong><p>{filteredItems.length} productos registrados</p></article>
          <article className="metric-card"><div className="metric-label"><span>Impuestos</span><span className="tax-symbol">%</span></div><strong>{colones.format(filteredTax)}</strong><p>Incluidos en las facturas</p></article>
        </section>

        <section className="overview-grid">
          <article className="panel spend-panel">
            <div className="panel-heading"><div><p className="eyebrow">Últimos 6 meses</p><h2>Evolución del gasto</h2></div><strong>{colones.format(chartData.reduce((sum, month) => sum + month.total, 0))}</strong></div>
            <div className="chart" aria-label="Gráfico de gastos por mes">{chartData.map((month) => <div className="bar-group" key={month.key}><div className="bar-track"><div className="bar" style={{ height: `${Math.max(18, (month.total / maxMonth) * 100)}%` }}><span>{colones.format(month.total)}</span></div></div><small>{month.month}</small></div>)}</div>
          </article>

          <article className="panel categories-panel">
            <div className="panel-heading"><div><p className="eyebrow">Productos comprados</p><h2>Por producto</h2></div></div>
            <div className="category-list">{productDistribution.map((product, index) => {
              const share = productTotal === 0 ? 0 : Math.round((product.total / productTotal) * 100);
              return <div className="category-row" key={normalizeProductName(product.name)}><span className={`category-swatch swatch-${(index % 9) + 1}`} /><div><div className="category-copy"><strong>{product.name}</strong><span>{colones.format(product.total)}</span></div><div className="progress" aria-label={`${product.name}: ${share}% del gasto filtrado`}><span style={{ width: `${share}%` }} /></div></div></div>;
            })}</div>
          </article>
        </section>

        <section className="panel products-panel" id="productos">
          <div className="panel-heading"><div><p className="eyebrow">Detalle de compras</p><h2>Productos de las facturas</h2></div><span className="result-count">{filteredItems.length} resultados</span></div>
          <div className="table-wrap">
            <table><thead><tr><th>Producto</th><th>Proveedor</th><th>Fecha</th><th>Cantidad</th><th>Precio unitario</th><th>Total</th><th><span className="sr-only">Acciones</span></th></tr></thead>
              <tbody>{filteredItems.map((item) => <tr key={item.id}><td><strong>{item.description}</strong><small>{item.category} · {item.invoiceNumber}</small></td><td data-label="Proveedor">{item.supplier}</td><td data-label="Fecha">{dateFormat.format(new Date(`${item.date}T00:00:00Z`))}</td><td data-label="Cantidad">{item.quantity}{item.unit ? ` ${item.unit}` : ""}</td><td data-label="Precio unitario">{colones.format(item.unitPrice)}</td><td data-label="Total"><strong>{colones.format(item.total)}</strong></td><td>{item.invoiceId.startsWith("MANUAL-") && <button className="row-action" type="button" onClick={() => openManualEdit(allInvoices.find((invoice) => invoice.id === item.invoiceId) as Invoice)} aria-label={`Editar factura manual ${item.invoiceNumber}`} title="Editar factura manual"><span aria-hidden="true">✎</span></button>}</td></tr>)}</tbody>
            </table>
            {filteredItems.length === 0 && <div className="empty-state"><SearchIcon /><strong>No encontramos productos</strong><span>Prueba con otra combinación de filtros.</span></div>}
          </div>
        </section>
      </div>
      {manualFormOpen && <div className="manual-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeManualForm(); }}>
        <section className="manual-modal" role="dialog" aria-modal="true" aria-labelledby="manual-form-title">
          <div className="manual-modal-heading"><div><p className="eyebrow">{editingInvoice ? "Editar compra sin comprobante" : "Compra sin comprobante"}</p><h2 id="manual-form-title">{editingInvoice ? "Editar factura manual" : "Agregar factura manual"}</h2></div><button type="button" className="modal-close" onClick={closeManualForm} aria-label="Cerrar formulario">×</button></div>
          <form className="manual-form" onSubmit={handleManualSubmit}>
            <label className="manual-field manual-field-wide"><span>Nombre del producto o gasto</span><input required value={manualName} onChange={(event) => setManualName(event.target.value.toLocaleLowerCase("es-CR"))} placeholder="ej. papas gajo jedi" autoFocus /></label>
            <label className="manual-field manual-field-wide"><span>Proveedor <small>Opcional</small></span><input value={manualSupplier} onChange={(event) => setManualSupplier(event.target.value.toLocaleLowerCase("es-CR"))} placeholder="proveedor sin factura" /></label>
            <label className="manual-field"><span>Precio total</span><input required min="0.01" step="0.01" inputMode="decimal" type="number" value={manualTotal} onChange={(event) => setManualTotal(event.target.value)} placeholder="0" /></label>
            <label className="manual-field"><span>Cantidad y unidad</span><span className="quantity-unit-inputs"><input required min="0.01" step="0.01" inputMode="decimal" type="number" value={manualQuantity} onChange={(event) => setManualQuantity(event.target.value)} aria-label="Cantidad" /><select value={manualUnit} onChange={(event) => setManualUnit(event.target.value)} aria-label="Unidad"><option value="unidad">unidad</option><option value="kg">kg</option><option value="g">g</option><option value="litro">litro</option><option value="ml">ml</option><option value="caja">caja</option><option value="paquete">paquete</option><option value="bolsa">bolsa</option><option value="galón">galón</option><option value="saco">saco</option><option value="rollo">rollo</option><option value="cubeta">cubeta</option><option value="cilindro">cilindro</option></select></span></label>
            <label className="manual-field"><span>Fecha</span><input required type="date" value={manualDate} onChange={(event) => setManualDate(event.target.value)} /></label>
            <label className="manual-field"><span>Precio unitario <small>Opcional</small></span><input min="0.01" step="0.01" inputMode="decimal" type="number" value={manualUnitPrice} onChange={(event) => setManualUnitPrice(event.target.value)} placeholder="Se calcula automáticamente" /></label>
            {manualError && <div className="manual-form-error" role="alert">{manualError}</div>}
            <div className="manual-form-actions"><button type="button" className="secondary-button" onClick={closeManualForm} disabled={manualSaving}>Cancelar</button><button type="submit" className="primary-button" disabled={manualSaving}>{manualSaving ? "Guardando…" : editingInvoice ? "Guardar cambios" : "Agregar factura"}</button></div>
          </form>
        </section>
      </div>}
    </div>
  );
}
