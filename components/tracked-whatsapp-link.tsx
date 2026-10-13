"use client";

import type { ComponentPropsWithoutRef } from "react";
import {
  trackWhatsAppClick,
  type WhatsAppContactType,
} from "@/lib/analytics";

type TrackedWhatsAppLinkProps = Omit<
  ComponentPropsWithoutRef<"a">,
  "id" | "onClick"
> & {
  id: string;
  analyticsLocation: string;
  contactType?: WhatsAppContactType;
};

export function TrackedWhatsAppLink({
  id,
  analyticsLocation,
  contactType = "general_contact",
  children,
  ...linkProps
}: TrackedWhatsAppLinkProps) {
  return (
    <a
      {...linkProps}
      id={id}
      data-analytics="whatsapp"
      data-location={analyticsLocation}
      data-action={contactType}
      onClick={() =>
        trackWhatsAppClick({
          buttonId: id,
          buttonLocation: analyticsLocation,
          contactType,
        })
      }
    >
      {children}
    </a>
  );
}
