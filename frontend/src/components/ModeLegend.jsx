// src/components/ModeLegend.jsx
import React from "react";
import { MODE_COLOR } from "../lib/modes";

export default function ModeLegend({ className = "" }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {Object.entries(MODE_COLOR).map(([mode, color]) => (
        <div key={mode} className="flex items-center gap-2 text-sm">
          <span style={{ background: color }} className="w-3 h-3 rounded-sm inline-block" />
          <span className="text-gray-600">{mode}</span>
        </div>
      ))}
    </div>
  );
}
