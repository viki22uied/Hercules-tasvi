
'use client';
import {
  useState,
  useEffect,
  createContext,
  useContext,
  type ReactNode,
} from 'react';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { getFirebaseApp } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

const publicPaths = ['/login', '/signup', '/'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const app = getFirebaseApp();
  const auth = getAuth(app);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (loading) return;

    const isPublicPath = publicPaths.includes(pathname);

    if (!user && !isPublicPath) {
      router.push('/login');
    } else if (user && isPublicPath && pathname !== '/') {
        router.push('/dashboard');
    }
  }, [user, loading, pathname, router]);

  if (loading || (!user && !publicPaths.includes(pathname))) {
     return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
