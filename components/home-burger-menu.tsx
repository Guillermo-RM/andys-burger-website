"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useOrderCart } from "@/components/order-cart-context";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { burgers, extraCategories, extras, potatoOrders } from "@/lib/menu";
import { createWhatsAppUrl } from "@/lib/whatsapp";

const orderProducts = [
  ...burgers.map((burger) => ({ ...burger, orderGroup: "burgers" as const })),
  ...extras.map((extra) => ({ ...extra, orderGroup: "extras" as const })),
  ...potatoOrders.map((potato) => ({
    ...potato,
    orderGroup: "potatoes" as const,
  })),
];
const extraCategoryColumns = [
  extraCategories.filter((category) =>
    ["carne", "vegetales"].includes(category.id),
  ),
  extraCategories.filter((category) =>
    ["especiales", "salsas-aderezos", "dulces"].includes(category.id),
  ),
];

const formatColones = (amount: number) =>
  new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0,
  }).format(amount);

export function HomeBurgerMenu() {
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const { cart, setQuantity, toggleProduct } = useOrderCart();
  const [expandedIngredients, setExpandedIngredients] = useState<
    Record<string, boolean>
  >({});
  const mobileCartRef = useRef<HTMLElement>(null);

  const cartItems = useMemo(
    () =>
      orderProducts
        .filter((product) => (cart[product.id] ?? 0) > 0)
        .map((product) => ({ ...product, quantity: cart[product.id] })),
    [cart],
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
      title: "Órdenes de papas",
      items: cartItems.filter((product) => product.orderGroup === "potatoes"),
      alwaysVisible: false,
    },
  ];
  const totalProducts = cartItems.reduce(
    (sum, product) => sum + product.quantity,
    0,
  );

  const toggleIngredients = (id: string) => {
    setExpandedIngredients((current) => ({
      ...current,
      [id]: !current[id],
    }));
  };

  useEffect(() => {
    if (!mobileCartOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileCartOpen(false);
    };
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!mobileCartRef.current?.contains(event.target as Node)) {
        setMobileCartOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
    };
  }, [mobileCartOpen]);

  const sendOrder = () => {
    const orderSections = [
      { title: "HAMBURGUESAS", orderGroup: "burgers" },
      { title: "EXTRAS", orderGroup: "extras" },
      { title: "ÓRDENES DE PAPAS", orderGroup: "potatoes" },
    ]
      .map(({ title, orderGroup }) => {
        const lines = cartItems
          .filter((product) => product.orderGroup === orderGroup)
          .map(
            (product) =>
              `- ${product.name}, Cantidad: ${product.quantity}`,
          );

        return lines.length > 0 ? [`*${title}*`, ...lines].join("\n") : null;
      })
      .filter((section): section is string => section !== null);

    const message =
      cartItems.length > 0
        ? [
            "Hola, Andy's Burger!",
            "",
            "Quiero realizar el siguiente pedido:",
            "",
            orderSections.join("\n\n"),
            "",
            "Por favor, confirmame la disponibilidad y el total final.",
          ].join("\n")
        : "Hola, Andy's Burger!";

    window.open(
      createWhatsAppUrl(message),
      "_blank",
      "noopener,noreferrer",
    );
    setMobileCartOpen(false);
  };

  return (
    <section className="burger-menu" aria-labelledby="burger-menu-title">
      <div className="burger-menu__heading">
        <p>13 hamburguesas para elegir</p>
        <h2 id="burger-menu-title">Menú de hamburguesas en San Ramón</h2>
        <span>
          Conocé nuestro menú de hamburguesas en San Ramón: 13 opciones con
          precios, ingredientes y acompañamiento de papas gajo o crispy. Elegí
          tus favoritas y realizá tu pedido por WhatsApp.
        </span>
      </div>

      <div className="burger-menu__layout">
        <div className="burger-picker">
          <div className="burger-mobile-grid" aria-label="Hamburguesas disponibles">
            {burgers.map((burger) => {
              const isInCart = (cart[burger.id] ?? 0) > 0;
              const ingredientsOpen = expandedIngredients[burger.id] ?? false;
              const ingredientsId = `ingredients-${burger.id}`;

              return (
                <article
                  key={burger.id}
                  className="burger-mobile-card"
                  data-in-cart={isInCart}
                >
                  <label className="burger-mobile-card__selector">
                    <div className="burger-mobile-card__media">
                      <Image
                        className="burger-mobile-card__image"
                        src={burger.image.src}
                        width={burger.image.width}
                        height={burger.image.height}
                        sizes="(max-width: 44rem) calc(50vw - 1.25rem), (max-width: 80rem) 33vw, 22vw"
                        quality={60}
                        loading="lazy"
                        alt={burger.image.alt}
                      />
                    </div>
                    <div className="burger-mobile-card__content">
                      <h3>{burger.name}</h3>
                      <strong>{formatColones(burger.price)}</strong>
                      <span className="burger-mobile-card__check">
                      <input
                        type="checkbox"
                        checked={isInCart}
                        aria-label={`Seleccionar ${burger.name}`}
                        onChange={(event) =>
                          toggleProduct(burger.id, event.target.checked)
                        }
                      />
                      <span>Seleccionar</span>
                      </span>
                    </div>
                  </label>
                  <div
                    className="burger-mobile-card__details"
                    data-open={ingredientsOpen}
                  >
                    <button
                      className="burger-mobile-card__summary"
                      type="button"
                      aria-expanded={ingredientsOpen}
                      aria-controls={ingredientsId}
                      onClick={() => toggleIngredients(burger.id)}
                    >
                      <span>Ver Ingredientes</span>
                      <span
                        className="burger-mobile-card__arrow"
                        aria-hidden="true"
                      />
                    </button>
                    <div
                      id={ingredientsId}
                      className="burger-mobile-card__details-panel"
                      aria-hidden={!ingredientsOpen}
                    >
                      <div className="burger-mobile-card__details-inner">
                        <p className="burger-mobile-card__description">
                          {burger.description}
                        </p>
                        <ul aria-label={`Ingredientes de ${burger.name}`}>
                          {burger.ingredients.split(", ").map((ingredient) => (
                            <li key={ingredient}>{ingredient}</li>
                          ))}
                        </ul>
                        <p>Incluye papas gajo o crispy</p>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <section className="extras-menu" aria-labelledby="extras-menu-title">
            <div className="extras-menu__heading">
              <p>Personalizá tu hamburguesa</p>
              <h2 id="extras-menu-title">Extras para añadir más sabor</h2>
              <span>
                Elegí tus ingredientes adicionales y agregalos directamente a
                tu pedido de Andy&apos;s Burger.
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

          <section
            className="potato-orders"
            aria-labelledby="potato-orders-title"
          >
            <div className="potato-orders__heading">
              <p>Para acompañar</p>
              <h2 id="potato-orders-title">Órdenes adicionales de papas</h2>
              <span>
                Agregá una orden completa de papas gajo o crispy a tu pedido.
              </span>
            </div>

            <div className="potato-orders__grid">
              {potatoOrders.map((potato) => {
                const isInCart = (cart[potato.id] ?? 0) > 0;

                return (
                  <article
                    className="potato-order-card"
                    data-in-cart={isInCart}
                    key={potato.id}
                  >
                    <span className="potato-order-card__emoji" aria-hidden="true">
                      {potato.emoji}
                    </span>
                    <div>
                      <h3>{potato.name}</h3>
                      <p>{potato.description}</p>
                    </div>
                    <strong>{formatColones(potato.price)}</strong>
                    <label>
                      <input
                        type="checkbox"
                        checked={isInCart}
                        onChange={(event) =>
                          toggleProduct(potato.id, event.target.checked)
                        }
                      />
                      <span>Agregar al pedido</span>
                    </label>
                  </article>
                );
              })}
            </div>
          </section>
        </div>

        {mobileCartOpen && (
          <button
            type="button"
            className="mobile-cart-backdrop"
            aria-label="Cerrar selección"
            onPointerDown={() => setMobileCartOpen(false)}
          />
        )}

        <aside
          ref={mobileCartRef}
          id="mobile-order-cart"
          className="order-cart"
          data-mobile-open={mobileCartOpen}
          aria-labelledby="order-cart-title"
        >
        <div className="order-cart__header">
          <div>
            <h3 id="order-cart-title">Tu selección</h3>
          </div>
          <button
            className="order-cart__minimize"
            type="button"
            aria-label="Minimizar selección"
            onClick={() => setMobileCartOpen(false)}
          >
            ×
          </button>
        </div>

        <div className="order-cart__body">
          <div className="order-cart__groups">
            {cartSections
              .filter((section) => section.alwaysVisible || section.items.length > 0)
              .map((section) => (
                <section className="order-cart__group" key={section.id}>
                  <h4>{section.title}</h4>
                  {section.items.length > 0 ? (
                    <ul className="order-cart__items">
                      {section.items.map((product) => (
                        <li key={product.id} className="order-cart__item">
                          <div className="order-cart__item-name">
                            <strong>{product.name}</strong>
                          </div>
                          <div
                            className="order-cart__controls"
                            aria-label={`Cantidad de ${product.name}`}
                          >
                            <button
                              type="button"
                              aria-label={`Restar una ${product.name}`}
                              onClick={() =>
                                setQuantity(product.id, product.quantity - 1)
                              }
                            >
                              −
                            </button>
                            <span aria-live="polite">{product.quantity}</span>
                            <button
                              type="button"
                              aria-label={`Agregar otra ${product.name}`}
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
                className="order-cart__order"
                type="button"
                aria-label="Enviar selección por WhatsApp; abre una nueva ventana"
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

        <div className="mobile-order-actions" aria-label="Acciones del pedido">
          <button
            className="mobile-order-actions__cart"
            type="button"
            aria-label="Mostrar selección"
            aria-controls="mobile-order-cart"
            aria-expanded={mobileCartOpen}
            onClick={() => setMobileCartOpen(true)}
          >
            <span className="mobile-order-actions__cart-icon" aria-hidden="true" />
            {totalProducts > 0 && (
              <span className="mobile-order-actions__badge">{totalProducts}</span>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
