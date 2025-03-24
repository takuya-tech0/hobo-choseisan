// app/components/AuthProvider.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react';
import { PublicClientApplication, AccountInfo, IPublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from '../auth/config';

interface AuthContextType {
  msalInstance: IPublicClientApplication | null;
  account: AccountInfo | null;
  login: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [msalInstance, setMsalInstance] = useState<IPublicClientApplication | null>(null);
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeMsal = async () => {
      const msal = new PublicClientApplication(msalConfig);
      await msal.initialize();  // ここで初期化
      setMsalInstance(msal);

      const accounts = msal.getAllAccounts();
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }
      setInitialized(true);
    };

    initializeMsal().catch(console.error);
  }, []);

  const login = async () => {
    if (!msalInstance) return;
  
    try {
      const loginResponse = await msalInstance.loginPopup({
        scopes: [
          'User.Read',
          'Calendars.Read',
          'Calendars.Read.Shared'  // 共有カレンダーへのアクセス
        ],
        prompt: 'consent'  // 明示的に同意を要求
      });
      setAccount(loginResponse.account);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // MSALが初期化されるまで何も表示しない
  if (!initialized) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ msalInstance, account, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};