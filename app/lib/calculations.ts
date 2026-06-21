import { CROPS } from "./constants";

export function calculateEMC(
  moisture: number,
  humidity: number
) {
  return moisture + humidity / 10;
}

export function calculateFungalActivityIndex(
  moisture: number,
  temperature: number,
  safeLimit: number
) {
  return (
    ((moisture / safeLimit) ** 2) *
    (temperature / 28)
  );
}

export function computeDecisionMatrix(
  data: any
) {
  const crop = CROPS[data.cropIndex];

  const bai =
    calculateFungalActivityIndex(
      data.moisture,
      data.temperature,
      crop.safeLimit
    );

  const risk =
    bai > 1.3
      ? "HIGH"
      : bai > 1.05
      ? "MEDIUM"
      : "LOW";

  return {
    score: 85,
    lossInr: 5000,
    risk,
    warnings: [],
    clps: []
  };
}