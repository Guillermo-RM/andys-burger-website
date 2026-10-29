"use client";

import Image from "next/image";
import styles from "./additional-card.module.css";
import { useState } from "react";
import { useOrderCart } from "@/components/order-cart-context";
import { dressingOptions, type PotatoOrder } from "@/lib/menu";

const images: Record<string, string> = {
  "orden-papas-gajo": "/adicionales/papas-gajo.webp",
  "orden-papas-crispy": "/adicionales/papas-crispy.webp",
  "aros-cebolla": "/adicionales/aros-cebolla.webp",
  "chilli-poppers": "/adicionales/chilli-poppers.webp",
};

export function AdditionalCard({ item }: { item: PotatoOrder }) {
  const { cart, toggleProduct } = useOrderCart();
  const [dressing, setDressing] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const id = item.dressings ? `${item.id}-aderezo-${dressing}` : item.id;
  const selected = (cart[id] ?? 0) > 0;
  return (
    <article className={`potato-order-card ${styles.card}`} data-in-cart={selected}>
      <Image className="potato-order-card__image" src={images[item.id]} alt={item.name} width={800} height={800} sizes="(max-width: 44rem) 100vw, 40vw" unoptimized />
      <div><h3>{item.name}</h3><p>{item.description}</p></div>
      <strong>{new Intl.NumberFormat("es-CR", { style: "currency", currency: "CRC", maximumFractionDigits: 0 }).format(item.price)}</strong>
      {item.dressings && (
        <div className={styles.picker}>
          <span className={styles.caption} id={`dressing-label-${item.id}`}>Elegí tu aderezo</span>
          <div className={styles.control} onKeyDown={(event) => { if (event.key === "Escape") { setMenuOpen(false); (event.currentTarget.querySelector("button") as HTMLButtonElement | null)?.focus(); } }}>
            <button type="button" className={styles.trigger} aria-expanded={menuOpen} aria-controls={`dressing-options-${item.id}`} aria-labelledby={`dressing-label-${item.id} dressing-value-${item.id}`} onClick={() => setMenuOpen((open) => !open)}>
              <span id={`dressing-value-${item.id}`}>{dressingOptions[dressing]}</span><svg className={styles.arrow} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <div className={styles.panel} data-open={menuOpen} inert={!menuOpen} id={`dressing-options-${item.id}`}>
              <div className={styles.inner}>
                <div className={styles.options} role="group" aria-labelledby={`dressing-label-${item.id}`}>
                  {dressingOptions.map((option, index) => (
                    <label key={option} className={styles.option}>
                      <input type="radio" name={`dressing-${item.id}`} checked={dressing === index} onChange={() => { setDressing(index); setMenuOpen(false); }} />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <label><input type="checkbox" checked={selected} onChange={(event) => toggleProduct(id, event.target.checked)} /><span>Agregar al pedido</span></label>
    </article>
  );
}
