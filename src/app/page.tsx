// app/page.tsx
import { AuthProvider } from './components/AuthProvider';
  import LoginScreen from './components/LoginScreen';

export default function Home() {
  return (
    <AuthProvider>
      <div className="container mx-auto p-4">
        <LoginScreen />
      </div>
    </AuthProvider>
  );
}