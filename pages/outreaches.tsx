import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  RiBookOpenLine,
  RiCalendarEventLine,
  RiHandHeartLine,
  RiHeartPulseLine,
  RiHomeHeartLine,
  RiMapPin2Line,
  RiRefreshLine,
  RiTeamLine,
} from 'react-icons/ri';
import AboutHero from '@/components/about/AboutHero';
import { ActionButton, ActionLink, DoubleBezel } from '@/components/home/HomePrimitives';
import { useDonationModal } from '@/components/DonationModalProvider';
import SEOHead from '@/components/SEOHead';
import { pageSEO } from '@/lib/seo';
import { truncateForCard } from '@/lib/textUtils';

interface Outreach {
  id: string;
  title: string;
  date?: string;
  time?: string;
  location?: string;
  description?: string;
  image?: string;
  targetBeneficiaries?: number;
  beneficiaries?: number;
  volunteersNeeded?: number;
  status: string;
}

const outreachFocus = [
  {
    title: 'Food relief',
    description: 'Foodstuffs and household essentials organized around verified community needs.',
    icon: RiHandHeartLine,
    image: '/images/outreaches/q2-widows-2026/programme-relief-intake.webp',
  },
  {
    title: 'Orphanage support',
    description: 'Needs-led support for children and the homes responsible for their care.',
    icon: RiHomeHeartLine,
    image: '/images/nigerian-ngo/orphan-care.webp',
  },
  {
    title: 'Open medical check-ups',
    description: 'Community access to health checks, basic screening, and informed next steps.',
    icon: RiHeartPulseLine,
    image: '/images/nigerian-ngo/health-outreach.webp',
  },
  {
    title: 'Vulnerable homes',
    description: 'Practical intervention for households experiencing immediate hardship.',
    icon: RiBookOpenLine,
    image: '/images/outreaches/q2-widows-2026/beneficiary-listening.webp',
  },
];

