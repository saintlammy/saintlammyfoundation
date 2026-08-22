import React from 'react';
import { DashboardStats } from '@/types';
import {
  RiArrowRightLine,
  RiCommunityLine,
  RiGraduationCapLine,
  RiHandHeartLine,
  RiHeart3Line,
  RiLineChartLine,
  RiMapPin2Line,
  RiMoneyDollarCircleLine,
  RiPulseLine,
  RiTeamLine,
} from 'react-icons/ri';
import { ActionButton, ActionLink, DoubleBezel, SectionHeading } from './HomePrimitives';

interface HomeEditorialSectionsProps {
  stats?: DashboardStats;
  onDonate: (context: { source: string; title: string; description: string }) => void;
}

const pillars = [
  {
    icon: RiHeart3Line,
    index: '01',
    title: 'Orphan care',
    description: 'Supporting orphanages and connecting children with dependable, long-term care.',
    tint: 'home-card-lilac',
  },
  {
    icon: RiTeamLine,
    index: '02',
    title: 'Widow empowerment',
    description: 'Food relief, stipends and livelihood support that rebuild financial independence.',
    tint: 'home-card-sage',
  },
  {
    icon: RiGraduationCapLine,
    index: '03',
    title: 'Educational access',
    description: 'Opening the door to quality learning and a more secure future for every child.',
    tint: 'home-card-sky',
  },
  {
    icon: RiMapPin2Line,
    index: '04',
    title: 'Community development',
    description: 'Medical outreach and practical support systems built around local realities.',
    tint: 'home-card-sand',
  },
];

const impactSteps = [
  {
    icon: RiHandHeartLine,
    number: '01',
    title: 'We listen first',
    description: 'Local partners help us identify genuine needs, understand context and reach families with dignity.',
  },
  {
    icon: RiMoneyDollarCircleLine,
    number: '02',
    title: 'We deliver directly',
    description: 'Funds become food, education, healthcare and livelihood support through accountable field teams.',
  },
  {
    icon: RiLineChartLine,
    number: '03',
    title: 'We report the outcome',
    description: 'Every programme is documented so donors can see the people reached and the change created.',
  },
];

export const FoundationIntroduction: React.FC = () => (
  <section className="home-section home-section-paper home-introduction">
    <div className="home-container">
      <div className="home-editorial-split">
        <SectionHeading
          eyebrow="The foundation"
          title={<>Compassion with <span className="home-ink-accent">structure.</span></>}
          description="A faith-driven Nigerian humanitarian initiative operating at the intersection of compassion, execution and accountable local action."
        />

        <div data-home-reveal className="home-intro-copy">
          <p>
            We restore dignity, stability and opportunity for orphans, widows and underserved communities through direct aid, empowerment programmes and transparent partnerships.
          </p>
          <div className="home-proof-line">
            <span>Faith-driven</span><i />
            <span>Community-led</span><i />
            <span>Outcome-focused</span>
          </div>
          <ActionLink href="/about" tone="secondary">Discover our story</ActionLink>
        </div>
      </div>

      <div className="home-bento home-bento-values">
        <DoubleBezel className="home-bento-mission" coreClassName="home-mission-card">
          <div className="home-card-icon"><RiCommunityLine /></div>
          <span className="home-card-index">OUR MISSION</span>
          <h3>No vulnerable home should stand alone.</h3>
          <p>
            From a small outreach team to a structured charity, we keep one promise: support should be personal, measurable and built to last.
          </p>
          <div className="home-mission-mark" aria-hidden="true">SCCI</div>
        </DoubleBezel>

        {pillars.map(({ icon: Icon, index, title, description, tint }) => (
          <DoubleBezel key={title} className="home-pillar-card" coreClassName={tint}>
            <div className="home-card-topline">
              <div className="home-card-icon"><Icon /></div>
              <span className="home-card-index">{index}</span>
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
          </DoubleBezel>
        ))}
      </div>
    </div>
  </section>
);

export const ImpactMethod: React.FC = () => (
  <section className="home-section home-section-ink">
    <div className="home-container">
      <SectionHeading
        eyebrow="How the work moves"
        title={<>A clear path from <span className="home-emerald-accent">need to impact.</span></>}
        description="Our model is deliberately simple: listen closely, act responsibly and show the result."
        inverse
      />

      <div className="home-impact-path">
        {impactSteps.map(({ icon: Icon, number, title, description }, index) => (
          <React.Fragment key={title}>
            <DoubleBezel className="home-impact-step" coreClassName="home-impact-step-core">
              <div className="home-card-topline">
                <span className="home-step-number">{number}</span>
                <div className="home-card-icon home-card-icon-dark"><Icon /></div>
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
            </DoubleBezel>
            {index < impactSteps.length - 1 && (
              <RiArrowRightLine className="home-path-arrow" aria-hidden="true" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  </section>
);

export const ImpactNumbers: React.FC<{ stats?: DashboardStats }> = ({ stats }) => {
  if (!stats) return null;

  const entries = [
    {
      label: 'Approx. donations since inception',
      value: '$9,077',
      detail: '$4,830 received in 2025 plus $4,247 received in 2026 so far.',
      icon: RiMoneyDollarCircleLine,
    },
    { label: 'Lives impacted', value: '120+', icon: RiHeart3Line },
    { label: 'Active programmes', value: stats.totalPrograms?.toLocaleString() || '0', icon: RiPulseLine },
    { label: 'Volunteers', value: '15', icon: RiTeamLine },
    { label: 'Partners', value: '20+', icon: RiHandHeartLine },
  ];

  return (
    <section className="home-section home-section-paper home-numbers-section">
      <div className="home-container">
        <div className="home-numbers-layout">
          <SectionHeading
            eyebrow="Measured impact"
            title={<>The numbers are part of the <span className="home-ink-accent">promise.</span></>}
            description="Transparency is not a report we publish later. It is how every programme is designed from day one."
          />
          <div className="home-numbers-grid">
            {entries.map(({ label, value, detail, icon: Icon }, index) => (
              <div key={label} data-home-reveal className={`home-number ${index === 0 ? 'home-number-primary' : ''}`}>
                <div className="home-number-icon"><Icon /></div>
                <strong>{value}</strong>
                <span>{label}</span>
                {detail && <small>{detail}</small>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const ClosingInvitation: React.FC<Pick<HomeEditorialSectionsProps, 'onDonate'>> = ({ onDonate }) => (
  <section className="home-section home-closing-section">
    <div className="home-container">
      <DoubleBezel coreClassName="home-closing-core">
        <div className="home-closing-orb home-closing-orb-one" />
        <div className="home-closing-orb home-closing-orb-two" />
        <div className="home-closing-content">
          <span className="home-eyebrow home-eyebrow-light">The next life changed can start here</span>
          <h2>There is room in this mission for you.</h2>
          <p>
            Give, volunteer or partner with us to help vulnerable people across Nigeria move from survival to stability.
          </p>
          <div className="home-closing-actions">
            <ActionButton
              tone="light"
              onClick={() => onDonate({
                source: 'general',
                title: 'Join Our Mission',
                description: 'Help us transform lives across Nigeria through your generous donation',
              })}
            >
              Donate today
            </ActionButton>
            <ActionLink href="/volunteer" tone="secondary">Become a volunteer</ActionLink>
          </div>
        </div>
      </DoubleBezel>
    </div>
  </section>
);
