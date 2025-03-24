// app/auth/config.ts
export const msalConfig = {
    auth: {
      clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID || '',
      authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_TENANT_ID}`
    }
  };
  