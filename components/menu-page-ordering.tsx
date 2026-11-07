"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MenuSectionNavigation } from "@/components/menu-section-navigation";
import { AdditionalCard } from "@/components/additional-card";
import { useOrderCart } from "@/components/order-cart-context";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { trackWhatsAppClick } from "@/lib/analytics";
import { buildOrderProducts, type MenuSnapshot } from "@/lib/menu";
import { createWhatsAppUrl } from "@/lib/whatsapp";

const formatColones = (price: number) =>
  new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0,
  }).format(price);

export function MenuPageOrdering({ menu }: { menu: MenuSnapshot }) {
  const { burgers, extraCategories, potatoOrders } = menu;
  const orderProducts = useMemo(() => buildOrderProducts(menu), [menu]);
  const extraCategoryColumns = [
    extraCategories.filter((category) => ["carne", "vegetales"].includes(category.id)),
    extraCategories.filter((category) => ["especiales", "salsas-aderezos", "dulces"].includes(category.id)),
  ];
  const { cart, setQuantity, toggleProduct } = useOrderCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [cartTransparent, setCartTransparent] = useState(false);
  const cartRef = useRef<HTMLElement>(null);
  const cartTriggerRef = useRef<HTMLButtonElement>(null);

  const closeCart = useCallback(() => {
    setCartOpen(false);
    setCartTransparent(false);
  }, [setCartOpen, setCartTransparent]);

  const cartItems = useMemo(
    () =>
      orderProducts
        .filter((product) => (cart[product.id] ?? 0) > 0)
        .map((product) => ({ ...product, quantity: cart[product.id] })),
    [cart, orderProducts],
  );
  const cartSections = [
    {
      id: "burgers",
      title: "Hamburguesas",
      items: cartItems.filter((product) => product.orderGroup === "burgers"),
      alwaysVisible: true,
    },
    {
      id: "extras",
      title: "Extras",
      items: cartItems.filter((product) => product.orderGroup === "extras"),
      alwaysVisible: false,
    },
    {
      id: "potatoes",
      title: "Adicionales",
      items: cartItems.filter((product) => product.orderGroup === "potatoes"),
      alwaysVisible: false,
    },
  ];
  const totalProducts = cartItems.reduce(
    (total, product) => total + product.quantity,
    0,
  );

  useEffect(() => {
    if (!cartOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!window.matchMedia("(max-width: 44rem)").matches) return;

      const target = event.target as Node;
      if (
        !cartRef.current?.contains(target) &&
        !cartTriggerRef.current?.contains(target)
      ) {
        closeCart();
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
    };
  }, [cartOpen, closeCart]);

  useEffect(() => {
    if (!cartOpen) return;

    const makeCartTransparent = () => {
      if (window.matchMedia("(min-width: 44.01rem)").matches) {
        setCartTransparent(true);
      }
    };

    window.addEventListener("scroll", makeCartTransparent, { passive: true });
    return () => window.removeEventListener("scroll", makeCartTransparent);
  }, [cartOpen]);

  const sendOrder = () => {
    const sections = [
      { title: "HAMBURGUESAS", group: "burgers" },
      { title: "EXTRAS", group: "extras" },
      { title: "ADICIONALES", group: "potatoes" },
    ]
      .map(({ title, group }) => {
        const lines = cartItems
          .filter((product) => product.orderGroup === group)
          .map((product) => `- ${product.name}, Cantidad: ${product.quantity}`);

        return lines.length ? [`*${title}*`, ...lines].join("\n") : null;
      })
      .filter((section): section is string => section !== null);

    const message = cartItems.length
      ? [
          "Hola, Andy's Burger!",
          "",
          "Quiero realizar el siguiente pedido:",
          "",
          sections.join("\n\n"),
          "",
          "Por favor, confirmame la disponibilidad y el total final.",
        ].join("\n")
      : "Hola, Andy's Burger!";

    trackWhatsAppClick({
      buttonId: "whatsapp-menu-cart",
      buttonLocation: "menu_cart",
      contactType: "order_intent",
      cartValue: cartItems.reduce(
        (total, product) => total + product.price * product.quantity,
        0,
      ),
      items: cartItems.map((product) => ({
        item_id: product.id,
        item_name: product.name,
        quantity: product.quantity,
      })),
    });

    window.open(
      createWhatsAppUrl(message),
      "_blank",
      "noopener,noreferrer",
    );
    closeCart();
  };

  return (
    <>
      <div className="menu-catalog-shell">
        <MenuSectionNavigation
          items={burgers.map(({ id, name }) => ({ id, name }))}
        />

        <section className="menu-catalog" aria-label="Hamburguesas de Andy's Burger">
          {burgers.map((burger, index) => {
            const isInCart = (cart[burger.id] ?? 0) > 0;

            return (
              <article
                className="menu-catalog__item"
                id={burger.id}
                key={burger.id}
                data-in-cart={isInCart}
                aria-labelledby={`${burger.id}-title`}
              >
                <div className="menu-catalog__media">
                  <Image
                    src={burger.image.src}
                    width={burger.image.width}
                    height={burger.image.height}
                    sizes="(max-width: 48rem) calc(100vw - 2rem), 45vw"
                    quality={70}
                    loading={index === 0 ? "eager" : "lazy"}
                    alt={burger.image.alt}
                  />
                </div>

                <div className="menu-catalog__content">
                  <p className="menu-catalog__number">
                    Hamburguesa {String(index + 1).padStart(2, "0")}
                  </p>
                  <div className="menu-catalog__title-row">
                    <h2 id={`${burger.id}-title`}>{burger.name}</h2>
                    <strong>{formatColones(burger.price)}</strong>
                  </div>
                  <p className="menu-catalog__description">{burger.description}</p>

                  <div className="menu-catalog__ingredients">
                    <h3>Ingredientes</h3>
                    <ul>
                      {burger.ingredients.split(", ").map((ingredient) => (
                        <li key={ingredient}>{ingredient}</li>
                      ))}
                    </ul>
                  </div>

                  <p className="menu-catalog__side">Incluye papas gajo o crispy.</p>
                  <label className="menu-catalog__cta menu-catalog__select">
                    <input
                      className="sr-only"
                      type="checkbox"
                      checked={isInCart}
                      onChange={(event) =>
                        toggleProduct(burger.id, event.target.checked)
                      }
                    />
                    <span>
                      {isInCart
                        ? `${burger.name} agregada`
                        : `Agregar ${burger.name}`}
                    </span>
                  </label>
                </div>
              </article>
            );
          })}
        </section>
      </div>

      <section className="menu-addons" aria-labelledby="menu-extras-title">
        <div className="menu-addons__heading">
          <p>Armala a tu gusto</p>
          <h2 id="menu-extras-title">Extras para hamburguesas</h2>
          <span>
            Agregá carne, quesos, vegetales, salsas o sabores especiales a tu
            pedido de Andy&apos;s Burger en San Ramón.
          </span>
        </div>

        <div className="extras-menu__grid">
          {extraCategoryColumns.map((column, columnIndex) => (
            <div className="extras-menu__column" key={columnIndex}>
              {column.map((category) => (
                <article
                  className="extras-category"
                  data-category={category.id}
                  key={category.id}
                >
                  <h3>
                    {category.label} <span>{category.accent}</span>
                  </h3>
                  <ul>
                    {category.items.map((extra) => {
                      const isInCart = (cart[extra.id] ?? 0) > 0;

                      return (
                        <li key={extra.id} data-in-cart={isInCart}>
                          <label>
                            <input
                              type="checkbox"
                              checked={isInCart}
                              onChange={(event) =>
                                toggleProduct(extra.id, event.target.checked)
                              }
                            />
                            <span className="extras-category__name">
                              <span aria-hidden="true">{extra.emoji}</span>
                              {extra.name}
                            </span>
                            <strong>{formatColones(extra.price)}</strong>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </article>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="menu-potatoes" aria-labelledby="menu-potatoes-title">
        <div className="menu-addons__heading">
          <p>El acompañamiento completo</p>
          <h2 id="menu-potatoes-title">Adicionales</h2>
          <span>
            Sumá papas, aros de cebolla o Chilli Poppers a tu pedido.
          </span>
        </div>

        <div className="potato-orders__grid">
          {potatoOrders.map((item) => <AdditionalCard key={item.id} item={item} />)}
        </div>
      </section>

      <aside
        ref={cartRef}
        id="menu-page-order-cart"
        className="order-cart menu-page-cart"
        data-open={cartOpen}
        data-scrolling={cartTransparent}
        aria-labelledby="menu-page-cart-title"
        onPointerEnter={() => setCartTransparent(false)}
        onFocusCapture={() => setCartTransparent(false)}
      >
        <div className="order-cart__header">
          <h3 id="menu-page-cart-title">Tu selección</h3>
          <button
            className="order-cart__minimize"
            type="button"
            aria-label="Minimizar selección"
            onClick={closeCart}
          >
            ×
          </button>
        </div>

        <div className="order-cart__body">
          <div className="order-cart__groups">
            {cartSections
              .filter((section) => section.alwaysVisible || section.items.length)
              .map((section) => (
                <section className="order-cart__group" key={section.id}>
                  <h4>{section.title}</h4>
                  {section.items.length ? (
                    <ul className="order-cart__items">
                      {section.items.map((product) => (
                        <li className="order-cart__item" key={product.id}>
                          <div className="order-cart__item-name">
                            <strong>{product.name}</strong>
                          </div>
                          <div
                            className="order-cart__controls"
                            aria-label={`Cantidad de ${product.name}`}
                          >
                            <button
                              type="button"
                              aria-label={`Restar una unidad de ${product.name}`}
                              onClick={() =>
                                setQuantity(product.id, product.quantity - 1)
                              }
                            >
                              −
                            </button>
                            <span aria-live="polite">{product.quantity}</span>
                            <button
                              type="button"
                              aria-label={`Agregar otra unidad de ${product.name}`}
                              onClick={() =>
                                setQuantity(product.id, product.quantity + 1)
                              }
                            >
                              +
                            </button>
                            <button
                              className="order-cart__remove"
                              type="button"
                              onClick={() => setQuantity(product.id, 0)}
                            >
                              Eliminar
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="order-cart__group-empty">
                      Todavía no agregaste hamburguesas.
                    </p>
                  )}
                </section>
              ))}
          </div>

          {cartItems.length > 0 && (
            <div className="order-cart__summary">
              <button
                id="whatsapp-menu-cart"
                className="order-cart__order"
                type="button"
                data-analytics="whatsapp"
                data-location="menu_cart"
                data-action="order_intent"
                onClick={sendOrder}
              >
                <WhatsAppIcon />
                <span>Pedir por WhatsApp</span>
              </button>
              <small>El negocio confirmará disponibilidad y total final.</small>
            </div>
          )}
        </div>
      </aside>

      <button
        ref={cartTriggerRef}
        className="menu-page-cart-trigger"
        type="button"
        aria-label="Mostrar selección"
        aria-controls="menu-page-order-cart"
        aria-expanded={cartOpen}
        onClick={() => {
          setCartOpen((current) => !current);
          setCartTransparent(false);
        }}
      >
        <span className="mobile-order-actions__cart-icon" aria-hidden="true" />
        {totalProducts > 0 && (
          <span className="mobile-order-actions__badge">{totalProducts}</span>
        )}
      </button>
    </>
  );
}
