import { WhatsAppIcon } from "@/components/whatsapp-icon";

const whatsappUrl =
  "https://wa.me/50689742305?text=Hola%2C%20Andy%27s%20Burger!%20Quiero%20realizar%20un%20pedido.";
const googleMapsEmbedUrl =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3927.9191987430827!2d-84.4650583!3d10.1056999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa0450051232683%3A0xcace868bb64699d6!2sAndy's%20Burger!5e0!3m2!1ses!2scr!4v1785863337534!5m2!1ses!2scr";

const openingHours = [
  ["Lunes", "5:00–10:30 p. m."],
  ["Martes", "6:30–10:00 p. m."],
  ["Miércoles a viernes", "5:00–10:30 p. m."],
  ["Sábado y domingo", "12:00–10:30 p. m."],
] as const;

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/andy.sburger/",
    icon: "instagram",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@andy.sburger",
    icon: "tiktok",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/people/Andys-Burger/61567575252356/",
    icon: "facebook",
  },
] as const;

function SocialIcon({ icon }: { icon: (typeof socialLinks)[number]["icon"] }) {
  if (icon === "instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <defs>
          <linearGradient id="instagram-gradient" x1="2" y1="22" x2="22" y2="2">
            <stop offset="0" stopColor="#feda75" />
            <stop offset="0.3" stopColor="#fa7e1e" />
            <stop offset="0.55" stopColor="#d62976" />
            <stop offset="0.78" stopColor="#962fbf" />
            <stop offset="1" stopColor="#4f5bd5" />
          </linearGradient>
        </defs>
        <g
          fill="none"
          stroke="url(#instagram-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />
          <circle cx="12" cy="12" r="3" />
          <path d="M16.5 7.5v.01" />
        </g>
      </svg>
    );
  }

  if (icon === "tiktok") {
    const tiktokPath = "M9 12a4 4 0 1 0 4 4V4c0 3 2 5 5 5";

    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d={tiktokPath}
          fill="none"
          stroke="#25f4ee"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          transform="translate(-0.6 0.4)"
        />
        <path
          d={tiktokPath}
          fill="none"
          stroke="#fe2c55"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          transform="translate(0.6 -0.4)"
        />
        <path
          d={tiktokPath}
          fill="none"
          stroke="#fdfdfd"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 10v4h3v7h4v-7h3l1-4h-4V8a1 1 0 0 1 1-1h3V3h-3a5 5 0 0 0-5 5v2z"
        fill="none"
        stroke="#1877f2"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__primary">
          <section className="site-footer__brand" aria-labelledby="footer-brand">
            <p className="site-footer__eyebrow">Hamburguesas San Ramón</p>
            <h2 id="footer-brand">
              Andy&apos;s <span>Burger</span>
            </h2>
            <p>
              Hamburguesas al grill preparadas al momento para llevar o recibir
              por servicio exprés en San Ramón, Alajuela.
            </p>
            <a
              className="site-footer__order"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon />
              <span>Pedir por WhatsApp</span>
            </a>
          </section>

          <section className="site-footer__column" aria-labelledby="footer-contact">
            <h2 id="footer-contact">Ubicación</h2>
            <a className="site-footer__phone" href="tel:+50686510588">
              +506 8651 0588
            </a>
            <div className="site-footer__map">
              <iframe
                src={googleMapsEmbedUrl}
                title="Ubicación de Andy's Burger en San Juan de San Ramón"
                width="600"
                height="450"
                loading="lazy"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
            <p>Para llevar · Entrega a domicilio</p>
          </section>

          <section className="site-footer__column site-footer__hours" aria-labelledby="footer-hours">
            <h2 id="footer-hours">Horario</h2>
            <dl>
              {openingHours.map(([day, hours]) => (
                <div key={day}>
                  <dt>{day}</dt>
                  <dd>{hours}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <div className="site-footer__bottom">
          <p>© {new Date().getFullYear()} Andy&apos;s Burger. San Ramón, Costa Rica.</p>
          <nav aria-label="Redes sociales de Andy's Burger">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visitar ${social.label} de Andy's Burger`}
                title={social.label}
              >
                <SocialIcon icon={social.icon} />
              </a>
            ))}
          </nav>
        </div>

        <p className="site-footer__credit">
          Desarrollado por{" "}
          <a
            href="https://guimiumtech.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Guimium Tech
          </a>
        </p>
      </div>
    </footer>
  );
}
