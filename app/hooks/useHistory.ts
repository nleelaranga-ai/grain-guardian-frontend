"use client";

import { useState } from "react";

export function useHistory() {
  const [history] = useState([]);

  return {
    history,
  };
}