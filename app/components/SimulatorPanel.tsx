interface Props {
  telemetry: any;
}

export default function SimulatorPanel({
  telemetry,
}: Props) {
  return (
    <div className="bg-slate-900 rounded-2xl p-6">

      <h2 className="font-bold text-lg">
        Probe Telemetry Sandbox
      </h2>

      <div className="mt-6 space-y-6">

        <div>
          <p>T3 Temperature</p>

          <input
            type="range"
            min="15"
            max="55"
            value={telemetry.tempT3}
            onChange={(e) =>
              telemetry.setTempT3(
                Number(e.target.value)
              )
            }
            className="w-full"
          />
        </div>

        <div>
          <p>Humidity</p>

          <input
            type="range"
            min="20"
            max="95"
            value={telemetry.humidity}
            onChange={(e) =>
              telemetry.setHumidity(
                Number(e.target.value)
              )
            }
            className="w-full"
          />
        </div>

      </div>
    </div>
  );
}