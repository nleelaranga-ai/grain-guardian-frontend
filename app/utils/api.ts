import axios from 'axios';

// Replace this URL with your actual live Render link
const BACKEND_URL = 'https://grain-guardian-backend.onrender.com';

export const apiClient = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface TelemetryData {
  user_id: string;
  crop_type: string;
  moisture: float;
  temperature: float;
  humidity: float;
  stored_mass_kg: number;
}

export interface AnalysisResponse {
  record_id: string;
  grain_health_index: number;
  fungal_risk_status: string;
  estimated_financial_loss_inr: number;
  saved_to_cloud: boolean;
}

// Function to send fresh sensor data to the backend analytical engine
export const analyzeSensorData = async (data: TelemetryData): Promise<AnalysisResponse> => {
  try {
    const response = await apiClient.post<AnalysisResponse>('/api/v1/analyze', data);
    return response.data;
  } catch (error) {
    console.error("API Processing Error:", error);
    throw error;
  }
};