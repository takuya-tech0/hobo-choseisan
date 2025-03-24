// app/components/AppContent.tsx
'use client'

import { useAuth } from './AuthProvider';
import UserSearch from './UserSearch';
import Calendar from './Calendar';
import MeetingDuration from './MeetingDuration';
// 明示的にデフォルトインポートで記述
import SearchContent from './SearchContent';
import { useState } from 'react';

export default function AppContent() {
  const { account } = useAuth();
  const [meetingDuration, setMeetingDuration] = useState('1時間');

  if (!account) {
    return null; // ログインしていない場合は何も表示しない
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <header className="border-b pb-4 mb-6">
        <h1 className="text-3xl font-bold">ほぼ調整さん</h1>
        <p className="text-gray-600">ようこそ、{account.name || account.username}さん</p>
      </header>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* 左サイドバー（幅30%） */}
        <div className="md:w-[30%] space-y-6">
          <Calendar />
          <MeetingDuration onChange={setMeetingDuration} />
          <UserSearch />
        </div>
        
        {/* メインコンテンツ（幅70%） */}
        <div className="md:w-[70%]">
          <SearchContent />
        </div>
      </div>
    </div>
  );
}