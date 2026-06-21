"use client";

import { useState } from "react";

export function useTelemetry() {
  const [tempT3, setTempT3] = useState(34.8);
  const [humidity, setHumidity] = useState(64.5);
  const [moisture] = useState(13.8);

  const [cropIndex] = useState(0);
  const [massKg] = useState(12000);
  const [storageDays] = useState(45);

  return {
    tempT3,
    humidity,
    moisture,
    cropIndex,
    massKg,
    storageDays,
    setTempT3,
    setHumidity,
  };
}
