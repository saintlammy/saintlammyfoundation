import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import Layout from '@/components/Layout';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import NotificationContainer from '@/components/NotificationContainer';
import NotificationEventListener from '@/components/NotificationEventListener';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith('/admin');

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ErrorBoundary>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <NotificationEventListener />
              {isAdminRoute ? (
                // Admin routes don't use the main Layout
                <Component {...pageProps} />
              ) : (
                // Public routes use the main Layout
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              )}
              <NotificationContainer />
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </>
  );
}