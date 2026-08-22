import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  RiBookOpenLine,
  RiHandHeartLine,
  RiHeartPulseLine,
  RiHomeHeartLine,
  RiRefreshLine,
} from 'react-icons/ri';
import AboutHero from '@/components/about/AboutHero';
import { ActionButton, ActionLink, DoubleBezel } from '@/components/home/HomePrimitives';
import { useDonationModal } from '@/components/DonationModalProvider';
import SEOHead from '@/components/SEOHead';
import { pageSEO } from '@/lib/seo';
import { truncateForCard } from '@/lib/textUtils';

interface Program {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  targetAudience?: string;
  status: string;
}

const focusAreas = [
  {
    id: 'food-household-relief',
    title: 'Food and household relief',
    description: 'Practical support for vulnerable homes, widows, and families facing immediate pressure.',
    icon: RiHandHeartLine,
    className: 'work-focus-primary',
  },
  {
    id: 'education-support',
    title: 'Education support',
    description: 'School-fee and learning support delivered through verified care partners, including Divine Destiny Orphanage Home.',
    icon: RiBookOpenLine,
    className: 'work-focus-education',
  },
  {
    id: 'medical-checkups',
    title: 'Open medical check-ups',
    description: 'Accessible health checks and guidance brought into the communities we serve.',
    icon: RiHeartPulseLine,
    className: 'work-focus-health',
  },
  {
    id: 'orphanage-support',
    title: 'Orphanage-home support',
    description: 'Foodstuffs, Christmas gift packs, and needs-led assistance for children in registered homes.',
    icon: RiHomeHeartLine,
    className: 'work-focus-orphanage',
  },
];

const operatingMethod = [
  {
    title: 'Listen and verify',
    description: 'We work through trusted community relationships to understand a need before support is committed.',
  },
  {
    title: 'Plan and resource',
    description: 'The team defines the support, budget, people, and delivery plan required for each intervention.',
  },
  {
    title: 'Deliver with dignity',
    description: 'Support is organized around the people receiving it, with respect, clarity, and local context.',
  },
  {
    title: 'Document and follow up',
    description: 'We record what was delivered, report verified outcomes, and carry lessons into the next programme cycle.',
  },
];

