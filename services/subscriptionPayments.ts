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

  /*
   * Kept for future use.
   *
   * The customer is currently NOT asked
   * to provide an M-Pesa transaction code.
   */
  transaction_reference: string | null;

  /*
   * Current payment evidence submitted
   * by the customer.
   */
  bank_confirmation_message: string | null;

  status: SubscriptionPaymentStatus;

  submitted_at: string;

  verified_at: string | null;

  verified_by: string | null;

  rejection_reason: string | null;

  notes: string | null;

  created_at: string;

  updated_at: string;
};


/* =========================================================
   SUBMIT PAYMENT INPUT
========================================================= */

export type SubmitSubscriptionPaymentInput = {
  subscriptionId: string;

  amount: number;

  currency?: string;

  /*
   * Optional now.
   *
   * Kept in the service because we may use
   * the M-Pesa transaction code later.
   */
  transactionReference?: string;

  /*
   * Current required payment evidence.
   */
  bankConfirmationMessage: string;

  notes?: string;
};


/* =========================================================
   SUBMIT MANUAL SUBSCRIPTION PAYMENT
========================================================= */

/**
 * Submit a manual subscription payment.
 *
 * IMPORTANT:
 *
 * This function does NOT activate the subscription.
 *
 * It creates a Pending payment verification
 * request for Platform Admin.
 *
 * Current customer flow:
 *
 * 1. Customer makes payment using Paybill.
 * 2. Customer receives I&M Bank confirmation.
 * 3. Customer pastes the I&M Bank message.
 * 4. Customer clicks "I Have Paid".
 * 5. Admin receives the request.
 * 6. Admin verifies the payment.
 * 7. Subscription is activated.
 */
export async function submitSubscriptionPayment(
  input: SubmitSubscriptionPaymentInput
): Promise<{
  data: SubscriptionPaymentRequest | null;
  error: string | null;
}> {

  /* -------------------------------------------------------
     Validate subscription
  ------------------------------------------------------- */

  if (!input.subscriptionId) {
    return {
      data: null,
      error: "Subscription is required.",
    };
  }


  /* -------------------------------------------------------
     Validate amount
  ------------------------------------------------------- */

  if (
    !Number.isFinite(input.amount) ||
    input.amount <= 0
  ) {
    return {
      data: null,
      error: "Invalid payment amount.",
    };
  }


  /* -------------------------------------------------------
     Validate I&M Bank confirmation
  ------------------------------------------------------- */

  const bankConfirmationMessage =
    input.bankConfirmationMessage.trim();

  if (!bankConfirmationMessage) {
    return {
      data: null,
      error:
        "Please provide your I&M Bank payment confirmation message.",
    };
  }


  /* -------------------------------------------------------
     Optional transaction reference
     -------------------------------------------------------
     
     We keep this available for future use,
     but it is NOT required in the current flow.
  ------------------------------------------------------- */

  const transactionReference =
    input.transactionReference?.trim()
      ? input.transactionReference
          .trim()
          .toUpperCase()
      : null;


  /* -------------------------------------------------------
     Get authenticated user
  ------------------------------------------------------- */

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


  /* -------------------------------------------------------
     Get workspace
  ------------------------------------------------------- */

  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from("profiles")
    .select("workspace_id")
    .eq("id", user.id)
    .single();

  if (
    profileError ||
    !profile?.workspace_id
  ) {
    return {
      data: null,
      error:
        "Your workspace could not be found.",
    };
  }


  /* -------------------------------------------------------
     Confirm subscription belongs to workspace
  ------------------------------------------------------- */

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
    .eq(
      "id",
      input.subscriptionId
    )
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


  /* -------------------------------------------------------
     Don't allow cancelled subscriptions
  ------------------------------------------------------- */

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


  /* -------------------------------------------------------
     Check existing pending request
  ------------------------------------------------------- */

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
    .eq(
      "status",
      "Pending"
    )
    .maybeSingle();

  if (existingPaymentError) {
    return {
      data: null,
      error:
        existingPaymentError.message,
    };
  }

  /*
   * Only one payment can wait for
   * verification at a time.
   */
  if (existingPayment) {
    return {
      data:
        existingPayment as SubscriptionPaymentRequest,

      error:
        "A payment is already awaiting verification.",
    };
  }


  /* -------------------------------------------------------
     Use authoritative subscription amount
  ------------------------------------------------------- */

  const authoritativeAmount =
    Number(
      subscription.monthly_amount
    );


  /* -------------------------------------------------------
     Insert payment request
  ------------------------------------------------------- */

  const {
    data,
    error,
  } = await supabase
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

      /*
       * The actual payment is currently
       * made through M-Pesa Paybill.
       */
      payment_method:
        "M-Pesa",

      /*
       * Kept for future use.
       */
      transaction_reference:
        transactionReference,

      /*
       * Current payment evidence.
       */
      bank_confirmation_message:
        bankConfirmationMessage,

      status:
        "Pending",

      notes:
        input.notes?.trim() ||
        null,
    })
    .select("*")
    .single();


  /* -------------------------------------------------------
     Handle insert error
  ------------------------------------------------------- */

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


  /* -------------------------------------------------------
     Success
  ------------------------------------------------------- */

  return {
    data:
      data as SubscriptionPaymentRequest,

    error: null,
  };
}


