export type NotificationChannel =
  | "email"
  | "sms"
  | "whatsapp"
  | "push";

export interface NotificationRequest {
  channel: NotificationChannel;
  recipient: string;
  subject?: string;
  message: string;
}

async function sendEmail(
  request: NotificationRequest
) {
  console.log("Email:", request);

  return {
    success: true,
    channel: "email",
  };
}

async function sendSMS(
  request: NotificationRequest
) {
  console.log("SMS:", request);

  return {
    success: true,
    channel: "sms",
  };
}

async function sendWhatsapp(
  request: NotificationRequest
) {
  console.log("WhatsApp:", request);

  return {
    success: true,
    channel: "whatsapp",
  };
}

async function sendPush(
  request: NotificationRequest
) {
  console.log("Push:", request);

  return {
    success: true,
    channel: "push",
  };
}

export async function sendNotification(
  request: NotificationRequest
) {
  switch (request.channel) {
    case "email":
      return sendEmail(request);

    case "sms":
      return sendSMS(request);

    case "whatsapp":
      return sendWhatsapp(request);

    case "push":
      return sendPush(request);

    default:
      throw new Error("Unsupported notification channel.");
  }
}
