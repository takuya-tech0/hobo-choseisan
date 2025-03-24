// app/components/LoginScreen.tsx
'use client'

import { useAuth } from './AuthProvider';
import AppContent from './AppContent';

export default function LoginScreen() {
  const { account, login, msalInstance } = useAuth();

  if (account) {
    return <AppContent />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">ほぼ調整さん</h1>
        <p className="mb-8 text-gray-600 text-center">
          Microsoftアカウントでログインして、空き時間を自動で取得し会議依頼を送信することができます。
        </p>
        <button
          onClick={login}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-md transition duration-200"
        >
          Microsoftアカウントでログイン
        </button>
      </div>
    </div>
  );
}