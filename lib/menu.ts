import { burgerImages, type SiteImage } from "@/lib/images";

export type Burger = {
  id: string;
  name: string;
  price: number;
  description: string;
  ingredients: string;
  image: SiteImage;
};

export type Extra = {
  id: string;
  name: string;
  price: number;
  category: string;
  emoji: string;
};

export type ExtraCategory = {
  id: string;
  label: string;
  accent: string;
  items: Extra[];
};

export type PotatoOrder = {
  id: string;
  name: string;
  price: number;
  emoji: string;
  description: string;
};

export const burgers: Burger[] = [
  {
    id: "the-boss",
    name: "The Boss",
    price: 7500,
    description: "La opción para hambre en serio: doble carne de 200 g, dos quesos y todo el sabor de la casa.",
    ingredients:
      "Lechuga, tomate, salsa de la casa, hongos, cebolla, jamón, huevo frito, dos tortas de carne de 200 g, queso amarillo y queso mozzarella.",
    image: burgerImages.theBoss,
  },
  {
    id: "bacon",
    name: "Bacon",
    price: 5500,
    description: "Carne de 200 g, tocineta y chipotle en una combinación intensa, cremosa y ahumada.",
    ingredients:
      "Hongos, cebolla, jamón, torta de carne de 200 g, tocineta, queso amarillo, queso mozzarella y salsa chipotle.",
    image: burgerImages.bacon,
  },
  {
    id: "andys",
    name: "Andy's",
    price: 5200,
    description: "El sabor clásico de Andy's: carne de 200 g, jamón, dos quesos y nuestra salsa de la casa.",
    ingredients:
      "Lechuga, tomate, hongos, cebolla, jamón, torta de carne de 200 g, queso amarillo, queso mozzarella y salsa de la casa.",
    image: burgerImages.andys,
  },
  {
    id: "spicy",
    name: "Spicy",
    price: 5200,
    description: "Carne de 200 g con jalapeño dentro de la torta para disfrutar un picante sabroso de principio a fin.",
    ingredients:
      "Lechuga, tomate, hongos, cebolla, jamón, torta de carne de 200 g con jalapeño, queso amarillo, queso mozzarella y salsa de la casa.",
    image: burgerImages.spicy,
  },
  {
    id: "chicken-andys",
    name: "Chicken Andy's",
    price: 5000,
    description: "Pollo empanizado crujiente, dos quesos y salsa tártara para una mordida llena de textura.",
    ingredients:
      "Lechuga, tomate, salsa tártara, hongos, cebolla, pollo empanizado, queso amarillo y queso mozzarella.",
    image: burgerImages.chickenAndys,
  },
  {
    id: "guacamole",
    name: "Guacamole",
    price: 5200,
    description: "Carne de 200 g, guacamole cremoso y dos quesos en una hamburguesa fresca y abundante.",
    ingredients:
      "Hongos, cebolla, torta de carne de 200 g, queso amarillo, queso mozzarella, guacamole y salsa de la casa.",
    image: burgerImages.guacamole,
  },
  {
    id: "bbq-deluxe",
    name: "BBQ Deluxe",
    price: 5500,
    description: "Tocineta, pepinillos, carne de 200 g y salsa BBQ para quienes buscan un sabor ahumado y potente.",
    ingredients:
      "Hongos, cebolla, tocineta, pepinillos, torta de carne de 200 g, queso amarillo, queso mozzarella, salsa BBQ y salsa de la casa.",
    image: burgerImages.bbqDeluxe,
  },
  {
    id: "andys-junior",
    name: "Andy's Junior",
    price: 4500,
    description: "Nuestra opción compacta con carne de 120 g, jamón, dos quesos, vegetales y salsa de la casa.",
    ingredients:
      "Lechuga, tomate, hongos, cebolla, jamón, torta de carne de 120 g, queso amarillo, queso mozzarella y salsa de la casa.",
    image: burgerImages.andysJunior,
  },
  {
    id: "chicken-guacamole",
    name: "Chicken Guacamole",
    price: 5500,
    description: "Pollo empanizado, guacamole y tocineta: una combinación crujiente, cremosa y difícil de soltar.",
    ingredients:
      "Pechuga de pollo empanizada, lechuga, tomate, queso amarillo, queso mozzarella, jamón, tocineta, hongos, cebolla, guacamole y salsa especial de la casa.",
    image: burgerImages.chickenGuacamole,
  },
  {
    id: "cheddar-lab",
    name: "Cheddar Lab",
    price: 5500,
    description: "Una explosión de queso cheddar servida en jeringa, con tocineta, mozzarella y jamón.",
    ingredients:
      "Pan, 20 cc de queso cheddar en jeringa, queso amarillo, queso mozzarella, jamón, tocineta, mayonesa de la casa, salsa de tomate, pepinillos y cebolla.",
    image: burgerImages.cheddarLab,
  },
  {
    id: "tropical-bite",
    name: "Tropical Bite",
    price: 5500,
    description: "Piña, BBQ y tocineta se unen con carne de 200 g para lograr el balance perfecto entre dulce y salado.",
    ingredients:
      "Mermelada de piña, piña, salsa BBQ, hongos, cebolla, tocineta, torta de carne de 200 g, queso amarillo, queso mozzarella y jamón.",
    image: burgerImages.tropicalBite,
  },
  {
    id: "honey-bacon",
    name: "Honey Bacon",
    price: 5500,
    description: "Pan brioche, carne de 200 g y miel de tocineta para una experiencia dulce, salada y jugosa.",
    ingredients:
      "Salsa rosada, torta de carne de 200 g, pan brioche, queso amarillo, queso mozzarella, jamón y miel de tocineta.",
    image: burgerImages.honeyBacon,
  },
  {
    id: "spicy-bacon",
    name: "Spicy Bacon",
    price: 5500,
    description: "Carne de 200 g, pan brioche y aderezo de tocineta picante en ambos panes para cerrar con fuego.",
    ingredients:
      "Torta de carne de 200 g, jamón, queso mozzarella, queso amarillo, pan brioche y aderezo de tocineta picante en ambos panes.",
    image: burgerImages.spicyBacon,
  },
];