/* =========================================================
   GET CUSTOMER PAYMENT REQUEST
========================================================= */

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
      error:
        "Subscription is required.",
    };
  }

  const {
    data,
    error,
  } = await supabase
    .from(
      "subscription_payment_requests"
    )
    .select("*")
    .eq(
      "subscription_id",
      subscriptionId
    )
    .order(
      "created_at",
      {
        ascending: false,
      }
    )
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


/* =========================================================
   CHECK PENDING PAYMENT
========================================================= */

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
      error:
        "Subscription is required.",
    };
  }

  const {
    data,
    error,
  } = await supabase
    .from(
      "subscription_payment_requests"
    )
    .select("id")
    .eq(
      "subscription_id",
      subscriptionId
    )
    .eq(
      "status",
      "Pending"
    )
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


/* =========================================================
   GET PENDING ADMIN PAYMENTS
========================================================= */

/**
 * Get all payments awaiting
 * Platform Admin verification.
 */
export async function getPendingSubscriptionPayments(): Promise<{
  data: SubscriptionPaymentRequest[];
  error: string | null;
}> {

  const {
    data,
    error,
  } = await supabase
    .from(
      "subscription_payment_requests"
    )
    .select("*")
    .eq(
      "status",
      "Pending"
    )
    .order(
      "submitted_at",
      {
        ascending: false,
      }
    );

  if (error) {
    return {
      data: [],
      error: error.message,
    };
  }

  return {
    data:
      (data ?? []) as SubscriptionPaymentRequest[],

    error: null,
  };
}


/* =========================================================
   COUNT PENDING PAYMENTS
========================================================= */

/**
 * Count payments awaiting
 * Platform Admin verification.
 */
export async function getPendingSubscriptionPaymentCount(): Promise<{
  data: number;
  error: string | null;
}> {

  const {
    count,
    error,
  } = await supabase
    .from(
      "subscription_payment_requests"
    )
    .select(
      "id",
      {
        count: "exact",
        head: true,
      }
    )
    .eq(
      "status",
      "Pending"
    );

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


/* =========================================================
   VERIFY PAYMENT
========================================================= */

/**
 * Admin verification.
 *
 * NOTE:
 *
 * The actual subscription activation
 * should be handled atomically in the
 * final Admin verification workflow.
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

  const {
    data,
    error,
  } = await supabase
    .from(
      "subscription_payment_requests"
    )
    .update({
      status:
        "Verified",

      verified_by:
        user.id,

      verified_at:
        new Date().toISOString(),
    })
    .eq(
      "id",
      paymentRequestId
    )
    .eq(
      "status",
      "Pending"
    )
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


/* =========================================================
   REJECT PAYMENT
========================================================= */

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

  const {
    data,
    error,
  } = await supabase
    .from(
      "subscription_payment_requests"
    )
    .update({
      status:
        "Rejected",

      verified_by:
        user.id,

      verified_at:
        new Date().toISOString(),

      rejection_reason:
        rejectionReason,
    })
    .eq(
      "id",
      paymentRequestId
    )
    .eq(
      "status",
      "Pending"
    )
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