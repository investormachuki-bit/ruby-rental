import { supabase } from "@/lib/supabase";

export type SubscriptionPaymentStatus =
  | "Pending"
  | "Verified"
  | "Rejected"
  | "Cancelled";

export type SubscriptionPaymentRequest = {
  id: string;
  workspace_id: string;
  subscription_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  transaction_reference: string | null;
  status: SubscriptionPaymentStatus;
  submitted_at: string;
  verified_at: string | null;
  verified_by: string | null;
  rejection_reason: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type SubmitSubscriptionPaymentInput = {
  subscriptionId: string;
  amount: number;
  currency?: string;
  transactionReference: string;
  notes?: string;
};

/**
 * Submit a manual subscription payment.
 *
 * This does NOT activate the subscription.
 * It only creates a Pending verification request.
 */
export async function submitSubscriptionPayment(
  input: SubmitSubscriptionPaymentInput
): Promise<{
  data: SubscriptionPaymentRequest | null;
  error: string | null;
}> {
  if (!input.subscriptionId) {
    return {
      data: null,
      error: "Subscription is required.",
    };
  }

  if (
    !Number.isFinite(input.amount) ||
    input.amount <= 0
  ) {
    return {
      data: null,
      error: "Invalid payment amount.",
    };
  }

  const transactionReference =
    input.transactionReference
      .trim()
      .toUpperCase();

  if (!transactionReference) {
    return {
      data: null,
      error:
        "Enter your M-Pesa transaction reference.",
    };
  }

  /*
   * Get the authenticated customer's
   * workspace through their profile.
   */
  const {
    data: {
      user,
    },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      data: null,
      error:
        "Your session has expired. Please log in again.",
    };
  }

  const { data: profile, error: profileError } =
    await supabase
      .from("profiles")
      .select("workspace_id")
      .eq("id", user.id)
      .single();

  if (profileError || !profile?.workspace_id) {
    return {
      data: null,
      error:
        "Your workspace could not be found.",
    };
  }

  /*
   * Confirm that the subscription belongs
   * to the authenticated customer's workspace.
   */
  const {
    data: subscription,
    error: subscriptionError,
  } = await supabase
    .from("subscriptions")
    .select(`
      id,
      workspace_id,
      monthly_amount,
      currency,
      status
    `)
    .eq("id", input.subscriptionId)
    .eq(
      "workspace_id",
      profile.workspace_id
    )
    .single();

  if (
    subscriptionError ||
    !subscription
  ) {
    return {
      data: null,
      error:
        "The subscription could not be found.",
    };
  }

  /*
   * Don't allow payment submission against
   * a cancelled subscription.
   */
  if (
    subscription.status ===
    "Cancelled"
  ) {
    return {
      data: null,
      error:
        "This subscription has been cancelled.",
    };
  }

  /*
   * Check whether there is already a
   * pending payment request.
   *
   * We deliberately allow only one pending
   * request per subscription.
   */
  const {
    data: existingPayment,
    error: existingPaymentError,
  } = await supabase
    .from(
      "subscription_payment_requests"
    )
    .select("*")
    .eq(
      "subscription_id",
      subscription.id
    )
    .eq("status", "Pending")
    .maybeSingle();

  if (existingPaymentError) {
    return {
      data: null,
      error:
        existingPaymentError.message,
    };
  }

  if (existingPayment) {
    return {
      data: existingPayment as SubscriptionPaymentRequest,
      error:
        "A payment is already awaiting verification.",
    };
  }

  /*
   * Use the subscription's stored monthly
   * amount as the authoritative amount.
   *
   * We do NOT trust an amount supplied by
   * the browser.
   */
  const authoritativeAmount = Number(
    subscription.monthly_amount
  );

  const { data, error } =
    await supabase
      .from(
        "subscription_payment_requests"
      )
      .insert({
        workspace_id:
          profile.workspace_id,

        subscription_id:
          subscription.id,

        amount:
          authoritativeAmount,

        currency:
          subscription.currency ||
          input.currency ||
          "KES",

        payment_method: "M-Pesa",

        transaction_reference:
          transactionReference,

        status: "Pending",

        notes:
          input.notes?.trim() || null,
      })
      .select("*")
      .single();

  if (error) {
    console.error(
      "Failed to submit subscription payment:",
      error
    );

    return {
      data: null,
      error: error.message,
    };
  }

  return {
    data:
      data as SubscriptionPaymentRequest,
    error: null,
  };
}


/**
 * Get the customer's latest payment
 * request for a subscription.
 */
