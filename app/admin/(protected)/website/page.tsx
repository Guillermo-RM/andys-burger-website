import { requireAdmin } from "@/lib/admin/access";
import Link from "next/link";
import { getEditablePrices } from "@/features/website/prices";

const notices: Record<string, string> = {
  saved: "Precio guardado. Volvé a cargar el sitio para ver el cambio.",
  conflict: "El precio cambió desde que abriste la página. Revisá el precio actual antes de guardar.",
  invalid: "Revisá el producto y el precio. Ingresá un monto entero mayor que cero.",
  uncertain: "No pudimos confirmar el cambio. Revisá el precio actual antes de volver a guardar.",
};
const colones = new Intl.NumberFormat("es-CR", { style: "currency", currency: "CRC", maximumFractionDigits: 0 });

export default async function Website({ searchParams }: { searchParams: Promise<{ estado?: string }> }) {
  await requireAdmin();
  const { estado } = await searchParams;
  const items = await getEditablePrices().catch(() => null);
  const groups = items ? [...new Set(items.map(({ group }) => group))] : [];
  return <>
    <header className="hero page-heading"><div><p className="eyebrow">Website</p><h1>Precios del menú</h1></div>
      <Link className="button secondary" href="/" target="_blank" rel="noopener noreferrer">Ver sitio público ↗</Link>
    </header>
    {estado && Object.hasOwn(notices, estado) && <p className={`notice ${estado === "saved" ? "success" : "error"}`} role="status">{notices[estado]}</p>}
    {!items && <p className="notice error" role="alert">No pudimos cargar los precios. <Link href="/admin/website">Volvé a intentar</Link>.</p>}
    {items?.length === 0 && <p className="notice">Todavía no hay productos disponibles.</p>}
    {groups.map((group) => <section className="price-group" key={group}>
      <h2>{group}</h2>
      {items?.filter((item) => item.group === group).map((item) => <form className="price-row" key={item.id} action="/admin/api/website/prices" method="post">
        <div><label htmlFor={item.id}>{item.name}</label><small>Actual: <strong>{colones.format(item.price)}</strong></small></div>
        <input type="hidden" name="id" value={item.id}/><input type="hidden" name="expected" value={item.price}/>
        <div className="price-controls"><div className="currency-input"><span aria-hidden="true">₡</span><input id={item.id} name="price" type="number" inputMode="numeric" required min={1} max={1000000} step={1} defaultValue={item.price}/></div>
        <button className="button">Guardar</button></div>
      </form>)}
    </section>)}
  </>;
}
