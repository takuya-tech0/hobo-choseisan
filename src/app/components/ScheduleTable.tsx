// app/components/ScheduleTable.tsx
'use client'

import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { InteractionRequiredAuthError } from '@azure/msal-browser';

interface TimeSlot {
  date: string;
  time: string;
  availabilities: {
    [email: string]: 'available' | 'unavailable' | 'unknown';
  };
}

interface Attendee {
  email: string;
  displayName?: string;
}

// モーダルの表示状態を管理する型
type ModalState = 
  | { type: 'closed' }
  | { type: 'edit'; date: string; time: string }
  | { type: 'success'; message: string };

export default function ScheduleTable() {
  const { msalInstance, account } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalState, setModalState] = useState<ModalState>({ type: 'closed' });
  
  // 会議詳細フォームの状態
  const [subject, setSubject] = useState('会議のお知らせ');
  const [body, setBody] = useState('会議にご参加ください。');
  const [location, setLocation] = useState('オンライン');
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([]);
  
  // 出席者の定義 - Oshima Takuyaを先頭に追加
  const attendees: Attendee[] = [
    { email: 'oshimat@tech0jp.onmicrosoft.com', displayName: 'Oshima Takuya' },
    { email: 'sembat@tech0jp.onmicrosoft.com', displayName: 'Semba Takumi' },
    { email: 'tech0i@tech0jp.onmicrosoft.com', displayName: 'Tech0 Ichiro' },
    { email: 'tech0j@tech0-jp.com', displayName: 'Tech0 Jiro' }
  ];

  const timeSlots: TimeSlot[] = [
    // 3/27の時間枠
    { date: '3/27', time: '9:00~10:00', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'unavailable', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'unavailable', 'tech0j@tech0-jp.com': 'unavailable' } },
    { date: '3/27', time: '9:30~10:30', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'unavailable', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'unavailable', 'tech0j@tech0-jp.com': 'unavailable' } },
    { date: '3/27', time: '10:00~11:00', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'unavailable', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'unavailable', 'tech0j@tech0-jp.com': 'unavailable' } },
    { date: '3/27', time: '10:30~11:30', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'unavailable', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'unavailable', 'tech0j@tech0-jp.com': 'unavailable' } },
    { date: '3/27', time: '13:00~14:00', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'unavailable', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'unavailable', 'tech0j@tech0-jp.com': 'unavailable' } },
    { date: '3/27', time: '13:30~14:30', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'unavailable', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'unavailable', 'tech0j@tech0-jp.com': 'unavailable' } },
    { date: '3/27', time: '14:00~15:00', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'unavailable', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'unavailable', 'tech0j@tech0-jp.com': 'unavailable' } },
    { date: '3/27', time: '14:30~15:30', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'unavailable', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'unavailable', 'tech0j@tech0-jp.com': 'unavailable' } },
    { date: '3/27', time: '15:00~16:00', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'unavailable', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'unavailable', 'tech0j@tech0-jp.com': 'unavailable' } },
    { date: '3/27', time: '15:30~16:30', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'unavailable', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'unavailable', 'tech0j@tech0-jp.com': 'unavailable' } },
    { date: '3/27', time: '16:00~17:00', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'unavailable', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'unavailable', 'tech0j@tech0-jp.com': 'unavailable' } },
    { date: '3/27', time: '16:30~17:30', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'unavailable', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'unavailable', 'tech0j@tech0-jp.com': 'unavailable' } },
    { date: '3/27', time: '17:00~18:00', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'unavailable', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'unavailable', 'tech0j@tech0-jp.com': 'unavailable' } },
    
    // 3/28の時間枠
    { date: '3/28', time: '9:00~10:00', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'unavailable', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'unavailable', 'tech0j@tech0-jp.com': 'unavailable' } },
    { date: '3/28', time: '9:30~10:30', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'unavailable', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'unavailable', 'tech0j@tech0-jp.com': 'unavailable' } },
    { date: '3/28', time: '10:00~11:00', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'unavailable', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'unavailable', 'tech0j@tech0-jp.com': 'unavailable' } },
    { date: '3/28', time: '10:30~11:30', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'unavailable', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'unavailable', 'tech0j@tech0-jp.com': 'unavailable' } },
    { date: '3/28', time: '13:00~14:00', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'unavailable', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'unavailable', 'tech0j@tech0-jp.com': 'unavailable' } },
    { date: '3/28', time: '13:30~14:30', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'unavailable', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'unavailable', 'tech0j@tech0-jp.com': 'unavailable' } },
    { date: '3/28', time: '14:00~15:00', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'unavailable', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'unavailable', 'tech0j@tech0-jp.com': 'unavailable' } },
    { date: '3/28', time: '14:30~15:30', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'unavailable', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'unavailable', 'tech0j@tech0-jp.com': 'unavailable' } },
    { date: '3/28', time: '15:00~16:00', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'unavailable', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'unavailable', 'tech0j@tech0-jp.com': 'unavailable' } },
    { date: '3/28', time: '15:30~16:30', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'unavailable', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'unavailable', 'tech0j@tech0-jp.com': 'unavailable' } },
    { date: '3/28', time: '16:00~17:00', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'unavailable', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'unavailable', 'tech0j@tech0-jp.com': 'unavailable' } },
    { date: '3/28', time: '16:30~17:30', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'unavailable', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'unavailable', 'tech0j@tech0-jp.com': 'unavailable' } },
    { date: '3/28', time: '17:00~18:00', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'unavailable', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'unavailable', 'tech0j@tech0-jp.com': 'unavailable' } },
    
    // 3/31の時間枠
    { date: '3/31', time: '9:00~10:00', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'unavailable', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'unavailable', 'tech0j@tech0-jp.com': 'unavailable' } },
    { date: '3/31', time: '9:30~10:30', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'unavailable', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'unavailable', 'tech0j@tech0-jp.com': 'unavailable' } },
    { date: '3/31', time: '10:00~11:00', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'unavailable', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'unavailable', 'tech0j@tech0-jp.com': 'unavailable' } },
    { date: '3/31', time: '10:30~11:30', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'unavailable', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'unavailable', 'tech0j@tech0-jp.com': 'unavailable' } },
    { date: '3/31', time: '13:00~14:00', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'unavailable', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'unavailable', 'tech0j@tech0-jp.com': 'unavailable' } },
    { date: '3/31', time: '13:30~14:30', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'unavailable', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'unavailable', 'tech0j@tech0-jp.com': 'unavailable' } },
    { date: '3/31', time: '14:00~15:00', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'unavailable', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'unavailable', 'tech0j@tech0-jp.com': 'unavailable' } },
    { date: '3/31', time: '14:30~15:30', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'unavailable', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'unavailable', 'tech0j@tech0-jp.com': 'unavailable' } },
    { date: '3/31', time: '15:00~16:00', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'unavailable', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'unavailable', 'tech0j@tech0-jp.com': 'unavailable' } },
    { date: '3/31', time: '15:30~16:30', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'unavailable', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'unavailable', 'tech0j@tech0-jp.com': 'unavailable' } },
    // 唯一available設定の時間枠
    { date: '3/31', time: '16:00~17:00', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'available', 'sembat@tech0jp.onmicrosoft.com': 'available', 'tech0i@tech0jp.onmicrosoft.com': 'available', 'tech0j@tech0-jp.com': 'available' } },
    { date: '3/31', time: '16:30~17:30', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'unavailable', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'unavailable', 'tech0j@tech0-jp.com': 'unavailable' } },
    { date: '3/31', time: '17:00~18:00', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'unavailable', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'unavailable', 'tech0j@tech0-jp.com': 'unavailable' } },
  ];

 // モーダルを開く関数
 const openModal = (date: string, time: string) => {
  setModalState({ type: 'edit', date, time });
  
  // 件名と本文を初期値にリセット
  setSubject(`会議: ${date} ${time}`);
  setBody(`${date} ${time}の会議にご参加ください。`);
  // デフォルトで全員選択
  setSelectedAttendees(attendees.map(a => a.email));
};

