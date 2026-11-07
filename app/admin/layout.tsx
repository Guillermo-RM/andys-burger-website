import type { Metadata } from "next";
import type { ReactNode } from "react";
import { brandName } from "@/features/admin-shell/brand";
import "./styles.css";

export const metadata: Metadata = {
  title: `${brandName} | Administración`,
  icons: { icon: "/brand/logo.webp" },
  robots: { index: false, follow: false },
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="es-CR"><body>{children}</body></html>;
}