const Programs: React.FC = () => {
  const { openDonationModal } = useDonationModal();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchPrograms = async () => {
      try {
        setLoading(true);
        setError(false);
        const response = await fetch('/api/programs?status=published', { signal: controller.signal });
        if (!response.ok) throw new Error('Programme feed unavailable');

        const data = (await response.json()) as Program[];
        const verifiedPrograms = Array.isArray(data)
          ? data.filter((program) => !program.id.startsWith('example-program-'))
          : [];
        setPrograms(verifiedPrograms);
      } catch (fetchError) {
        if ((fetchError as Error).name !== 'AbortError') {
          console.error('Error loading programmes:', fetchError);
          setError(true);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchPrograms();
    return () => controller.abort();
  }, []);

  const openProgrammeDonation = (title = 'Support our programmes') => {
    openDonationModal({
      source: 'programs-page',
      category: 'general',
      title,
      description: 'Help fund verified care and community support across our programme areas.',
    });
  };

  return (
    <>
      <SEOHead config={pageSEO.programs} />
      <main className="about-family-page work-page">
        <AboutHero
          eyebrow="Our work"
          title="Care built around real needs."
          description="Donor support becomes food relief, education, healthcare, and practical stability for vulnerable Nigerians."
          image="/images/nigerian-ngo/programs-operations-2026.webp"
          imageAlt="Nigerian volunteers preparing food, learning materials, and health supplies for community programmes"
          variant="story"
        >
          <ActionLink href="#programme-focus">Explore our work</ActionLink>
          <ActionButton tone="secondary" onClick={() => openProgrammeDonation()}>
            Support the work
          </ActionButton>
        </AboutHero>

        <section id="programme-focus" className="about-section work-focus-section">
          <div className="about-container">
            <header className="about-section-heading work-heading-offset">
              <p className="about-eyebrow">Programme focus</p>
              <h2>Support shaped by what people need now.</h2>
              <p>Our programme areas reflect the support the foundation has delivered since July 2025. Each intervention starts with a verified need.</p>
            </header>

            <div className="work-focus-grid">
              {focusAreas.map((area) => {
                const Icon = area.icon;
                return (
                  <article id={area.id} key={area.title} className={`work-focus-card ${area.className}`}>
                    <span className="work-icon" aria-hidden="true"><Icon /></span>
                    <div>
                      <h3>{area.title}</h3>
                      <p>{area.description}</p>
                    </div>
                  </article>
                );
              })}
            </div>

            <dl className="work-proof-strip" aria-label="Verified programme record">
              <div><dt>Since</dt><dd>July 2025</dd></div>
              <div><dt>September 2025 Orphans Outreach</dt><dd>Food support for 5 orphanage homes</dd></div>
              <div><dt>School fees supported</dt><dd>Divine Destiny Orphanage Home</dd></div>
            </dl>
          </div>
        </section>

        <section className="about-section work-published-section" aria-labelledby="published-programmes-title">
          <div className="about-container">
            <div className="work-section-intro">
              <header className="about-section-heading about-section-heading-compact">
                <p className="about-eyebrow">Published profiles</p>
                <h2 id="published-programmes-title">Programme details you can trust.</h2>
              </header>
              <p>Only reviewed programme profiles appear here. Drafts and demonstration records remain off the public website.</p>
            </div>

            {loading ? (
              <div className="work-loading-grid" aria-label="Loading programme profiles" aria-live="polite"><span /><span /></div>
            ) : error ? (
              <div className="work-state" role="alert">
                <span className="work-state-icon" aria-hidden="true"><RiRefreshLine /></span>
                <h3>Programme profiles could not be loaded.</h3>
                <p>The core programme information above remains available while we reconnect to the published feed.</p>
              </div>
            ) : programs.length === 0 ? (
              <div className="work-state">
                <span className="work-state-icon" aria-hidden="true"><RiHandHeartLine /></span>
                <h3>Programme profiles are being verified.</h3>
                <p>We will publish each profile after its scope, language, and supporting record have been reviewed.</p>
                <ActionLink href="/outreaches" tone="secondary">View outreach records</ActionLink>
              </div>
            ) : (
              <div className="work-programme-grid">
                {programs.map((program, index) => (
                  <article key={program.id} className={index === 0 ? 'work-programme-card work-programme-featured' : 'work-programme-card'}>
                    <DoubleBezel className="work-programme-bezel" coreClassName="work-programme-image" reveal={false}>
                      <Image
                        src={program.image || '/images/nigerian-ngo/programs-operations-2026.webp'}
                        alt={program.title}
                        fill
                        unoptimized={(program.image || '').startsWith('data:')}
                        sizes={index === 0 ? '(max-width: 767px) 100vw, 62vw' : '(max-width: 767px) 100vw, 42vw'}
                        className="object-cover"
                      />
                    </DoubleBezel>
                    <div className="work-programme-copy">
                      <p className="work-card-kicker">{program.category || 'Programme'}</p>
                      <h3>{program.title}</h3>
                      <p>{truncateForCard(program.description, 3)}</p>
                      {program.targetAudience && program.targetAudience.toLowerCase() !== 'general' && (
                        <p className="work-card-audience">For {program.targetAudience}</p>
                      )}
                      <div className="work-card-actions">
                        <ActionButton showArrow={false} onClick={() => openProgrammeDonation(`Support ${program.title}`)}>
                          Support this programme
                        </ActionButton>
                        <Link href={`/contact?subject=${encodeURIComponent(`Programme inquiry: ${program.title}`)}`}>Ask about this programme</Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="about-section work-method-section">
          <div className="about-container work-method-layout">
            <header className="about-section-heading work-method-heading">
              <p className="about-eyebrow">How we work</p>
              <h2>Careful before visible.</h2>
              <p>Good intentions need a responsible operating method. These principles guide each programme and outreach.</p>
            </header>

            <div className="work-method-list">
              {operatingMethod.map((item) => (
                <article key={item.title}>
                  <span aria-hidden="true"><RiHandHeartLine /></span>
                  <div><h3>{item.title}</h3><p>{item.description}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="about-closing">
          <div className="about-container about-closing-grid">
            <div>
              <h2>Help carry the next programme forward.</h2>
              <p>Give, volunteer, or partner with a Nigerian foundation committed to dignified and accountable support.</p>
            </div>
            <div className="about-closing-actions">
              <ActionButton tone="light" onClick={() => openProgrammeDonation()}>Donate to the work</ActionButton>
              <ActionLink href="/partner" tone="secondary">Become a partner</ActionLink>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export async function getStaticProps() {
  return { props: {}, revalidate: 3600 };
}

export default Programs;