// モーダルを閉じる関数
const closeModal = () => {
  setModalState({ type: 'closed' });
};

// 参加者選択の切り替え関数
const toggleAttendee = (email: string) => {
  setSelectedAttendees(prev => {
    if (prev.includes(email)) {
      return prev.filter(e => e !== email);
    } else {
      return [...prev, email];
    }
  });
};

// 会議依頼を送信する関数
const sendMeetingInvite = async () => {
  if (!msalInstance || !account || modalState.type !== 'edit') return;
  
  const { date, time } = modalState;
  setLoading(true);
  setError(null);

  try {
    // 時間の処理
    const [startTime, endTime] = time.split('~');
    const [month, day] = date.split('/');
    const year = new Date().getFullYear();
    
    // 例: "10:00" -> "10:00:00"
    const formattedStartTime = startTime.includes(':') ? `${startTime}:00` : `${startTime}:00:00`;
    const formattedEndTime = endTime.includes(':') ? `${endTime}:00` : `${endTime}:00:00`;
    
    // ISO形式の日付文字列を作成
    // 例: "2025-03-31T10:00:00"
    const startDateTime = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${formattedStartTime}`;
    const endDateTime = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${formattedEndTime}`;

    // トークンの取得
    const tokenResponse = await msalInstance.acquireTokenSilent({
      scopes: [
        'Calendars.ReadWrite'
      ],
      account: account
    }).catch(async (error) => {
      if (error instanceof InteractionRequiredAuthError) {
        return await msalInstance.acquireTokenPopup({
          scopes: [
            'Calendars.ReadWrite'
          ]
        });
      }
      throw error;
    });

    // 選択された参加者をフィルタリング
    const filteredAttendees = attendees
      .filter(attendee => selectedAttendees.includes(attendee.email));

    // 会議依頼データの準備
    const timeZone = 'Asia/Tokyo';
    const meetingRequest = {
      subject: subject,
      body: {
        contentType: 'HTML',
        content: body
      },
      start: {
        dateTime: startDateTime,
        timeZone: timeZone
      },
      end: {
        dateTime: endDateTime,
        timeZone: timeZone
      },
      location: {
        displayName: location
      },
      attendees: filteredAttendees.map(attendee => ({
        emailAddress: {
          address: attendee.email,
          name: attendee.displayName || attendee.email
        },
        type: 'required'
      })),
      isOnlineMeeting: true,
      onlineMeetingProvider: 'teamsForBusiness'
    };

    console.log('Meeting Request Payload:', meetingRequest);

    // Graph APIを呼び出して会議依頼を作成
    const response = await fetch(
      'https://graph.microsoft.com/v1.0/me/events',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenResponse.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(meetingRequest)
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      console.log('Meeting created successfully:', responseData);
      
      // 成功メッセージを表示
      setModalState({ 
        type: 'success',
        message: `${date} ${time}の会議依頼を送信しました`
      });
      
      // 3秒後に成功ポップアップを閉じる
      setTimeout(() => {
        setModalState({ type: 'closed' });
      }, 3000);
    } else {
      const errorData = await response.json().catch(() => null);
      console.error('API Error:', errorData);
      throw new Error('会議依頼の送信に失敗しました');
    }
  } catch (err) {
    console.error('Error sending meeting invite:', err);
    setError('会議依頼の送信に失敗しました');
  } finally {
    setLoading(false);
  }
};

