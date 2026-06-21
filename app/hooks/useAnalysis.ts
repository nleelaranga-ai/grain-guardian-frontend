"use client";

import { computeDecisionMatrix } from "../lib/calculations";

export function useAnalysis(data: any) {
  return computeDecisionMatrix(data);
}