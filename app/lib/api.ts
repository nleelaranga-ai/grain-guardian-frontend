import axios from "axios";

const API =
  "https://grain-guardian-backend.onrender.com";

export const runAnalysis = (
  payload: any
) =>
  axios.post(
    `${API}/api/v3/analyze`,
    payload
  );

export const fetchHistory = () =>
  axios.get(`${API}/history`);

export const saveReport = (
  report: any
) =>
  axios.post(
    `${API}/reports`,
    report
  );