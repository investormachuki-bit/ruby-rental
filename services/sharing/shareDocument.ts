export type ShareDocumentInput = {
  blob: Blob;
  fileName: string;
  title: string;
  message: string;
  phone?: string | null;
  email?: string | null;
};

function normalizePhone(phone?: string | null) {
  if (!phone) return "";

  let value = phone.replace(/\D/g, "");

  if (value.startsWith("0")) {
    value = `254${value.slice(1)}`;
  }

  if (!value.startsWith("254")) {
    value = `254${value}`;
  }

  return value;
}

export async function shareDocument({
  blob,
  fileName,
  title,
  message,
  phone,
  email,
}: ShareDocumentInput) {
  const file = new File([blob], fileName, {
    type: "application/pdf",
  });

  /*
   * Preferred:
   * Android/iPhone/browser native share sheet.
   *
   * This allows the PDF to be attached together with
   * the message when the target application supports it.
   */
  if (
    typeof navigator !== "undefined" &&
    navigator.share &&
    navigator.canShare?.({ files: [file] })
  ) {
    await navigator.share({
      title,
      text: message,
      files: [file],
    });

    return;
  }

  /*
   * Fallback: download the PDF.
   */
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);

  /*
   * Then open WhatsApp with the message.
   */
  const normalizedPhone = normalizePhone(phone);

  if (normalizedPhone) {
    const whatsappUrl =
      `https://wa.me/${normalizedPhone}` +
      `?text=${encodeURIComponent(message)}`;

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );

    return;
  }

  /*
   * Or open email if no WhatsApp number exists.
   */
  if (email) {
    const mailto =
      `mailto:${email}` +
      `?subject=${encodeURIComponent(title)}` +
      `&body=${encodeURIComponent(message)}`;

    window.location.href = mailto;
  }
}