export async function getSubscriptionPaymentRequest(
  subscriptionId: string
): Promise<{
  data: SubscriptionPaymentRequest | null;
  error: string | null;
}> {
  if (!subscriptionId) {
    return {
      data: null,
      error: "Subscription is required.",
    };
  }

  const { data, error } =
    await supabase
      .from(
        "subscription_payment_requests"
      )
      .select("*")
      .eq(
        "subscription_id",
        subscriptionId
      )
      .order("created_at", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

  if (error) {
    return {
      data: null,
      error: error.message,
    };
  }

  return {
    data:
      data as SubscriptionPaymentRequest | null,
    error: null,
  };
}


/**
 * Check whether a subscription currently
 * has a payment awaiting verification.
 */
export async function hasPendingSubscriptionPayment(
  subscriptionId: string
): Promise<{
  data: boolean;
  error: string | null;
}> {
  if (!subscriptionId) {
    return {
      data: false,
      error: "Subscription is required.",
    };
  }

  const { data, error } =
    await supabase
      .from(
        "subscription_payment_requests"
      )
      .select("id")
      .eq(
        "subscription_id",
        subscriptionId
      )
      .eq("status", "Pending")
      .maybeSingle();

  if (error) {
    return {
      data: false,
      error: error.message,
    };
  }

  return {
    data: Boolean(data),
    error: null,
  };
}


/**
 * Get pending subscription payments.
 *
 * Platform Admin will use this when we
 * build the payment verification screen.
 */
export async function getPendingSubscriptionPayments(): Promise<{
  data: SubscriptionPaymentRequest[];
  error: string | null;
}> {
  const { data, error } =
    await supabase
      .from(
        "subscription_payment_requests"
      )
      .select("*")
      .eq("status", "Pending")
      .order("submitted_at", {
        ascending: false,
      });

  if (error) {
    return {
      data: [],
      error: error.message,
    };
  }

  return {
    data:
      (data ??
        []) as SubscriptionPaymentRequest[],
    error: null,
  };
}


/**
 * Count payments awaiting verification.
 *
 * This will power the Admin notification
 * badge later.
 */
export async function getPendingSubscriptionPaymentCount(): Promise<{
  data: number;
  error: string | null;
}> {
  const { count, error } =
    await supabase
      .from(
        "subscription_payment_requests"
      )
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("status", "Pending");

  if (error) {
    return {
      data: 0,
      error: error.message,
    };
  }

  return {
    data: count ?? 0,
    error: null,
  };
}


/**
 * Admin verification.
 *
 * IMPORTANT:
 * This function will only work once the
 * Platform Admin RLS policy is added.
 *
 * We will connect the actual activation
 * transaction in the next admin step.
 */
export async function verifySubscriptionPayment(
  paymentRequestId: string
): Promise<{
  data: SubscriptionPaymentRequest | null;
  error: string | null;
}> {
  if (!paymentRequestId) {
    return {
      data: null,
      error:
        "Payment request is required.",
    };
  }

  const {
    data: {
      user,
    },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      data: null,
      error:
        "Your session has expired. Please log in again.",
    };
  }

  const { data, error } =
    await supabase
      .from(
        "subscription_payment_requests"
      )
      .update({
        status: "Verified",
        verified_by: user.id,
        verified_at: new Date().toISOString(),
      })
      .eq("id", paymentRequestId)
      .eq("status", "Pending")
      .select("*")
      .single();

  if (error) {
    return {
      data: null,
      error: error.message,
    };
  }

  return {
    data:
      data as SubscriptionPaymentRequest,
    error: null,
  };
}


/**
 * Reject a subscription payment.
 */
export async function rejectSubscriptionPayment(
  paymentRequestId: string,
  reason: string
): Promise<{
  data: SubscriptionPaymentRequest | null;
  error: string | null;
}> {
  if (!paymentRequestId) {
    return {
      data: null,
      error:
        "Payment request is required.",
    };
  }

  const rejectionReason =
    reason.trim();

  if (!rejectionReason) {
    return {
      data: null,
      error:
        "Enter a reason for rejecting the payment.",
    };
  }

  const {
    data: {
      user,
    },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      data: null,
      error:
        "Your session has expired. Please log in again.",
    };
  }

  const { data, error } =
    await supabase
      .from(
        "subscription_payment_requests"
      )
      .update({
        status: "Rejected",
        verified_by: user.id,
        verified_at: new Date().toISOString(),
        rejection_reason:
          rejectionReason,
      })
      .eq("id", paymentRequestId)
      .eq("status", "Pending")
      .select("*")
      .single();

  if (error) {
    return {
      data: null,
      error: error.message,
    };
  }

  return {
    data:
      data as SubscriptionPaymentRequest,
    error: null,
  };
}