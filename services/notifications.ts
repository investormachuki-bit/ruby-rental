import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";

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

async function saveNotification(
  request: NotificationRequest
) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return null;

  const profile = await getProfile(session.user.id);

  if (!profile) return null;

  const { data, error } = await supabase
    .from("notification_logs")
    .insert({
      workspace_id: profile.workspace_id,
      recipient: request.recipient,
      channel: request.channel,
      subject: request.subject,
      message: request.message,
      status: "Pending",
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

async function updateNotificationStatus(
  id: string,
  status: string,
  provider?: string,
  reference?: string
) {
  await supabase
    .from("notification_logs")
    .update({
      status,
      provider,
      provider_reference: reference,
      delivered_at:
        status === "Delivered"
          ? new Date().toISOString()
          : null,
    })
    .eq("id", id);
}

async function sendEmail(
  request: NotificationRequest
) {
  return {
    provider: "stub",
    reference: crypto.randomUUID(),
  };
}

async function sendSMS(
  request: NotificationRequest
) {
  return {
    provider: "stub",
    reference: crypto.randomUUID(),
  };
}

async function sendWhatsapp(
  request: NotificationRequest
) {
  return {
    provider: "stub",
    reference: crypto.randomUUID(),
  };
}

async function sendPush(
  request: NotificationRequest
) {
  return {
    provider: "stub",
    reference: crypto.randomUUID(),
  };
}

export async function sendNotification(
  request: NotificationRequest
) {
  const log =
    await saveNotification(request);

  if (!log) {
    throw new Error(
      "Unable to save notification."
    );
  }

  try {
    let result;

    switch (request.channel) {
      case "email":
        result = await sendEmail(request);
        break;

      case "sms":
        result = await sendSMS(request);
        break;

      case "whatsapp":
        result = await sendWhatsapp(request);
        break;

      case "push":
        result = await sendPush(request);
        break;

      default:
        throw new Error(
          "Unsupported notification channel."
        );
    }

    await updateNotificationStatus(
      log.id,
      "Delivered",
      result.provider,
      result.reference
    );

    return result;

  } catch (error) {

    await updateNotificationStatus(
      log.id,
      "Failed"
    );

    throw error;

  }
}
