// app/components/UserSearch.tsx
'use client'

import { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { Card, CardHeader, CardContent } from './ui/card';
import { Checkbox } from "./ui/checkbox";
import { InteractionRequiredAuthError } from '@azure/msal-browser';

interface User {
  id: string;
  displayName: string;
  userPrincipalName: string;
}

export default function UserSearch() {
  const { msalInstance, account } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);

  // アカウント情報が変更されたら自動的にユーザー一覧を取得
  useEffect(() => {
    if (msalInstance && account) {
      fetchUsers();
    }
  }, [msalInstance, account]);

  // 検索クエリが変更されたときにユーザーリストをフィルタリング
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();
    const filtered = users.filter(user => 
      user.displayName.toLowerCase().includes(lowerQuery) || 
      user.userPrincipalName.toLowerCase().includes(lowerQuery)
    );
    
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    if (!msalInstance || !account) return;
  
    setLoading(true);
    try {
      const tokenResponse = await msalInstance.acquireTokenSilent({
        scopes: [
          'User.Read',
          'User.ReadBasic.All'
        ],
        account: account
      }).catch(async (error) => {
        if (error instanceof InteractionRequiredAuthError) {
          return await msalInstance.acquireTokenPopup({
            scopes: [
              'User.Read',
              'User.ReadBasic.All'
            ]
          });
        }
        throw error;
      });

      const response = await fetch(
        'https://graph.microsoft.com/v1.0/users?$select=id,displayName,userPrincipalName',
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Users API Response:', data);
        if (data.value && Array.isArray(data.value)) {
          setUsers(data.value);
          setFilteredUsers(data.value); // 初期状態は全ユーザーを表示
        } else {
          setError('予期しないデータ形式です');
        }
      } else {
        const errorData = await response.json().catch(() => null);
        console.error('API Error:', errorData);
        throw new Error('ユーザーの取得に失敗しました');
      }
    } catch (err) {
      setError('ユーザーの取得に失敗しました');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  // fetchSelectedUsersEvents関数は残しておくが、UIから直接呼び出すボタンは削除

  // 検索入力のクリア
  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <Card className="mt-4">
      <CardHeader>ユーザー一覧</CardHeader>
      <CardContent>
        {/* ボタンを削除 */}

        {/* 検索ボックス */}
        <div className="mb-4 relative">
          <input
            type="text"
            placeholder="名前やメールアドレスで検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-md pr-10"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* フィルタリング結果の表示 */}
        {searchQuery && (
          <p className="text-sm text-gray-500 mb-2">
            {filteredUsers.length} 件のユーザーが見つかりました
          </p>
        )}

        {error && <div className="text-red-500 mb-2">{error}</div>}

        <div className="space-y-2 max-h-80 overflow-y-auto">
          {filteredUsers.map(user => (
            <div
              key={user.id}
              className="p-2 border rounded hover:bg-gray-50 flex items-center gap-2"
            >
              <Checkbox
                checked={selectedUsers.includes(user.id)}
                onCheckedChange={() => handleUserSelect(user.id)}
                id={user.id}
              />
              <div>
                <div className="font-medium">{user.displayName}</div>
                <div className="text-sm text-gray-500">{user.userPrincipalName}</div>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && !loading && (
          <div className="text-center py-4 text-gray-500">
            {searchQuery ? 'ユーザーが見つかりません' : 'ユーザーがいません'}
          </div>
        )}

        {/* イベント表示部分も削除 */}
      </CardContent>
    </Card>
  );
}