const parseOutreachDate = (value?: string) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatOutreachDate = (value?: string) => {
  const date = parseOutreachDate(value);
  if (!date) return value || 'Date to be confirmed';
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

const cleanOutreachText = (value?: string) =>
  (value || '').replace(/\s*[—–]\s*/g, ': ').replace(/\s+/g, ' ').trim();

const outreachRecordImage = (outreach: Outreach) => {
  if (outreach.id === 'new-1786742411946') {
    return '/images/outreaches/q2-widows-2026/community-celebration.webp';
  }
  return outreach.image || '/images/nigerian-ngo/community-relief.webp';
};

const sortByDateDesc = (left: Outreach, right: Outreach) => {
  const leftDate = parseOutreachDate(left.date)?.getTime() || 0;
  const rightDate = parseOutreachDate(right.date)?.getTime() || 0;
  return rightDate - leftDate;
};

const Outreaches: React.FC = () => {
  const { openDonationModal } = useDonationModal();
  const [outreaches, setOutreaches] = useState<Outreach[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadOutreaches = async () => {
      try {
        setLoading(true);
        setLoadError(false);
        const responses = await Promise.all(
          ['upcoming', 'ongoing', 'completed'].map((status) =>
            fetch(`/api/outreaches?status=${status}`, { signal: controller.signal }),
          ),
        );

        if (responses.some((response) => !response.ok)) {
          throw new Error('One or more outreach feeds could not be loaded');
        }

        const collections = (await Promise.all(responses.map((response) => response.json()))) as Outreach[][];
        const records = new Map<string, Outreach>();
        collections.flat().forEach((outreach) => {
          if (outreach?.id) records.set(outreach.id, outreach);
        });
        setOutreaches(Array.from(records.values()));
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error loading outreaches:', error);
          setLoadError(true);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadOutreaches();
    return () => controller.abort();
  }, []);

  const { upcomingOutreaches, previousOutreaches } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcoming: Outreach[] = [];
    const previous: Outreach[] = [];

    outreaches.forEach((outreach) => {
      const status = outreach.status?.toLowerCase() || '';
      const date = parseOutreachDate(outreach.date);
      const isOngoing = status === 'ongoing';
      const isFuture = date ? date.getTime() >= today.getTime() : status === 'upcoming';
      if (isOngoing || isFuture) upcoming.push(outreach);
      else previous.push(outreach);
    });

    return {
      upcomingOutreaches: upcoming.sort((left, right) => {
        const leftDate = parseOutreachDate(left.date)?.getTime() || Number.MAX_SAFE_INTEGER;
        const rightDate = parseOutreachDate(right.date)?.getTime() || Number.MAX_SAFE_INTEGER;
        return leftDate - rightDate;
      }),
      previousOutreaches: previous.sort(sortByDateDesc),
    };
  }, [outreaches]);

  const openOutreachDonation = () => {
    openDonationModal({
      source: 'outreaches-page',
      category: 'outreach',
      title: 'Support the next outreach',
      description: 'Help fund verified community support, logistics, and essential supplies.',
    });
  };

  return (
    <>
      <SEOHead config={pageSEO.outreaches} />
      <main className="about-family-page work-page outreach-page">
        <AboutHero
          eyebrow="Community outreaches"
          title="Care that reaches communities."
          description="We bring practical care into Nigerian communities through organized, needs-led outreach."
          image="/images/nigerian-ngo/hero-widows-outreach-2026.webp"
          imageAlt="Widows and Saintlammy Foundation volunteers gathered during a Nigerian community relief outreach"
          variant="impact"
        >
          <ActionLink href="#upcoming-outreaches">See what is next</ActionLink>
          <ActionLink href="/volunteer" tone="secondary">Join as a volunteer</ActionLink>
        </AboutHero>

        <section className="about-section outreach-focus-section">
          <div className="about-container">
            <header className="about-section-heading work-heading-offset">
              <p className="about-eyebrow">Where we show up</p>
              <h2>Different needs. One standard of care.</h2>
              <p>Each outreach is shaped by its community, while dignity, preparation, and transparent reporting remain constant.</p>
            </header>

            <div className="outreach-focus-grid">
              {outreachFocus.map((area, index) => {
                const Icon = area.icon;
                return (
                  <article key={area.title} className={`outreach-focus-card outreach-focus-card-${index + 1}`}>
                    <Image src={area.image} alt="" fill sizes="(max-width: 767px) 100vw, 42vw" className="object-cover" />
                    <div className="outreach-focus-scrim" />
                    <span className="work-icon" aria-hidden="true"><Icon /></span>
                    <div className="outreach-focus-copy"><h3>{area.title}</h3><p>{area.description}</p></div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="upcoming-outreaches" className="about-section outreach-schedule-section">
          <div className="about-container">
            <div className="work-section-intro">
              <header className="about-section-heading about-section-heading-compact">
                <p className="about-eyebrow">Upcoming</p>
                <h2>Plan to take part.</h2>
              </header>
              <p>Only future-dated or actively ongoing outreaches appear here, even when an older dashboard status has not yet been updated.</p>
            </div>

            {loading ? (
              <div className="work-loading-grid work-loading-feature" aria-label="Loading upcoming outreaches" aria-live="polite"><span /><span /></div>
            ) : loadError ? (
              <div className="work-state" role="alert">
                <span className="work-state-icon" aria-hidden="true"><RiRefreshLine /></span>
                <h3>Upcoming outreach information is temporarily unavailable.</h3>
                <p>You can still register your interest and our team will follow up with current opportunities.</p>
                <ActionLink href="/volunteer" tone="secondary">Volunteer with us</ActionLink>
              </div>
            ) : upcomingOutreaches.length === 0 ? (
              <div className="work-state work-state-split">
                <div>
                  <span className="work-state-icon" aria-hidden="true"><RiCalendarEventLine /></span>
                  <h3>No upcoming outreach is published yet.</h3>
                  <p>Join the volunteer list or follow our updates to hear when the next date is confirmed.</p>
                </div>
                <div className="work-state-actions">
                  <ActionLink href="/volunteer">Register your interest</ActionLink>
                  <ActionLink href="/news" tone="secondary">Read updates</ActionLink>
                </div>
              </div>
            ) : (
              <div className="outreach-upcoming-list">
                {upcomingOutreaches.map((outreach) => (
                  <article key={outreach.id} className="outreach-upcoming-card">
                    <DoubleBezel className="outreach-upcoming-bezel" coreClassName="outreach-upcoming-image" reveal={false}>
                      <Image
                        src={outreachRecordImage(outreach)}
                        alt={cleanOutreachText(outreach.title)}
                        fill
                        unoptimized={outreachRecordImage(outreach).startsWith('data:')}
                        sizes="(max-width: 767px) 100vw, 48vw"
                        className="object-cover"
                      />
                    </DoubleBezel>
                    <div className="outreach-upcoming-copy">
                      <p className="work-card-kicker">{outreach.status === 'ongoing' ? 'In progress' : 'Upcoming outreach'}</p>
                      <h3>{cleanOutreachText(outreach.title)}</h3>
                      <p>{truncateForCard(cleanOutreachText(outreach.description), 3)}</p>
                      <div className="outreach-meta">
                        <span><RiCalendarEventLine />{formatOutreachDate(outreach.date)}</span>
                        {outreach.location && <span><RiMapPin2Line />{cleanOutreachText(outreach.location)}</span>}
                        {outreach.time && <span><RiTeamLine />{outreach.time}</span>}
                      </div>
                      <div className="work-card-actions">
                        <ActionLink href="/volunteer">Volunteer</ActionLink>
                        <ActionLink href={`/outreach/${outreach.id}`} tone="secondary">View details</ActionLink>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="about-section outreach-archive-section" aria-labelledby="outreach-records-title">
          <div className="about-container">
            <div className="work-section-intro">
              <header className="about-section-heading about-section-heading-compact">
                <p className="about-eyebrow">Previous records</p>
                <h2 id="outreach-records-title">See the work already delivered.</h2>
              </header>
              <p>Previous records are grouped by event date, so completed and older published outreaches remain easy to find.</p>
            </div>

            {loading ? (
              <div className="work-loading-grid" aria-label="Loading previous outreach records" aria-live="polite"><span /><span /><span /></div>
            ) : loadError ? (
              <div className="work-state" role="alert"><h3>Previous records could not be loaded.</h3><p>Please return shortly while we reconnect to the outreach archive.</p></div>
            ) : previousOutreaches.length === 0 ? (
              <div className="work-state"><h3>No previous outreach records are published.</h3><p>Verified reports will appear here as they are added through the foundation dashboard.</p></div>
            ) : (
              <div className="outreach-archive-grid">
                {previousOutreaches.map((outreach, index) => (
                  <article key={outreach.id} className={index === 0 ? 'outreach-record outreach-record-featured' : 'outreach-record'}>
                    <div className="outreach-record-image">
                      <Image
                        src={outreachRecordImage(outreach)}
                        alt={cleanOutreachText(outreach.title)}
                        fill
                        unoptimized={outreachRecordImage(outreach).startsWith('data:')}
                        sizes={index === 0 ? '(max-width: 767px) 100vw, 62vw' : '(max-width: 767px) 100vw, 34vw'}
                        className="object-cover"
                      />
                    </div>
                    <div className="outreach-record-copy">
                      <p className="work-card-kicker">{formatOutreachDate(outreach.date)}</p>
                      <h3>{cleanOutreachText(outreach.title)}</h3>
                      <p>{truncateForCard(cleanOutreachText(outreach.description), index === 0 ? 4 : 3)}</p>
                      <div className="outreach-meta">
                        {outreach.location && <span><RiMapPin2Line />{cleanOutreachText(outreach.location)}</span>}
                        {outreach.status && <span><RiCalendarEventLine />Published record</span>}
                      </div>
                      <Link className="work-text-link" href={`/outreach/${outreach.id}`}>Read the outreach record</Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="about-closing">
          <div className="about-container about-closing-grid">
            <div><h2>Make the next outreach possible.</h2><p>Bring your time, skills, or financial support to work that reaches vulnerable Nigerians directly.</p></div>
            <div className="about-closing-actions">
              <ActionButton tone="light" onClick={openOutreachDonation}>Support an outreach</ActionButton>
              <ActionLink href="/volunteer" tone="secondary">Volunteer with us</ActionLink>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Outreaches;
