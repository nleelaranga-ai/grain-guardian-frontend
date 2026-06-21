export interface ClpMatrix {
  clp_moisture_violation: boolean;
  clp_temp_violation: boolean;
  clp_humidity_violation: boolean;
  clp_duration_violation: boolean;
  clp_fungal_violation: boolean;
}

export interface AnalysisResponse {
  grain_health_index: number;
  fungal_risk_status: string;
  estimated_financial_loss_inr: number;
  projected_weight_loss_kg: number;
  biological_activity_index: number;
  clp_matrix: ClpMatrix;
  action_advisory: string[];
}
