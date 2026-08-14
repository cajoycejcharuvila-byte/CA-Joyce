/**
 * Builds a URL for WhatsApp with an optional pre-filled message.
 * @param phone The target phone number (will be stripped of non-numeric characters automatically).
 * @param message The optional contextual message to pre-fill.
 * @returns The fully formatted wa.me URL.
 */
export function buildWhatsAppUrl(phone: string, message?: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  
  if (!message) {
    return `https://wa.me/${cleanPhone}`;
  }
  
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
