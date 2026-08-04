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
          <small>6 reseñas en Google</small>
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