// 全員の空きチェック (全員が'available'の場合trueを返す)
const isEveryoneAvailable = (timeSlot: TimeSlot): boolean => {
  return Object.values(timeSlot.availabilities).every(status => status === 'available');
};

// 特定の日付と時間かどうかをチェックする関数（緑色にするため）
const isTargetTimeSlot = (date: string, time: string): boolean => {
  return date === '3/31' && time === '16:00~17:00';
};

// モーダルのレンダリング
const renderModal = () => {
  if (modalState.type === 'closed') return null;

  if (modalState.type === 'success') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">送信完了</h3>
            <p className="text-sm text-gray-500 mb-4">{modalState.message}</p>
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none"
              onClick={closeModal}
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (modalState.type === 'edit') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
          <h2 className="text-xl font-bold mb-4">会議依頼の編集</h2>
          <p className="text-gray-600 mb-4">{modalState.date} {modalState.time}</p>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-1">件名</label>
              <input
                id="subject"
                className="w-full px-3 py-2 border rounded-md"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="body" className="block text-sm font-medium mb-1">本文</label>
              <textarea
                id="body"
                className="w-full px-3 py-2 border rounded-md"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-1">場所</label>
              <input
                id="location"
                className="w-full px-3 py-2 border rounded-md"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">参加者</label>
              <div className="space-y-2">
                {attendees.map((attendee, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`attendee-${index}`}
                      checked={selectedAttendees.includes(attendee.email)}
                      onChange={() => toggleAttendee(attendee.email)}
                      className="mr-2"
                    />
                    <label htmlFor={`attendee-${index}`} className="text-sm">
                      {attendee.displayName || attendee.email}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {error && <div className="text-red-500">{error}</div>}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={closeModal}
                disabled={loading}
              >
                キャンセル
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
                onClick={sendMeetingInvite}
                disabled={loading || selectedAttendees.length === 0}
              >
                {loading ? '送信中...' : '送信する'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

return (
  <div className="mt-4">
    <h2 className="text-xl font-bold mb-4">予定調整表</h2>
    
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">日付</th>
            <th className="border border-gray-300 px-4 py-2">時間</th>
            {attendees.map((attendee, index) => (
              <th key={index} className="border border-gray-300 px-4 py-2">
                {attendee.displayName || attendee.email}
              </th>
            ))}
            <th className="border border-gray-300 px-4 py-2">会議依頼</th>
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((timeSlot, index) => {
            const isAllAvailable = isEveryoneAvailable(timeSlot);
            const isTarget = isTargetTimeSlot(timeSlot.date, timeSlot.time);
            
            return (
              <tr 
                key={index} 
                className={isTarget ? "bg-green-400" : isAllAvailable ? "bg-green-100" : ""}
              >
                {index === 0 || timeSlots[index-1].date !== timeSlot.date ? (
                  <td 
                    className="border border-gray-300 px-4 py-2"
                    rowSpan={timeSlots.filter(ts => ts.date === timeSlot.date).length}
                  >
                    {timeSlot.date}
                  </td>
                ) : null}
                <td className="border border-gray-300 px-4 py-2">{timeSlot.time}</td>
                {attendees.map((attendee, attendeeIndex) => (
                  <td key={attendeeIndex} className="border border-gray-300 px-4 py-2 text-center">
                    <div className="flex justify-center items-center">
                      {timeSlot.availabilities[attendee.email] === 'available' ? (
                        <span className="text-lg">○</span>
                      ) : (
                        <span className="font-bold">×</span>
                      )}
                    </div>
                  </td>
                ))}
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <div className="flex justify-center">
                    <button
                      onClick={() => openModal(timeSlot.date, timeSlot.time)}
                      className="bg-black text-white px-4 py-1 rounded disabled:opacity-50"
                    >
                      送付する
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    
    {/* モーダルコンポーネント */}
    {renderModal()}
  </div>
);
}

// // app/components/ScheduleTable.tsx
// 'use client'

// import { useState } from 'react';
// import { useAuth } from './AuthProvider';
// import { InteractionRequiredAuthError } from '@azure/msal-browser';

// interface TimeSlot {
//   date: string;
//   time: string;
//   availabilities: {
//     [email: string]: 'available' | 'unavailable' | 'unknown';
//   };
// }

// interface Attendee {
//   email: string;
//   displayName?: string;
// }

// // モーダルの表示状態を管理する型
// type ModalState = 
//   | { type: 'closed' }
//   | { type: 'edit'; date: string; time: string }
//   | { type: 'success'; message: string };

// export default function ScheduleTable() {
//   const { msalInstance, account } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [modalState, setModalState] = useState<ModalState>({ type: 'closed' });
  
//   // 会議詳細フォームの状態
//   const [subject, setSubject] = useState('会議のお知らせ');
//   const [body, setBody] = useState('会議にご参加ください。');
//   const [location, setLocation] = useState('オンライン');
//   const [selectedAttendees, setSelectedAttendees] = useState<string[]>([]);
  
//   // 出席者の定義 - Oshima Takuyaを先頭に追加
//   const attendees: Attendee[] = [
//     { email: 'oshimat@tech0jp.onmicrosoft.com', displayName: 'Oshima Takuya' },
//     { email: 'sembat@tech0jp.onmicrosoft.com', displayName: 'Semba Takumi' },
//     { email: 'tech0i@tech0jp.onmicrosoft.com', displayName: 'Tech0 Ichiro' },
//     { email: 'tech0j@tech0-jp.com', displayName: 'Tech0 Jiro' }
//   ];

//   // 日付と時間枠の定義 - 日付を3/27、3/28、3/31に変更
//   const timeSlots: TimeSlot[] = [
//     // 3/27の時間枠
//     { date: '3/27', time: '9:00~10:00', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'available', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'available', 'tech0j@tech0-jp.com': 'unavailable' } },
//     { date: '3/27', time: '9:30~10:30', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'available', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'available', 'tech0j@tech0-jp.com': 'unavailable' } },
//     { date: '3/27', time: '10:00~11:00', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'available', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'available', 'tech0j@tech0-jp.com': 'unavailable' } },
//     { date: '3/27', time: '10:30~11:30', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'available', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'available', 'tech0j@tech0-jp.com': 'unavailable' } },
//     { date: '3/27', time: '13:00~14:00', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'available', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'available', 'tech0j@tech0-jp.com': 'unavailable' } },
//     { date: '3/27', time: '13:30~14:30', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'available', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'available', 'tech0j@tech0-jp.com': 'unavailable' } },
//     { date: '3/27', time: '14:00~15:00', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'available', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'available', 'tech0j@tech0-jp.com': 'unavailable' } },
//     { date: '3/27', time: '14:30~15:30', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'available', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'available', 'tech0j@tech0-jp.com': 'unavailable' } },
//     { date: '3/27', time: '15:00~16:00', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'available', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'available', 'tech0j@tech0-jp.com': 'unavailable' } },
//     { date: '3/27', time: '15:30~16:30', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'available', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'available', 'tech0j@tech0-jp.com': 'unavailable' } },
//     { date: '3/27', time: '16:00~17:00', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'available', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'available', 'tech0j@tech0-jp.com': 'unavailable' } },
//     { date: '3/27', time: '16:30~17:30', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'available', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'available', 'tech0j@tech0-jp.com': 'unavailable' } },
//     { date: '3/27', time: '17:00~18:00', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'available', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'available', 'tech0j@tech0-jp.com': 'unavailable' } },
    
//     // 3/28の時間枠
//     { date: '3/28', time: '9:00~10:00', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'available', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'available', 'tech0j@tech0-jp.com': 'unavailable' } },
//     { date: '3/28', time: '9:30~10:30', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'available', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'available', 'tech0j@tech0-jp.com': 'unavailable' } },
//     { date: '3/28', time: '10:00~11:00', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'available', 'sembat@tech0jp.onmicrosoft.com': 'available', 'tech0i@tech0jp.onmicrosoft.com': 'available', 'tech0j@tech0-jp.com': 'available' } },
//     { date: '3/28', time: '10:30~11:30', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'available', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'available', 'tech0j@tech0-jp.com': 'unavailable' } },
//     { date: '3/28', time: '13:00~14:00', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'available', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'available', 'tech0j@tech0-jp.com': 'unavailable' } },
//     { date: '3/28', time: '13:30~14:30', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'available', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'available', 'tech0j@tech0-jp.com': 'unavailable' } },
//     { date: '3/28', time: '14:00~15:00', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'available', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'available', 'tech0j@tech0-jp.com': 'unavailable' } },
//     { date: '3/28', time: '14:30~15:30', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'available', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'available', 'tech0j@tech0-jp.com': 'unavailable' } },
//     { date: '3/28', time: '15:00~16:00', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'available', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'available', 'tech0j@tech0-jp.com': 'unavailable' } },
//     { date: '3/28', time: '15:30~16:30', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'available', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'available', 'tech0j@tech0-jp.com': 'unavailable' } },
//     { date: '3/28', time: '16:00~17:00', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'available', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'available', 'tech0j@tech0-jp.com': 'unavailable' } },
//     { date: '3/28', time: '16:30~17:30', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'available', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'available', 'tech0j@tech0-jp.com': 'unavailable' } },
//     { date: '3/28', time: '17:00~18:00', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'available', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'available', 'tech0j@tech0-jp.com': 'unavailable' } },
    
//     // 3/31の時間枠
//     { date: '3/31', time: '9:00~10:00', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'available', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'available', 'tech0j@tech0-jp.com': 'unavailable' } },
//     { date: '3/31', time: '9:30~10:30', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'available', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'available', 'tech0j@tech0-jp.com': 'unavailable' } },
//     { date: '3/31', time: '10:00~11:00', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'available', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'available', 'tech0j@tech0-jp.com': 'unavailable' } },
//     { date: '3/31', time: '10:30~11:30', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'available', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'available', 'tech0j@tech0-jp.com': 'unavailable' } },
//     { date: '3/31', time: '13:00~14:00', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'available', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'available', 'tech0j@tech0-jp.com': 'unavailable' } },
//     { date: '3/31', time: '13:30~14:30', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'available', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'available', 'tech0j@tech0-jp.com': 'unavailable' } },
//     { date: '3/31', time: '14:00~15:00', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'available', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'available', 'tech0j@tech0-jp.com': 'unavailable' } },
//     { date: '3/31', time: '14:30~15:30', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'available', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'available', 'tech0j@tech0-jp.com': 'unavailable' } },
//     { date: '3/31', time: '15:00~16:00', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'available', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'available', 'tech0j@tech0-jp.com': 'unavailable' } },
//     { date: '3/31', time: '15:30~16:30', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'available', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'available', 'tech0j@tech0-jp.com': 'unavailable' } },
//     { date: '3/31', time: '16:00~17:00', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'available', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'available', 'tech0j@tech0-jp.com': 'unavailable' } },
//     { date: '3/31', time: '16:30~17:30', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'available', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'available', 'tech0j@tech0-jp.com': 'unavailable' } },
//     { date: '3/31', time: '17:00~18:00', availabilities: { 'oshimat@tech0jp.onmicrosoft.com': 'available', 'sembat@tech0jp.onmicrosoft.com': 'unavailable', 'tech0i@tech0jp.onmicrosoft.com': 'available', 'tech0j@tech0-jp.com': 'unavailable' } },
//   ];

//  // モーダルを開く関数
//  const openModal = (date: string, time: string) => {
//   setModalState({ type: 'edit', date, time });
  
//   // 件名と本文を初期値にリセット
//   setSubject(`会議: ${date} ${time}`);
//   setBody(`${date} ${time}の会議にご参加ください。`);
//   // デフォルトで全員選択
//   setSelectedAttendees(attendees.map(a => a.email));
// };

// // モーダルを閉じる関数
// const closeModal = () => {
//   setModalState({ type: 'closed' });
// };

// // 参加者選択の切り替え関数
// const toggleAttendee = (email: string) => {
//   setSelectedAttendees(prev => {
//     if (prev.includes(email)) {
//       return prev.filter(e => e !== email);
//     } else {
//       return [...prev, email];
//     }
//   });
// };

// // 会議依頼を送信する関数
// const sendMeetingInvite = async () => {
//   if (!msalInstance || !account || modalState.type !== 'edit') return;
  
//   const { date, time } = modalState;
//   setLoading(true);
//   setError(null);

//   try {
//     // 時間の処理
//     const [startTime, endTime] = time.split('~');
//     const [month, day] = date.split('/');
//     const year = new Date().getFullYear();
    
//     // 例: "10:00" -> "10:00:00"
//     const formattedStartTime = startTime.includes(':') ? `${startTime}:00` : `${startTime}:00:00`;
//     const formattedEndTime = endTime.includes(':') ? `${endTime}:00` : `${endTime}:00:00`;
    
//     // ISO形式の日付文字列を作成
//     // 例: "2025-03-31T10:00:00"
//     const startDateTime = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${formattedStartTime}`;
//     const endDateTime = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${formattedEndTime}`;

//     // トークンの取得
//     const tokenResponse = await msalInstance.acquireTokenSilent({
//       scopes: [
//         'Calendars.ReadWrite'
//       ],
//       account: account
//     }).catch(async (error) => {
//       if (error instanceof InteractionRequiredAuthError) {
//         return await msalInstance.acquireTokenPopup({
//           scopes: [
//             'Calendars.ReadWrite'
//           ]
//         });
//       }
//       throw error;
//     });

//     // 選択された参加者をフィルタリング
//     const filteredAttendees = attendees
//       .filter(attendee => selectedAttendees.includes(attendee.email));

//     // 会議依頼データの準備
//     const timeZone = 'Asia/Tokyo';
//     const meetingRequest = {
//       subject: subject,
//       body: {
//         contentType: 'HTML',
//         content: body
//       },
//       start: {
//         dateTime: startDateTime,
//         timeZone: timeZone
//       },
//       end: {
//         dateTime: endDateTime,
//         timeZone: timeZone
//       },
//       location: {
//         displayName: location
//       },
//       attendees: filteredAttendees.map(attendee => ({
//         emailAddress: {
//           address: attendee.email,
//           name: attendee.displayName || attendee.email
//         },
//         type: 'required'
//       })),
//       isOnlineMeeting: true,
//       onlineMeetingProvider: 'teamsForBusiness'
//     };

//     console.log('Meeting Request Payload:', meetingRequest);

//     // Graph APIを呼び出して会議依頼を作成
//     const response = await fetch(
//       'https://graph.microsoft.com/v1.0/me/events',
//       {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${tokenResponse.accessToken}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(meetingRequest)
//       }
//     );

//     if (response.ok) {
//       const responseData = await response.json();
//       console.log('Meeting created successfully:', responseData);
      
//       // 成功メッセージを表示
//       setModalState({ 
//         type: 'success',
//         message: `${date} ${time}の会議依頼を送信しました`
//       });
      
//       // 3秒後に成功ポップアップを閉じる
//       setTimeout(() => {
//         setModalState({ type: 'closed' });
//       }, 3000);
//     } else {
//       const errorData = await response.json().catch(() => null);
//       console.error('API Error:', errorData);
//       throw new Error('会議依頼の送信に失敗しました');
//     }
//   } catch (err) {
//     console.error('Error sending meeting invite:', err);
//     setError('会議依頼の送信に失敗しました');
//   } finally {
//     setLoading(false);
//   }
// };

// // 全員の空きチェック (全員が'available'の場合trueを返す)
// const isEveryoneAvailable = (timeSlot: TimeSlot): boolean => {
//   return Object.values(timeSlot.availabilities).every(status => status === 'available');
// };

// // モーダルのレンダリング
// const renderModal = () => {
//   if (modalState.type === 'closed') return null;

//   if (modalState.type === 'success') {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
//           <div className="text-center">
//             <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
//               <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//               </svg>
//             </div>
//             <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">送信完了</h3>
//             <p className="text-sm text-gray-500 mb-4">{modalState.message}</p>
//             <button
//               type="button"
//               className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none"
//               onClick={closeModal}
//             >
//               閉じる
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (modalState.type === 'edit') {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
//           <h2 className="text-xl font-bold mb-4">会議依頼の編集</h2>
//           <p className="text-gray-600 mb-4">{modalState.date} {modalState.time}</p>
          
//           <div className="space-y-4">
//             <div>
//               <label htmlFor="subject" className="block text-sm font-medium mb-1">件名</label>
//               <input
//                 id="subject"
//                 className="w-full px-3 py-2 border rounded-md"
//                 value={subject}
//                 onChange={(e) => setSubject(e.target.value)}
//               />
//             </div>

//             <div>
//               <label htmlFor="body" className="block text-sm font-medium mb-1">本文</label>
//               <textarea
//                 id="body"
//                 className="w-full px-3 py-2 border rounded-md"
//                 value={body}
//                 onChange={(e) => setBody(e.target.value)}
//                 rows={3}
//               />
//             </div>

//             <div>
//               <label htmlFor="location" className="block text-sm font-medium mb-1">場所</label>
//               <input
//                 id="location"
//                 className="w-full px-3 py-2 border rounded-md"
//                 value={location}
//                 onChange={(e) => setLocation(e.target.value)}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-2">参加者</label>
//               <div className="space-y-2">
//                 {attendees.map((attendee, index) => (
//                   <div key={index} className="flex items-center">
//                     <input
//                       type="checkbox"
//                       id={`attendee-${index}`}
//                       checked={selectedAttendees.includes(attendee.email)}
//                       onChange={() => toggleAttendee(attendee.email)}
//                       className="mr-2"
//                     />
//                     <label htmlFor={`attendee-${index}`} className="text-sm">
//                       {attendee.displayName || attendee.email}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {error && <div className="text-red-500">{error}</div>}

//             <div className="flex justify-end space-x-3">
//               <button
//                 type="button"
//                 className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
//                 onClick={closeModal}
//                 disabled={loading}
//               >
//                 キャンセル
//               </button>
//               <button
//                 type="button"
//                 className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
//                 onClick={sendMeetingInvite}
//                 disabled={loading || selectedAttendees.length === 0}
//               >
//                 {loading ? '送信中...' : '送信する'}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// };

// return (
//   <div className="mt-4">
//     <h2 className="text-xl font-bold mb-4">予定調整表</h2>
    
//     <div className="overflow-x-auto">
//       <table className="min-w-full border-collapse border border-gray-300">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="border border-gray-300 px-4 py-2">日付</th>
//             <th className="border border-gray-300 px-4 py-2">時間</th>
//             {attendees.map((attendee, index) => (
//               <th key={index} className="border border-gray-300 px-4 py-2">
//                 {attendee.displayName || attendee.email}
//               </th>
//             ))}
//             <th className="border border-gray-300 px-4 py-2">会議依頼</th>
//           </tr>
//         </thead>
//         <tbody>
//           {timeSlots.map((timeSlot, index) => {
//             const isAllAvailable = isEveryoneAvailable(timeSlot);
            
//             return (
//               <tr 
//                 key={index} 
//                 className={isAllAvailable ? "bg-green-100" : ""}
//               >
//                 {index === 0 || timeSlots[index-1].date !== timeSlot.date ? (
//                   <td 
//                     className="border border-gray-300 px-4 py-2"
//                     rowSpan={timeSlots.filter(ts => ts.date === timeSlot.date).length}
//                   >
//                     {timeSlot.date}
//                   </td>
//                 ) : null}
//                 <td className="border border-gray-300 px-4 py-2">{timeSlot.time}</td>
//                 {attendees.map((attendee, attendeeIndex) => (
//                   <td key={attendeeIndex} className="border border-gray-300 px-4 py-2 text-center">
//                     <div className="flex justify-center items-center">
//                       {timeSlot.availabilities[attendee.email] === 'available' ? (
//                         <span className="text-lg">○</span>
//                       ) : (
//                         <span className="font-bold">×</span>
//                       )}
//                     </div>
//                   </td>
//                 ))}
//                 <td className="border border-gray-300 px-4 py-2 text-center">
//                   <div className="flex justify-center">
//                     <button
//                       onClick={() => openModal(timeSlot.date, timeSlot.time)}
//                       className="bg-black text-white px-4 py-1 rounded disabled:opacity-50"
//                     >
//                       送付する
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
    
//     {/* モーダルコンポーネント */}
//     {renderModal()}
//   </div>
// );
// }