import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import Layout from '@/components/Layout';
import { AuthProvider } from '@/contexts/AuthContext';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith('/admin');

  return (
    <ErrorBoundary>
      <AuthProvider>
        {isAdminRoute ? (
          // Admin routes don't use the main Layout
          <Component {...pageProps} />
        ) : (
          // Public routes use the main Layout
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </AuthProvider>
    </ErrorBoundary>
  );
}