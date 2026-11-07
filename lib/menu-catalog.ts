import { burgers, extras, potatoOrders } from "@/lib/menu";

function groupItems(items: { id: string; name: string; price: number }[], group: string) {
  return items.map(({ id, name, price }) => ({ id, name, group, basePrice: price }));
}

export const menuCatalog = [
  ...groupItems(burgers, "Hamburguesas"),
  ...groupItems(extras, "Extras"),
  ...groupItems(potatoOrders, "Adicionales"),
];
