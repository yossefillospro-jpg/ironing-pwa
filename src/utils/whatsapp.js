const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

export function sendWhatsAppOrder({ 
  name, 
  phone, 
  pickupAddress, 
  floor,
  apartment,
  items, 
  total, 
  slot, 
  language = "he" 
}) {

  const orderLine = Array.isArray(items)
    ? items
        .map((item) => {
          const label =
            language === "he"
              ? (item.nameHe || item.nameFr || item.productId)
              : (item.nameFr || item.nameHe || item.productId);

          return `${label} x${item.quantity}`;
        })
        .join(", ")
    : String(items || "");

  const message =
`🧺 Nouvelle demande de repassage

Nom : ${name}
Téléphone : ${phone}

Adresse de collecte :
${pickupAddress}
Étage : ${floor || "-"}
Appartement : ${apartment || "-"}

Commande :
${orderLine}

Total estimé : ${total} ₪
Créneau souhaité : ${slot}

📍 Dépôt / retour :
Hatikva 11, Ramat Gan

✅ Confirmation : la commande est validée uniquement après accord par WhatsApp.`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}
