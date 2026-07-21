export type ConsumptionCalculation = {
  previousReading: number;
  currentReading: number;
  unitsConsumed: number;
  ratePerUnit: number;
  amount: number;
};

type CalculateConsumptionParams = {
  previousReading: number;
  currentReading: number;
  ratePerUnit: number;
};

export function calculateConsumption({
  previousReading,
  currentReading,
  ratePerUnit,
}: CalculateConsumptionParams): ConsumptionCalculation {

  if (previousReading < 0) {
    throw new Error(
      "Previous reading cannot be negative."
    );
  }

  if (currentReading < 0) {
    throw new Error(
      "Current reading cannot be negative."
    );
  }

  if (ratePerUnit < 0) {
    throw new Error(
      "Rate per unit cannot be negative."
    );
  }

  if (currentReading < previousReading) {
    throw new Error(
      "Current reading cannot be less than the previous reading."
    );
  }

  const unitsConsumed =
    currentReading - previousReading;

  const amount =
    unitsConsumed * ratePerUnit;

  return {
    previousReading,
    currentReading,
    unitsConsumed,
    ratePerUnit,
    amount,
  };

}
