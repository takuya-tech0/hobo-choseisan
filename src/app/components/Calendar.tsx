// app/components/Calendar.tsx
'use client'

import { useState, useEffect } from 'react';

interface SelectedDateRange {
  start: Date | null;
  end: Date | null;
}

interface CalendarProps {
  onDateRangeSelect?: (start: Date | null, end: Date | null) => void;
}

export default function Calendar({ onDateRangeSelect }: CalendarProps = {}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isDragging, setIsDragging] = useState(false);
  const [dateRange, setDateRange] = useState<SelectedDateRange>({ start: null, end: null });
  
  // 年と月を取得
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // 月の最初の日と最後の日を取得
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // 月の最初の日の曜日（0: 日曜日, 1: 月曜日, ..., 6: 土曜日）
  const firstDayIndex = firstDay.getDay();
  
  // 前月の最後の日を取得
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  
  // カレンダーに表示する日付の配列を作成
  const days = [];
  
  // 前月の日付を埋める
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i;
    const date = new Date(year, month - 1, day);
    days.push({
      date: day,
      fullDate: date,
      currentMonth: false,
      prevMonth: true,
      nextMonth: false,
    });
  }
  
  // 当月の日付を埋める
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i);
    days.push({
      date: i,
      fullDate: date,
      currentMonth: true,
      prevMonth: false,
      nextMonth: false,
      isToday: new Date().getDate() === i && 
               new Date().getMonth() === month && 
               new Date().getFullYear() === year,
    });
  }
  
  // 次月の日付を埋める
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i);
    days.push({
      date: i,
      fullDate: date,
      currentMonth: false,
      prevMonth: false,
      nextMonth: true,
    });
  }

  // 日付が選択範囲内かチェック
  const isDateInRange = (date: Date): boolean => {
    if (!dateRange.start || !dateRange.end) return false;
    
    // 日付の比較は年月日のみで行う（時間は無視）
    const normalizeDate = (d: Date) => {
      const normalized = new Date(d);
      normalized.setHours(0, 0, 0, 0);
      return normalized.getTime();
    };
    
    const normalizedDate = normalizeDate(date);
    const normalizedStart = normalizeDate(dateRange.start);
    const normalizedEnd = normalizeDate(dateRange.end);
    
    return normalizedDate >= normalizedStart && normalizedDate <= normalizedEnd;
  };

  // ドラッグ開始の処理
  const handleDragStart = (date: Date) => {
    setIsDragging(true);
    setDateRange({ start: date, end: date });
  };

  // ドラッグ中の処理
  const handleDragOver = (date: Date) => {
    if (!isDragging) return;
    
    setDateRange(prev => {
      // 順序を考慮して開始日と終了日を設定
      if (prev.start) {
        if (date < prev.start) {
          return { start: date, end: prev.start };
        } else {
          return { start: prev.start, end: date };
        }
      }
      return prev;
    });
  };

  // ドラッグ終了の処理
  const handleDragEnd = () => {
    setIsDragging(false);
    
    // 選択範囲をログに出力
    if (dateRange.start && dateRange.end) {
      console.log('Selected date range:', {
        start: dateRange.start.toLocaleDateString(),
        end: dateRange.end.toLocaleDateString(),
        days: Math.round((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24)) + 1
      });
      
      // 親コンポーネントに通知
      if (onDateRangeSelect) {
        onDateRangeSelect(dateRange.start, dateRange.end);
      }
    }
  };

  // マウスアップイベントをグローバルに監視
  useEffect(() => {
    const handleMouseUp = () => {
      if (isDragging) {
        handleDragEnd();
      }
    };

    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dateRange]);
  
  // 前月へ移動
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  
  // 次月へ移動
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  
  // クリック時に前月/次月に移動する処理
  const handlePrevMonthClick = (date: Date) => {
    if (isDragging) {
      // ドラッグ中はドラッグ処理を継続
      handleDragOver(date);
    } else {
      // 通常のクリックは月を移動
      prevMonth();
    }
  };
  
  const handleNextMonthClick = (date: Date) => {
    if (isDragging) {
      // ドラッグ中はドラッグ処理を継続
      handleDragOver(date);
    } else {
      // 通常のクリックは月を移動
      nextMonth();
    }
  };
  
  // 日本語の曜日
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  
  // 日本語の月名
  const getMonthName = () => {
    return `${year} 年 ${month + 1} 月`;
  };
  
  return (
    <div className="calendar-container border rounded-lg p-4 shadow-sm bg-white w-full">
      <div className="calendar-header flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">{getMonthName()}</h2>
        <div className="flex">
          <button onClick={prevMonth} className="p-1 mr-2">
            <span className="text-xl">↑</span>
          </button>
          <button onClick={nextMonth} className="p-1">
            <span className="text-xl">↓</span>
          </button>
        </div>
      </div>
      
      <div className="calendar-grid grid grid-cols-7 gap-1">
        {/* 曜日のヘッダー */}
        {weekdays.map((day, index) => (
          <div 
            key={index} 
            className="text-center py-1 font-medium"
          >
            {day}
          </div>
        ))}
        
        {/* 日付 */}
        {days.map((day, index) => {
          const inRange = isDateInRange(day.fullDate);
          return (
            <div 
              key={index} 
              className={`
                text-center p-2 rounded-sm cursor-pointer select-none
                ${day.currentMonth ? 'bg-white' : 'text-gray-400 bg-gray-50'}
                ${day.isToday ? 'border border-blue-300' : ''}
                ${index % 7 === 0 ? 'text-red-500' : ''} 
                ${index % 7 === 6 ? 'text-blue-500' : ''} 
              `}
              style={inRange ? { backgroundColor: '#bfdbfe' } : {}}
              onMouseDown={() => handleDragStart(day.fullDate)}
              onMouseOver={() => handleDragOver(day.fullDate)}
              onClick={() => {
                if (day.prevMonth) handlePrevMonthClick(day.fullDate);
                if (day.nextMonth) handleNextMonthClick(day.fullDate);
              }}
            >
              {day.date}
            </div>
          );
        })}
      </div>

      {/* デバッグ用: 選択範囲の表示（必要に応じて削除） */}
      {(dateRange.start || dateRange.end) && (
        <div className="mt-2 text-xs text-gray-500">
          選択: {dateRange.start?.toLocaleDateString()} ~ {dateRange.end?.toLocaleDateString()}
        </div>
      )}
    </div>
  );
}