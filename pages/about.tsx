import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  RiAwardLine,
  RiFocus3Line,
  RiGlobalLine,
  RiGroupLine,
  RiHeart3Line,
  RiLinkedinLine,
  RiShieldCheckLine,
} from 'react-icons/ri';
import SEOHead from '@/components/SEOHead';
import AboutHero from '@/components/about/AboutHero';
import { ActionButton, ActionLink, DoubleBezel } from '@/components/home/HomePrimitives';
import { useDonationModal } from '@/components/DonationModalProvider';
import { pageSEO } from '@/lib/seo';
import { truncateForCard } from '@/lib/textUtils';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
  linkedin: string;
}

interface Milestone {
  year: string;
  event: string;
  icon: string;
}

interface Value {
  title: string;
  description: string;
  icon: string;
}

interface HeroSection {
  title: string;
  subtitle: string;
  background_image: string;
}

interface StatementSection {
  title: string;
  content: string;
  tagline: string;
  icon: string;
}

interface StorySection {
  title: string;
  subtitle: string;
  paragraphs: string[];
}

interface AboutTestimonial {
  name: string;
  role: string;
  image: string;
  quote: string;
  duration: string;
  verified?: boolean;
}

type ContentState = 'loading' | 'ready' | 'error';

const fallbackHero: HeroSection = {
  title: 'About Our Mission',
  subtitle: 'Bringing hope, structure, and transformation to widows, orphans, and vulnerable communities across Nigeria.',
  background_image: '/images/nigerian-ngo/hero-widows-outreach-2026.webp',
};

const fallbackMission: StatementSection = {
  title: 'Our Mission',
  content: 'To provide comprehensive support to widows, orphans, and vulnerable individuals across Nigeria through sustainable programs that address immediate needs while building long-term capacity for self-sufficiency.',
  tagline: 'Every person deserves dignity, hope, and the opportunity to thrive regardless of their circumstances.',
  icon: 'Target',
};

const fallbackVision: StatementSection = {
  title: 'Our Vision',
  content: 'A Nigeria where no widow is forgotten, no orphan is left behind, and no vulnerable home stands alone. We envision thriving communities where love, support, and opportunity are accessible to all.',
  tagline: 'Through faith-driven action and sustainable solutions, we are building a future of hope and transformation.',
  icon: 'Heart',
};

const fallbackStory: StorySection = {
  title: 'Our Story',
  subtitle: 'From a shared conviction to a donor-backed mission rooted in community',
  paragraphs: [
    'Saintlammy Foundation began in July 2025, founded by Olamide Agboola from a deep conviction that every vulnerable person deserves dignity, support, and the opportunity to thrive. The Redeemed Christian Church of God (RCCG) served as our launchpad, giving the mission a trusted community base from which its first outreach and support efforts could be organized.',
    'From the outset, the work was made possible by local and international donors who believed in the mission and provided the resources to act. Their support helped turn a clear vision into coordinated outreach, direct relief, and a growing structure for accountable community care.',
    'As the work expanded, we strengthened our approach to transparency, accountability, and measurable impact. We also embraced modern giving options, including cryptocurrency, and digital reporting tools so donors can understand how contributions are used and the change they help create.',
    'In November 2025, we achieved a significant milestone: official incorporation as Saintlammy Community Care Initiative with the Corporate Affairs Commission of Nigeria (Registration No. 9015713, Tax ID: 33715150-0001). This formalization strengthens our capacity to serve and supports the long-term sustainability of our programs.',
    'Today, our story reflects what is possible when faith, a committed church community, and generous donors come together around a clear purpose. As we grow, we remain guided by the belief that no vulnerable home should stand alone and that hope truly has a home.',
  ],
};

const fallbackMilestones: Milestone[] = [
  { year: 'Jul 2025', event: 'Foundation launched from RCCG with support from local and international donors', icon: 'Heart' },
  { year: 'Aug 2025', event: 'Food relief outreach supported more than 30 widows in Lagos', icon: 'Users' },
  { year: 'Sep 2025', event: 'Orphans Outreach provided foodstuffs to five orphanage homes and full school-fee support for Divine Destiny Orphanage Home', icon: 'Award' },
  { year: 'Oct 2025', event: 'Open Medical Check-up Outreach provided accessible health screening and care', icon: 'Target' },
  { year: 'Nov 2025', event: 'Incorporated as Saintlammy Community Care Initiative (RC 9015713)', icon: 'Award' },
  { year: 'Dec 2025', event: 'Christmas Gift Packs Outreach brought seasonal care and gifts to orphans in orphanage homes', icon: 'Heart' },
  { year: 'Mar 2026', event: 'Q1 Vulnerable Homes Outreach delivered direct support to vulnerable households', icon: 'Home' },
  { year: 'Q2 2026', event: 'Widows relief outreach expanded direct support for vulnerable families', icon: 'Globe' },
];

