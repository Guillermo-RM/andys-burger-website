export const whatsappNumber = "50686510588";
export const whatsappGreeting = "Hola, Andy's Burger!";

export function createWhatsAppUrl(message: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const whatsappGreetingUrl = createWhatsAppUrl(whatsappGreeting);
