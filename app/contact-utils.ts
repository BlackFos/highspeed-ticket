// Contact destinations: keep the phone number in site-config/content/site, not in buttons.
export function smsLink(phone: string, message: string) {
  return `sms:${phone.replace(/[^+0-9]/g, "")}?body=${encodeURIComponent(message)}`;
}
