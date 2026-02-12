import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import Navigation from '@/components/Navigation';
import Breadcrumb from '@/components/Breadcrumb';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useDonationModal } from '@/components/DonationModalProvider';
import { Shield, FileText, Cookie } from 'lucide-react';
import SEOHead from '@/components/SEOHead';

interface LegalPageProps {
  page: {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    seo_title: string;
    seo_description: string;
  } | null;
}

const LegalPage: React.FC<LegalPageProps> = ({ page }) => {
  const { openDonationModal } = useDonationModal();

  if (!page) {
    return (
      <>
        <Navigation onDonateClick={() => openDonationModal({
          source: 'general',
          title: 'Support Our Mission',
          description: 'Your donation helps us transform lives across Nigeria'
        })} />
        <ErrorBoundary>
          <main className="min-h-screen bg-gray-900 pt-16">
            <section className="py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
              <div className="max-w-4xl mx-auto px-6 text-center">
                <h1 className="text-display-lg font-medium text-white mb-6">Page Not Found</h1>
                <p className="text-lg text-gray-300">The page you are looking for does not exist.</p>
              </div>
            </section>
          </main>
        </ErrorBoundary>
      </>
    );
  }

  const getIcon = () => {
    if (page.slug.includes('privacy')) return Shield;
    if (page.slug.includes('cookie')) return Cookie;
    return FileText;
  };

  const Icon = getIcon();

  return (
    <>
      <SEOHead config={{
        title: page.seo_title,
        description: page.seo_description,
        canonical: `/legal/${page.slug}`,
        type: 'website'
      }} />

      <Navigation onDonateClick={() => openDonationModal({
        source: 'general',
        title: 'Support Our Mission',
        description: 'Your donation helps us transform lives across Nigeria'
      })} />

      <ErrorBoundary>
        <main className="min-h-screen bg-gray-900 pt-16">
          <section className="py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            <div className="max-w-4xl mx-auto px-6">
              <Breadcrumb
                items={[{ label: page.title, current: true }]}
                className="mb-8"
              />

              <div className="text-center mb-12">
                <div className="w-16 h-16 bg-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-display-lg md:text-display-xl font-medium text-white mb-6 font-display tracking-tight">
                  {page.title}
                </h1>
                <p className="text-lg text-gray-300 font-light">
                  {page.excerpt}
                </p>
                <p className="text-sm text-gray-400 mt-4">
                  Last updated: January 1, 2024
                </p>
              </div>
            </div>
          </section>

          <section className="py-16 bg-gray-900">
            <div className="max-w-4xl mx-auto px-6">
              <div
                className="prose prose-lg prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: page.content }}
                style={{
                  color: '#d1d5db',
                }}
              />
            </div>
          </section>
        </main>
      </ErrorBoundary>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { slug: 'privacy' } },
      { params: { slug: 'terms' } },
      { params: { slug: 'cookie-policy' } }
    ],
    fallback: 'blocking'
  };
};

export const getStaticProps: GetStaticProps<LegalPageProps> = async ({ params }) => {
  try {
    const slug = params?.slug as string;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/pages?slug=${slug}`);

    if (!response.ok) {
      return {
        props: {
          page: null
        },
        revalidate: 300
      };
    }

    const page = await response.json();

    return {
      props: {
        page: page || null
      },
      revalidate: 3600 // Revalidate every hour
    };
  } catch (error) {
    console.error('Error fetching legal page:', error);
    return {
      props: {
        page: null
      },
      revalidate: 300
    };
  }
};

export default LegalPage;