const fallbackValues: Value[] = [
  { title: 'Transparency', description: 'Every donation is tracked and documented. We believe in complete financial transparency.', icon: 'Target' },
  { title: 'Faith-Driven', description: 'Rooted in Christian values, guided by compassion and service to those in need.', icon: 'Heart' },
  { title: 'Community Impact', description: 'We focus on sustainable, long-term change that empowers communities.', icon: 'Users' },
  { title: 'Accountability', description: 'Regular reporting shows how donations create practical, measurable impact.', icon: 'Award' },
];

const fallbackTestimonials: AboutTestimonial[] = [];

const fallbackTeam: TeamMember[] = [
  {
    name: 'Olamide Agboola',
    role: 'Founder & Executive Director',
    image: '',
    bio: 'Founded Saintlammy Foundation in July 2025 and leads its donor-backed mission to serve widows, orphans, and vulnerable households.',
    linkedin: '#',
  },
  {
    name: 'Peter Adinoyi Onuachi',
    role: 'Program Director',
    image: '',
    bio: 'Coordinates program planning and delivery for outreaches serving widows, orphans, and vulnerable households.',
    linkedin: '#',
  },
  {
    name: 'Victoria Agboola',
    role: 'Co-founder & Operations Manager',
    image: '',
    bio: 'Co-founded Saintlammy Foundation and oversees operations, logistics, and the responsible delivery of its programs.',
    linkedin: '#',
  },
];

const iconMap = {
  Heart: RiHeart3Line,
  Users: RiGroupLine,
  Target: RiFocus3Line,
  Award: RiAwardLine,
  Globe: RiGlobalLine,
};

const cleanDisplayCopy = (value: string) => value.replace(/[—–]/g, '-');

