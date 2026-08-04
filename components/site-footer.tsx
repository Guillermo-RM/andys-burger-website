import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { SocialIcon } from "@/components/social-icon";

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
