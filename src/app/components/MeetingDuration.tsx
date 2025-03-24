// app/components/MeetingDuration.tsx
'use client'

import { useState } from 'react';

interface MeetingDurationProps {
  onChange?: (duration: string) => void;
}

export default function MeetingDuration({ onChange }: MeetingDurationProps) {
  const [duration, setDuration] = useState('30分');
  const durations = ['30分', '1時間', '1時間30分', '2時間', '2時間30分', '3時間'];

  const handleDurationChange = (newDuration: string) => {
    setDuration(newDuration);
    if (onChange) {
      onChange(newDuration);
    }
  };

  return (
    <div className="meeting-duration-container space-y-2">
      <div className="text-lg font-medium border border-gray-300 py-2 px-4 rounded-md text-center bg-gray-100">
        会議時間
      </div>
      <div className="border border-gray-300 py-2 px-4 rounded-md flex justify-center items-center cursor-pointer hover:bg-gray-50">
        <select 
          value={duration}
          onChange={(e) => handleDurationChange(e.target.value)}
          className="w-full text-center appearance-none bg-transparent outline-none cursor-pointer"
        >
          {durations.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}