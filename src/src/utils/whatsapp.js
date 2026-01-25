const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

export function sendWhatsAppOrder({
  name,
  phone,
  pickupAddress,
  items,
  total,
  slot
}) {
  const message = `
Nouvelle demande de repassage 👕🔥

Nom : ${name}
Téléphone : ${phone}

Adresse de collecte :
${pickupAddress}

Commande :
${items}

Total estimé : ${total} ₪
Créneau souhaité : ${slot}

📍 Dépôt / retour :
Hatikva 11, Ramat Gan
`;

  const url =
    "https://wa.me/" +
    WHATSAPP_NUMBER +
    "?text=" +
    encodeURIComponent(message);

  window.open(url, "_blank");
}
