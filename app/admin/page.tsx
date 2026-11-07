import { redirect } from "next/navigation";
import { BrandWordmark } from "@/features/admin-shell/brand";
import { isSignedIn } from "@/lib/admin/access";
import { PasswordInput } from "./password-input";

export default async function Login({ searchParams }: { searchParams: Promise<{ estado?: string }> }) {
  if (await isSignedIn()) redirect("/admin/facturas");
  const { estado } = await searchParams;
  const error = estado === "limite" ? "Se alcanzó el límite de intentos. Esperá un minuto y volvé a intentar."
    : estado === "servicio" ? "No pudimos iniciar la sesión. Volvé a intentarlo en un momento."
    : estado === "invalida" ? "La contraseña no es correcta." : null;
  return <main className="login">
    <div className="login-photo" aria-hidden="true" />
    <section className="login-card">
      <div className="brand"><BrandWordmark /></div>
      <h1>Iniciar sesión</h1>
      {error && <p className="notice error" role="alert">{error}</p>}
      <form action="/admin/api/auth/login" method="post">
        <PasswordInput />
        <button className="button">Ingresar al panel</button>
      </form>
    </section>
  </main>;
}
