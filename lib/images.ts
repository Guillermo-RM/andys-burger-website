import {
  createCloudinarySeoImage,
  createCloudinarySocialImage,
} from "@/lib/cloudinary-loader";

export type SiteImage = {
  name: string;
  fileName: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  description: string;
  seoSrc: string;
  social: {
    src: string;
    width: number;
    height: number;
  };
};

export function createImageStructuredData(
  image: SiteImage,
  options: { representativeOfPage?: boolean } = {},
) {
  return {
    "@type": "ImageObject",
    "@id": `${image.seoSrc}#image`,
    url: image.seoSrc,
    contentUrl: image.seoSrc,
    thumbnailUrl: image.social.src,
    name: image.name,
    alternateName: image.fileName,
    description: image.description,
    caption: image.alt,
    width: image.width,
    height: image.height,
    creditText: "Andy's Burger",
    creator: {
      "@type": "Organization",
      name: "Andy's Burger",
    },
    ...(options.representativeOfPage
      ? { representativeOfPage: true }
      : {}),
  };
}

const homeHeroSource =
  "https://res.cloudinary.com/dhoho4qse/image/upload/v1785799698/hamburguesa-artesanal-andys-burger-san-ramon_kjetsu.png";

const createBurgerImage = (
  src: string,
  burgerName: string,
  fileName: string,
  width: number,
  height: number,
): SiteImage => ({
  name: `Hamburguesa ${burgerName} de Andy's Burger`,
  fileName,
  src,
  width,
  height,
  alt: `Hamburguesa ${burgerName} de Andy's Burger en San Ramón, Alajuela`,
  description: `Hamburguesa ${burgerName} preparada por Andy's Burger en San Ramón, Alajuela.`,
  seoSrc: createCloudinarySeoImage(src, width, height),
  social: {
    src: createCloudinarySocialImage(src, 1200, 630),
    width: 1200,
    height: 630,
  },
});

export const siteImages = {
  homeHero: {
    name: "Hamburguesa al grill de Andy's Burger en San Ramón",
    fileName: "hamburguesa-al-grill-andys-burger-san-ramon",
    src: homeHeroSource,
    width: 1920,
    height: 1080,
    alt: "Hamburguesa al grill de Andy's Burger en San Ramón, Alajuela",
    description:
      "Hamburguesa al grill preparada por Andy's Burger en San Ramón, Alajuela.",
    seoSrc: createCloudinarySeoImage(homeHeroSource, 1920, 1080),
    social: {
      src: createCloudinarySocialImage(homeHeroSource, 1200, 630),
      width: 1200,
      height: 630,
    },
  } satisfies SiteImage,
} as const;

export const burgerImages = {
  theBoss: createBurgerImage(
    "https://res.cloudinary.com/dhoho4qse/image/upload/v1785805991/burguer-the-boss_bjwkaw.jpg",
    "The Boss",
    "hamburguesa-the-boss-andys-burger-san-ramon",
    1202,
    1207,
  ),
  bacon: createBurgerImage(
    "https://res.cloudinary.com/dhoho4qse/image/upload/v1785805989/burguer-bacon_lb1ms7.jpg",
    "Bacon",
    "hamburguesa-bacon-andys-burger-san-ramon",
    993,
    897,
  ),
  andys: createBurgerImage(
    "https://res.cloudinary.com/dhoho4qse/image/upload/v1785806002/burguer-andys_tyrakr.jpg",
    "Andy's",
    "hamburguesa-andys-burger-san-ramon",
    940,
    935,
  ),
  spicy: createBurgerImage(
    "https://res.cloudinary.com/dhoho4qse/image/upload/v1785805989/burguer-spicy_ntyeqo.jpg",
    "Spicy",
    "hamburguesa-spicy-andys-burger-san-ramon",
    930,
    903,
  ),
  chickenAndys: createBurgerImage(
    "https://res.cloudinary.com/dhoho4qse/image/upload/v1785805989/burguer-chicken_vr0uqf.jpg",
    "Chicken Andy's",
    "hamburguesa-chicken-andys-san-ramon",
    980,
    914,
  ),
  guacamole: createBurgerImage(
    "https://res.cloudinary.com/dhoho4qse/image/upload/v1785805991/burguer-guacamole_rqtkym.jpg",
    "Guacamole",
    "hamburguesa-guacamole-andys-burger-san-ramon",
    986,
    930,
  ),
  bbqDeluxe: createBurgerImage(
    "https://res.cloudinary.com/dhoho4qse/image/upload/v1785805992/burguer-BBQdeluxe_et5sra.jpg",
    "BBQ Deluxe",
    "hamburguesa-bbq-deluxe-andys-burger-san-ramon",
    1000,
    1001,
  ),
  andysJunior: createBurgerImage(
    "https://res.cloudinary.com/dhoho4qse/image/upload/v1785806002/burguer-junior_vraifu.jpg",
    "Andy's Junior",
    "hamburguesa-andys-junior-san-ramon",
    969,
    956,
  ),
  chickenGuacamole: createBurgerImage(
    "https://res.cloudinary.com/dhoho4qse/image/upload/v1785806001/burguer-guacamole-chicken_xavyhu.png",
    "Chicken Guacamole",
    "hamburguesa-chicken-guacamole-andys-burger-san-ramon",
    959,
    972,
  ),
  cheddarLab: createBurgerImage(
    "https://res.cloudinary.com/dhoho4qse/image/upload/v1785805996/burguer-cheddar_fv7tsr.png",
    "Cheddar Lab",
    "hamburguesa-cheddar-lab-andys-burger-san-ramon",
    985,
    1051,
  ),
  tropicalBite: createBurgerImage(
    "https://res.cloudinary.com/dhoho4qse/image/upload/v1785805995/burguer-tropical_cpibfk.png",
    "Tropical Bite",
    "hamburguesa-tropical-bite-andys-burger-san-ramon",
    1024,
    1007,
  ),
  honeyBacon: createBurgerImage(
    "https://res.cloudinary.com/dhoho4qse/image/upload/v1785805994/burguer-honey_ccdaax.png",
    "Honey Bacon",
    "hamburguesa-honey-bacon-andys-burger-san-ramon",
    983,
    1034,
  ),
  spicyBacon: createBurgerImage(
    "https://res.cloudinary.com/dhoho4qse/image/upload/v1785805993/burguer-spicy_cpqeya.png",
    "Spicy Bacon",
    "hamburguesa-spicy-bacon-andys-burger-san-ramon",
    1024,
    1089,
  ),
} as const satisfies Record<string, SiteImage>;
