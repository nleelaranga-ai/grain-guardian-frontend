"use client";

import { useState } from "react";

export function useBLE() {
  const [device, setDevice] =
    useState<BluetoothDevice | null>(null);

  const [connected, setConnected] =
    useState(false);

  async function scan() {
    try {
      const bluetoothDevice =
        await navigator.bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: [
            "battery_service",
          ],
        });

      setDevice(bluetoothDevice);
    } catch (error) {
      console.error(error);
    }
  }

  async function connect() {
    if (!device) return;

    try {
      await device.gatt?.connect();
      setConnected(true);
    } catch (error) {
      console.error(error);
    }
  }

  async function disconnect() {
    device?.gatt?.disconnect();
    setConnected(false);
  }

  return {
    device,
    connected,
    scan,
    connect,
    disconnect,
  };
}