export const extraCategories: ExtraCategory[] = [
  {
    id: "carne",
    label: "Extras de",
    accent: "carne",
    items: [
      { id: "extra-tocineta", name: "Tocineta", price: 700, category: "Carne", emoji: "🥓" },
      {
        id: "extra-pollo-empanizado",
        name: "Pollo empanizado",
        price: 1500,
        category: "Carne",
        emoji: "🍗",
      },
      {
        id: "extra-torta-con-quesos",
        name: "Torta con quesos",
        price: 1500,
        category: "Carne",
        emoji: "🥩",
      },
    ],
  },
  {
    id: "especiales",
    label: "Extras",
    accent: "especiales",
    items: [
      { id: "extra-guacamole", name: "Guacamole", price: 700, category: "Especiales", emoji: "🥑" },
      {
        id: "extra-papas-200-g",
        name: "Papas (200 gramos)",
        price: 1000,
        category: "Especiales",
        emoji: "🍟",
      },
      {
        id: "extra-queso-amarillo",
        name: "Queso amarillo",
        price: 200,
        category: "Especiales",
        emoji: "🧀",
      },
      {
        id: "extra-queso-mozzarella",
        name: "Queso mozzarella",
        price: 300,
        category: "Especiales",
        emoji: "🧀",
      },
    ],
  },
  {
    id: "vegetales",
    label: "Extras",
    accent: "vegetales",
    items: [
      { id: "extra-hongos", name: "Hongos", price: 200, category: "Vegetales", emoji: "🍄" },
      { id: "extra-cebolla", name: "Cebolla", price: 200, category: "Vegetales", emoji: "🧅" },
      { id: "extra-lechuga", name: "Lechuga", price: 200, category: "Vegetales", emoji: "🥬" },
      { id: "extra-tomate", name: "Tomate", price: 300, category: "Vegetales", emoji: "🍅" },
      { id: "extra-pepinillos", name: "Pepinillos", price: 300, category: "Vegetales", emoji: "🥒" },
      { id: "extra-jalapenos", name: "Jalapeños", price: 300, category: "Vegetales", emoji: "🌶️" },
    ],
  },
  {
    id: "salsas-aderezos",
    label: "Salsas y",
    accent: "aderezos",
    items: [
      {
        id: "extra-salsas",
        name: "Salsa de tomate o mayonesa",
        price: 400,
        category: "Salsas y aderezos",
        emoji: "🥫",
      },
      {
        id: "extra-aderezo-chipotle",
        name: "Aderezo chipotle",
        price: 300,
        category: "Salsas y aderezos",
        emoji: "🌶️",
      },
    ],
  },
  {
    id: "dulces",
    label: "Extras",
    accent: "dulces",
    items: [
      { id: "extra-pina", name: "Piña", price: 400, category: "Dulces", emoji: "🍍" },
      {
        id: "extra-miel-tocineta",
        name: "Miel de tocineta",
        price: 1000,
        category: "Dulces",
        emoji: "🍯",
      },
    ],
  },
];

export const extras = extraCategories.flatMap((category) => category.items);

export const potatoOrders: PotatoOrder[] = [
  {
    id: "orden-papas-gajo",
    name: "Orden de papas gajo",
    price: 2300,
    emoji: "🥔",
    description: "Orden adicional de papas gajo sazonadas.",
  },
  {
    id: "orden-papas-crispy",
    name: "Orden de papas crispy",
    price: 2000,
    emoji: "🍟",
    description: "Orden adicional de papas crispy crujientes.",
  },
];