const About: React.FC = () => {
  const { openDonationModal } = useDonationModal();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [values, setValues] = useState<Value[]>([]);
  const [hero, setHero] = useState<HeroSection | null>(null);
  const [mission, setMission] = useState<StatementSection | null>(null);
  const [vision, setVision] = useState<StatementSection | null>(null);
  const [story, setStory] = useState<StorySection | null>(null);
  const [testimonials, setTestimonials] = useState<AboutTestimonial[]>([]);
  const [contentState, setContentState] = useState<ContentState>('loading');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const sections = ['team', 'milestones', 'values', 'hero', 'mission', 'vision', 'story', 'testimonials'];
        const responses = await Promise.all(
          sections.map((section) => fetch(`/api/page-content?slug=about&section=${section}`))
        );

        if (responses.some((response) => !response.ok)) {
          throw new Error('One or more About page sections could not be loaded');
        }

        const [teamData, milestonesData, valuesData, heroData, missionData, visionData, storyData, testimonialsData] = await Promise.all(
          responses.map((response) => response.json())
        );

        if (teamData.length) setTeamMembers(teamData.map((item: { data: TeamMember }) => item.data));
        if (milestonesData.length) setMilestones(milestonesData.map((item: { data: Milestone }) => item.data));
        if (valuesData.length) setValues(valuesData.map((item: { data: Value }) => item.data));
        if (heroData.length) setHero(heroData[0].data);
        if (missionData.length) setMission(missionData[0].data);
        if (visionData.length) setVision(visionData[0].data);
        if (storyData.length) setStory(storyData[0].data);
        if (testimonialsData.length) setTestimonials(testimonialsData.map((item: { data: AboutTestimonial }) => item.data));
        setContentState('ready');
      } catch (error) {
        console.error('Error fetching About page content:', error);
        setContentState('error');
      }
    };

    void fetchContent();
  }, []);

  const displayHero = hero || fallbackHero;
  const displayMission = mission || fallbackMission;
  const displayVision = vision || fallbackVision;
  const displayStory = story || fallbackStory;
  const displayMilestones = milestones.length ? milestones : fallbackMilestones;
  const displayValues = values.length ? values : fallbackValues;
  const displayTestimonials = (testimonials.length ? testimonials : fallbackTestimonials)
    .filter((testimonial) => testimonial.verified === true);
  const displayTeam = teamMembers.length ? teamMembers : fallbackTeam;

  return (
    <>
      <SEOHead config={pageSEO.about} />

      <main className="about-family-page">
        <AboutHero
          eyebrow="Our foundation"
          title={cleanDisplayCopy(displayHero.title)}
          description={cleanDisplayCopy(displayHero.subtitle)}
          image={displayHero.background_image || fallbackHero.background_image}
          imageAlt="Saintlammy Foundation supporting women and families during a community outreach in Nigeria"
        >
          <ActionLink href="#story">Explore our story</ActionLink>
          <ActionLink href="/stories" tone="secondary">See our impact</ActionLink>
        </AboutHero>

        {contentState === 'error' && (
          <div className="about-container about-content-note" role="status">
            Live profile updates are temporarily unavailable. Core foundation information remains available below.
          </div>
        )}

        <section className="about-section about-beliefs" aria-labelledby="beliefs-heading">
          <div className="about-container">
            <header className="about-section-heading">
              <p className="about-eyebrow">Why we exist</p>
              <h2 id="beliefs-heading">Care with direction.</h2>
              <p>Immediate relief matters. So does building the stability that helps a household move forward.</p>
            </header>

            <div className="about-beliefs-grid">
              <article className="about-belief about-belief-primary">
                <RiFocus3Line aria-hidden="true" />
                <h3>{cleanDisplayCopy(displayMission.title)}</h3>
                <p>{cleanDisplayCopy(displayMission.content)}</p>
                <strong>{cleanDisplayCopy(displayMission.tagline)}</strong>
              </article>

              <article className="about-belief about-belief-secondary">
                <RiHeart3Line aria-hidden="true" />
                <h3>{cleanDisplayCopy(displayVision.title)}</h3>
                <p>{cleanDisplayCopy(displayVision.content)}</p>
                <strong>{cleanDisplayCopy(displayVision.tagline)}</strong>
              </article>
            </div>
          </div>
        </section>

        <section id="story" className="about-section about-story-section" aria-labelledby="story-heading">
          <div className="about-container about-story-grid">
            <div className="about-story-intro">
              <p className="about-eyebrow">How it began</p>
              <h2 id="story-heading">{cleanDisplayCopy(displayStory.title)}</h2>
              <p>{cleanDisplayCopy(displayStory.subtitle)}</p>
              <DoubleBezel className="about-story-image-bezel" coreClassName="about-story-image">
                <Image
                  src="/images/nigerian-ngo/volunteer-team.webp"
                  alt="Nigerian volunteers preparing relief supplies for a Saintlammy Foundation outreach"
                  fill
                  sizes="(max-width: 767px) 100vw, 42vw"
                  className="object-cover"
                />
              </DoubleBezel>
            </div>

            <div className="about-story-prose">
              {displayStory.paragraphs.map((paragraph, index) => (
                <p key={index}>{cleanDisplayCopy(paragraph)}</p>
              ))}

              <aside className="about-registration">
                <RiShieldCheckLine aria-hidden="true" />
                <div>
                  <strong>Registered Nigerian nonprofit</strong>
                  <span>Saintlammy Community Care Initiative, RC 9015713</span>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="about-section about-journey" aria-labelledby="journey-heading">
          <div className="about-container">
            <header className="about-section-heading about-section-heading-compact">
              <h2 id="journey-heading">A mission taking shape.</h2>
              <p>Each milestone marks a stronger structure for serving people with consistency and care.</p>
            </header>

            {contentState === 'loading' ? (
              <div className="about-journey-skeleton" aria-label="Loading foundation milestones">
                {[0, 1, 2, 3, 4].map((item) => <span key={item} />)}
              </div>
            ) : (
              <ol className="about-journey-track">
                {displayMilestones.map((milestone, index) => {
                  const Icon = iconMap[milestone.icon as keyof typeof iconMap] || RiHeart3Line;
                  return (
                    <li key={`${milestone.year}-${index}`}>
                      <Icon aria-hidden="true" />
                      <strong>{milestone.year}</strong>
                      <p>{cleanDisplayCopy(milestone.event)}</p>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        </section>

        <section className="about-section about-values" aria-labelledby="values-heading">
          <div className="about-container">
            <header className="about-section-heading about-section-heading-compact">
              <h2 id="values-heading">What holds the work together.</h2>
              <p>Our values guide how support is delivered, documented, and sustained.</p>
            </header>

            {contentState === 'loading' ? (
              <div className="about-values-skeleton" aria-label="Loading foundation values">
                {[0, 1, 2, 3].map((item) => <span key={item} />)}
              </div>
            ) : (
              <div className="about-values-grid">
                {displayValues.map((value, index) => {
                  const Icon = iconMap[value.icon as keyof typeof iconMap] || RiHeart3Line;
                  return (
                    <article key={value.title} className={`about-value about-value-${index + 1}`}>
                      {index === 2 && (
                        <Image
                          src="/images/nigerian-ngo/about-adire-textile.webp"
                          alt="Purple and green Nigerian adire-inspired textile"
                          fill
                          sizes="(max-width: 767px) 100vw, 48vw"
                          className="about-value-textile"
                        />
                      )}
                      <div className="about-value-content">
                        <Icon aria-hidden="true" />
                        <h3>{cleanDisplayCopy(value.title)}</h3>
                        <p>{cleanDisplayCopy(value.description)}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section id="testimonials" className="about-section about-testimonials" aria-labelledby="testimonials-heading">
          <div className="about-container">
            <header className="about-section-heading about-section-heading-compact">
              <h2 id="testimonials-heading">Trust starts with the truth.</h2>
              <p>We publish first-person accounts only after the support described has been verified and the contributor has given consent.</p>
            </header>

            {displayTestimonials.length > 0 ? (
              <div className="about-testimonial-layout">
                <blockquote className="about-testimonial-featured">
                  <span className="about-testimonial-mark" aria-hidden="true">&ldquo;</span>
                  <p>{cleanDisplayCopy(truncateForCard(displayTestimonials[0].quote, 3))}</p>
                  <footer>
                    <strong>{displayTestimonials[0].name}</strong>
                    <span>{displayTestimonials[0].role}</span>
                    <small>{displayTestimonials[0].duration}</small>
                  </footer>
                </blockquote>

                {displayTestimonials.length > 1 && (
                <div className="about-testimonial-supporting">
                  {displayTestimonials.slice(1).map((testimonial) => (
                    <blockquote key={`${testimonial.name}-${testimonial.role}`} className="about-testimonial-compact">
                      <p>&ldquo;{cleanDisplayCopy(truncateForCard(testimonial.quote, 3))}&rdquo;</p>
                      <footer>
                        <strong>{testimonial.name}</strong>
                        <span>{testimonial.role}</span>
                        <small>{testimonial.duration}</small>
                      </footer>
                    </blockquote>
                  ))}
                </div>
                )}
              </div>
            ) : (
              <div className="about-verified-record">
                <div className="about-verified-copy">
                  <h3>Documented support, clearly stated.</h3>
                  <p>Verified first-person accounts will be added after the person or organisation involved approves the words attributed to them.</p>
                </div>
                <aside>
                  <span>September 2025 Orphans Outreach</span>
                  <strong>Divine Destiny Orphanage Home</strong>
                  <p>Received full school-fee support during an outreach that also provided foodstuffs to five orphanage homes.</p>
                  <ActionLink href="/stories" tone="secondary">Read verified stories</ActionLink>
                </aside>
              </div>
            )}
          </div>
        </section>

        <section className="about-section about-team" aria-labelledby="team-heading">
          <div className="about-container about-team-grid">
            <DoubleBezel className="about-team-photo-bezel" coreClassName="about-team-photo">
              <Image
                src="/images/nigerian-ngo/hero-widows-outreach-2026.webp"
                alt="Saintlammy Foundation volunteers and widows gathered after a relief outreach in Lagos"
                fill
                sizes="(max-width: 767px) 100vw, 46vw"
                className="object-cover"
              />
            </DoubleBezel>

            <div className="about-team-roster">
              <header className="about-section-heading about-section-heading-compact">
                <h2 id="team-heading">People behind the promise.</h2>
                <p>A Nigerian-led team coordinating programs, partnerships, and responsible delivery.</p>
              </header>

              <div className="about-team-list">
                {displayTeam.map((member) => (
                  <article key={member.name}>
                    <div>
                      <h3>{member.name}</h3>
                      <span>{member.role}</span>
                    </div>
                    <p>{cleanDisplayCopy(member.bio)}</p>
                    {member.linkedin && member.linkedin !== '#' && (
                      <a href={member.linkedin} aria-label={`Connect with ${member.name} on LinkedIn`}>
                        <RiLinkedinLine aria-hidden="true" />
                        LinkedIn
                      </a>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="about-closing">
          <div className="about-container about-closing-grid">
            <div>
              <h2>Help the next household move forward.</h2>
              <p>Your support funds practical care, education, healthcare, and livelihood opportunities across Nigeria.</p>
            </div>
            <div className="about-closing-actions">
              <ActionButton
                tone="light"
                onClick={() => openDonationModal({
                  source: 'about-page',
                  title: 'Support Our Mission',
                  description: 'Help us continue transforming lives through education, healthcare, and empowerment programs.',
                })}
              >
                Donate today
              </ActionButton>
              <ActionLink href="/volunteer" tone="secondary">Become a volunteer</ActionLink>
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

export default About;
