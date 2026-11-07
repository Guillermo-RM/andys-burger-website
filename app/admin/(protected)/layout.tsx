import type { ReactNode } from "react";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/access";
import { BrandWordmark } from "@/features/admin-shell/brand";
import { AdminNavigation } from "@/features/admin-shell/navigation";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin();
  return <div className="shell">
    <aside className="rail">
      <Link href="/admin" className="brand"><BrandWordmark /></Link>
      <AdminNavigation />
    </aside>
    <main id="main" className="content">{children}</main>
  </div>;
}
