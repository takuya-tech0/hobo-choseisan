// app/components/SearchContent.tsx
'use client'

import { useState } from 'react';
import ScheduleTable from './ScheduleTable';

export default function SearchContent() {
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = () => {
    setIsSearching(true);
    setShowResults(false);
    
    // 3秒後に検索完了とする
    setTimeout(() => {
      setIsSearching(false);
      setShowResults(true);
    }, 3000);
  };

  return (
    <div className="h-full">
      {!showResults && (
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center h-64">
          {isSearching ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p>検索中...</p>
            </div>
          ) : (
            <button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md text-lg font-medium transition-colors"
            >
              予定を検索する
            </button>
          )}
        </div>
      )}

      {showResults && <ScheduleTable />}
    </div>
  );
}