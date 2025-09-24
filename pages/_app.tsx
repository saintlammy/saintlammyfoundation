import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import Layout from '@/components/Layout';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ErrorBoundary>
  );
}