import React from 'react';

export default function VolumeSelector({ selectedVolume, onVolumeChange, availableVolumes = [] }) {
  // If no available volumes, provide defaults
  const volumes = availableVolumes.length > 0 ? availableVolumes : ['1', '2'];

  return (
    <div className="flex items-center gap-2">
      <label className="text-[#00d2ff] font-semibold">Volume:</label>
      <select
        value={selectedVolume}
        onChange={(e) => onVolumeChange(e.target.value)}
        className="px-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[#2aa8d8] rounded-none text-[#9fe3ff] focus:outline-none focus:border-[#00d2ff] focus:bg-[rgba(0,210,255,0.1)]"
      >
        {volumes.map(vol => (
          <option key={vol} value={vol}>
            Volume {vol}
          </option>
        ))}
      </select>
    </div>
  );
}
