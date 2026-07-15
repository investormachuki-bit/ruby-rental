"use client";

import PaymentCard from "./PaymentCard";

type Payment = {
  lease_id: string;

  property_id: string;

  unit_id: string;

  occupant_id: string;

  lease_number: string;

  property_name: string;

  unit_number: string;

  occupant_name: string;

  monthly_rent: number;

  amount_paid: number;

  balance: number;

  due_day: number;

  payment_status: string;
};

type Props = {
  payments: Payment[];
};

export default function PaymentsList({
  payments,
}: Props) {

  return (

    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

      {payments.map((payment) => (

        <PaymentCard
          key={payment.lease_id}
          payment={payment}
        />

      ))}

    </div>

  );

}
