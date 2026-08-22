import React, { useEffect } from 'react';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import SEOHead from '@/components/SEOHead';
import { pageSEO, generateStructuredData } from '@/lib/seo';
import Hero from '@/components/HeroDocumentarySplit';
import BeneficiaryShowcase from '@/components/BeneficiaryShowcase';
import ImpactGallery from '@/components/ImpactGallery';
import TestimonialsSection from '@/components/TestimonialsSection';
import UrgentNeeds from '@/components/UrgentNeeds';
import StickyDonationButton from '@/components/StickyDonationButton';
import SuccessStories from '@/components/SuccessStories';
import TransparencySection from '@/components/TransparencySection';
import ErrorBoundary from '@/components/ErrorBoundary';
import NewsUpdates from '@/components/NewsUpdates';
import NewsletterSignup from '@/components/NewsletterSignup';
import { useDonationModal } from '@/components/DonationModalProvider';
import {
  ClosingInvitation,
  FoundationIntroduction,
  ImpactMethod,
  ImpactNumbers,
} from '@/components/home/HomeEditorialSections';
import { DashboardStats } from '@/types';

interface HomeProps {
  stats?: DashboardStats;
}

const HomeContent: React.FC<HomeProps> = ({ stats }) => {
  const { openDonationModal } = useDonationModal();
  const router = useRouter();

  useEffect(() => {
    if (!router.asPath.includes('#urgent-campaign')) return;

    const timer = window.setTimeout(() => {
      document.getElementById('urgent-campaign')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    return () => window.clearTimeout(timer);
  }, [router.asPath]);

  useEffect(() => {
    const initialItems = Array.from(document.querySelectorAll<HTMLElement>('[data-home-reveal]'));
    if (!('IntersectionObserver' in window)) {
      initialItems.forEach(item => item.setAttribute('data-home-visible', 'true'));
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).setAttribute('data-home-visible', 'true');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
    );

    const observeRevealItems = (root: ParentNode) => {
      if (root instanceof HTMLElement && root.matches('[data-home-reveal]')) observer.observe(root);
      root.querySelectorAll<HTMLElement>('[data-home-reveal]').forEach(item => observer.observe(item));
    };

    initialItems.forEach(item => observer.observe(item));
    const mutationObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node instanceof HTMLElement) observeRevealItems(node);
        });
      });
    });
    mutationObserver.observe(document.querySelector('.homepage-premium') || document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <>
      <SEOHead config={pageSEO.home} structuredData={generateStructuredData.organization()} />
      <ErrorBoundary>
        <main className="homepage-premium min-h-screen">
          <Hero
            stats={stats}
            onDonateClick={() => openDonationModal({
              source: 'hero-cta',
              title: 'Transform Lives Today',
              description: 'Join thousands of donors making a difference for orphans and widows',
            })}
          />
          <FoundationIntroduction />
          <ImpactMethod />
          <BeneficiaryShowcase />
          <ImpactNumbers stats={stats} />
          <ImpactGallery />
          <SuccessStories />
          <UrgentNeeds
            onDonateClick={() => openDonationModal({
              source: 'urgent-needs',
              category: 'emergency',
              title: 'Help With Urgent Needs',
              description: 'Your immediate support can save lives in crisis situations',
            })}
          />
          <TestimonialsSection />
          <TransparencySection />
          <NewsletterSignup />
          <NewsUpdates />
          <StickyDonationButton
            onDonateClick={() => openDonationModal({
              source: 'sticky-button',
              title: 'Quick Donation',
              description: 'Make a quick donation to support our mission',
            })}
          />
          <ClosingInvitation onDonate={openDonationModal} />
        </main>
      </ErrorBoundary>
    </>
  );
};

const Home: React.FC<HomeProps> = props => <HomeContent {...props} />;

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/stats`);
    if (!response.ok) throw new Error('Failed to fetch stats');

    const { data } = await response.json();
    return { props: { stats: data }, revalidate: 300 };
  } catch (error) {
    console.error('Error fetching stats:', error);

    const fallbackStats: DashboardStats = {
      totalDonations: 9077,
      totalDonors: 45,
      totalBeneficiaries: 120,
      totalPrograms: 6,
      totalVolunteers: 15,
      totalPartnerships: 20,
      monthlyRevenue: 1200,
      monthlyExpenses: 950,
      activeAdoptions: 120,
      pendingGrants: 3,
    };

    return { props: { stats: fallbackStats }, revalidate: 300 };
  }
};

export default Home;
