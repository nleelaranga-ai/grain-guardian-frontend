"use client";

import { useHistory } from "../hooks/useHistory";

export default function HistoryTable() {
  const {
    history,
  } = useHistory();

  return (
    <div className="bg-slate-900 rounded-2xl p-6">

      <h2 className="font-bold text-xl mb-6">
        Historic Ledger
      </h2>

      <table className="w-full">

        <thead>
          <tr>
            <th>Date</th>
            <th>Crop</th>
            <th>GHI</th>
            <th>Loss</th>
          </tr>
        </thead>

        <tbody>
          {history.map((item: any) => (
            <tr key={item.id}>
              <td>{item.date}</td>
              <td>{item.crop}</td>
              <td>{item.score}</td>
              <td>₹{item.lossInr}</td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}