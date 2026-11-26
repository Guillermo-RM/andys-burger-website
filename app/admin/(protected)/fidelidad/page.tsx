import { requireAdmin } from "@/lib/admin/access";
import styles from "@/features/fidelidad/workspace.module.css";

export default async function FidelityPage() {
  await requireAdmin();

  return (
    <>
      <header className="hero">
        <h1>Fidelidad</h1>
      </header>
      <section className={styles.workspace} aria-labelledby="fidelity-workspace-title">
        <h2 id="fidelity-workspace-title">Clientes y compras</h2>
        <p>
          Módulo en preparación. Aquí se administrarán los clientes y sus compras.
        </p>
        <p className={styles.notice}>
          El registro de clientes estará disponible al implementar el almacenamiento.
        </p>
      </section>
    </>
  );
}
