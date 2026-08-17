"use client";

import { useEffect, useRef, useState } from "react";

const googleMapsUrl =
  "https://www.google.com/maps/place/Andy's+Burger/data=!4m2!3m1!1s0x0:0xcace868bb64699d6?sa=X&ved=1t:2428&ictx=111";
const googleReviewUrl = "https://g.page/r/CdaZRraLhs7KEBM/review";
const relativeDateFormatter = new Intl.RelativeTimeFormat("es-CR", {
  numeric: "auto",
});

const costaRicaDateFormatter = new Intl.DateTimeFormat("es-CR", {
  timeZone: "America/Costa_Rica",
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

const getCostaRicaCalendarDay = (timestamp: number) => {
  const parts = costaRicaDateFormatter.formatToParts(timestamp);
  const getPart = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);

  return Date.UTC(getPart("year"), getPart("month") - 1, getPart("day"));
};

const getPublishedCalendarDay = (publishedOn: string) => {
  const [year, month, day] = publishedOn.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
};

const formatReviewAge = (publishedOn: string, now: number) => {
  if (publishedOn.includes("T")) {
    const elapsedMilliseconds = Math.max(0, now - Date.parse(publishedOn));
    const elapsedHours = Math.floor(elapsedMilliseconds / 3_600_000);

    if (elapsedHours < 24) {
      return relativeDateFormatter.format(-Math.max(1, elapsedHours), "hour");
    }

    const elapsedDays = Math.floor(elapsedMilliseconds / 86_400_000);

    if (elapsedDays < 7) {
      return relativeDateFormatter.format(-elapsedDays, "day");
    }

    if (elapsedDays < 30) {
      return relativeDateFormatter.format(-Math.floor(elapsedDays / 7), "week");
    }

    if (elapsedDays < 365) {
      return relativeDateFormatter.format(-Math.floor(elapsedDays / 30), "month");
    }

    return relativeDateFormatter.format(-Math.floor(elapsedDays / 365), "year");
  }

  const elapsedDays = Math.max(
    0,
    Math.floor(
      (getCostaRicaCalendarDay(now) - getPublishedCalendarDay(publishedOn)) /
        86_400_000,
    ),
  );

  if (elapsedDays < 7) {
    return relativeDateFormatter.format(-elapsedDays, "day");
  }

  if (elapsedDays < 30) {
    return relativeDateFormatter.format(-Math.floor(elapsedDays / 7), "week");
  }

  if (elapsedDays < 365) {
    return relativeDateFormatter.format(-Math.floor(elapsedDays / 30), "month");
  }

  return relativeDateFormatter.format(-Math.floor(elapsedDays / 365), "year");
};
const reviews = [
  {
    author: "Henry S.",
    publishedOn: "2026-08-16T19:43:00-06:00",
    text: "Probamos la Andys Burger y la Spicy Bacon y están muy buenas",
  },
  {
    author: "Jenny HIdalgo",
    publishedOn: "2026-08-15",
    text: "Muy recomendado, excelente presentación, entrega y la comida exquisita",
  },
  {
    author: "Kony Alvarado Ulloa",
    publishedOn: "2026-08-14",
    text: null,
  },
  {
    author: "Esteban Recio",
    publishedOn: "2026-08-11",
    text: "¡Las mejores hamburguesas de San Ramón!",
  },
  {
    author: "Estefanie Garcia",
    publishedOn: "2026-08-10",
    text: null,
  },
  {
    author: "Cristina Fernandez",
    publishedOn: "2026-08-10",
    text: null,
  },
  {
    author: "María José Salas",
    publishedOn: "2026-08-10",
    text: null,
  },
  {
    author: "Ronny Ugalde",
    publishedOn: "2026-08-10",
    text: "Las mejores hamburguesas 🤤",
  },
  {
    author: "alondra matamoros",
    publishedOn: "2026-08-10",
    text: "Muy buen servicio, bastante calidad y buen sabor",
  },
  {
    author: "Karina Fernández Moya",
    publishedOn: "2026-08-03",
    text: "Las hamburguesas son deliciosas, se nota la calidad y el sabor artesanal en cada una. Además, el servicio al cliente es excelente, recomendadas 100%, las mejores de San Ramón sin duda 💯",
  },
  {
    author: "Tata Campos",
    publishedOn: "2026-08-03",
    text: "Exelentes hamburguesas, demasiado ricas 👌🏻",
  },
  {
    author: "AllanDV_",
    publishedOn: "2026-08-04T16:10:00-06:00",
    text: "Las mejores hamburguesas de occidente, no hay como esas! Recomendadas 100% a ojos cerrados en todo aspecto",
  },
  {
    author: "Guillermo Rojas",
    publishedOn: "2026-08-01",
    text: "Es demasiado bueno🔥",
  },
  {
    author: "Kevin Andres Arroyo Sanchez",
    publishedOn: "2026-08-01",
    text: null,
  },
  {
    author: "Alejandro Chaves Apu",
    publishedOn: "2026-07-31",
    text: "Las mejores hamburguesas de occidente sin duda! El servicio es rápido y atento y ni que decir de las hamburguesas y me faltan varias por probar porque tienen variedad ! Las recomiendo full!",
  },
  {
    author: "Jose Arroyo",
    publishedOn: "2026-07-31",
    text: "Van ganando esas hamburguesas 🍔🔥",
  },
  {
    author: "Katherine Méndez Rojas",
    publishedOn: "2026-07-31",
    text: null,
  },
  {
    author: "Yoryaa Calderon",
    publishedOn: "2026-07-28",
    text: "Excelente servicio, la comida espectacular las hamburguesas son las mejores de San Ramón son súper grandes, recomendadisimo 20/10✨",
  },
] as const;

export function GoogleReviewsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 3_600_000);
    return () => window.clearInterval(timer);
  }, []);

  const moveCarousel = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;

    track.scrollBy({
      left: direction * Math.max(track.clientWidth * 0.78, 280),
      behavior: "smooth",
    });
  };

  return (
    <section className="google-reviews" aria-labelledby="google-reviews-title">
      <div className="google-reviews__heading">
        <div>
          <p>Opiniones reales en Google</p>
          <h2 id="google-reviews-title">
            Reseñas de Andy&apos;s Burger en San Ramón
          </h2>
          <span>
            Conocé la experiencia de quienes ya probaron nuestras hamburguesas
            en San Ramón.
          </span>
        </div>

        <div className="google-reviews__rating" aria-label="5 de 5 estrellas">
          <strong>5.0</strong>
          <span aria-hidden="true">★★★★★</span>
          <small>{reviews.length} reseñas en Google</small>
        </div>
      </div>

      <div className="google-reviews__controls" aria-label="Controles de reseñas">
        <button
          type="button"
          aria-label="Ver reseñas anteriores"
          onClick={() => moveCarousel(-1)}
        >
          ←
        </button>
        <button
          type="button"
          aria-label="Ver reseñas siguientes"
          onClick={() => moveCarousel(1)}
        >
          →
        </button>
      </div>

      <div
        className="google-reviews__track"
        ref={trackRef}
        role="region"
        aria-label="Pasarela de reseñas de Google"
      >
        {reviews.map((review) => (
          <article className="google-review" key={review.author}>
            <div className="google-review__stars" aria-label="5 de 5 estrellas">
              <span aria-hidden="true">★★★★★</span>
              <time dateTime={review.publishedOn} suppressHydrationWarning>
                {formatReviewAge(review.publishedOn, now)}
              </time>
            </div>
            {review.text ? (
              <blockquote cite={googleMapsUrl}>
                <p>{review.text}</p>
              </blockquote>
            ) : (
              <p className="google-review__without-comment">
                Calificación de 5 estrellas sin comentario escrito.
              </p>
            )}
            <div className="google-review__footer">
              <cite>{review.author}</cite>
            </div>
          </article>
        ))}
      </div>

      <div className="google-reviews__actions">
        <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
          Ver reseñas en Google
        </a>
        <a
          className="google-reviews__action--accent"
          href={googleReviewUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Dejar una reseña
        </a>
      </div>
    </section>
  );
}
