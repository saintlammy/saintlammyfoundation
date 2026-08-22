import React from 'react';
import Image from 'next/image';
import {
  RiBankLine,
  RiCoinLine,
  RiFileList3Line,
  RiFundsLine,
  RiGlobalLine,
  RiHandHeartLine,
  RiHeart3Line,
  RiPaypalLine,
  RiShieldCheckLine,
} from 'react-icons/ri';
import SEOHead from '@/components/SEOHead';
import AboutHero from '@/components/about/AboutHero';
import { ActionButton, ActionLink, DoubleBezel } from '@/components/home/HomePrimitives';
import { useDonationModal } from '@/components/DonationModalProvider';
import { pageSEO } from '@/lib/seo';

const donationUses = [
  {
    title: 'Food and household relief',
    description: 'Practical support for widows and vulnerable families facing immediate needs.',
  },
  {
    title: 'Orphanage-home support',
    description: 'Foodstuffs, school-fee support and essential care delivered through verified homes.',
  },
  {
    title: 'Open medical check-ups',
    description: 'Community access to basic health checks, guidance and essential medicines.',
  },
  {
    title: 'Outreach delivery',
    description: 'Transport, preparation and field logistics that help essential support reach people safely.',
  },
];

const Donate: React.FC = () => {
  const { openDonationModal } = useDonationModal();

  const openDonation = (amount?: number, source = 'donate-page') => {
    openDonationModal({
      source,
      category: 'general',
      amount,
      title: 'Give with confidence',
      description: 'Choose an amount and a secure giving method to support practical work across Nigeria.',
    });
  };

  return (
    <>
      <SEOHead config={pageSEO.donate} />
      <main className="get-involved-page donation-page">
        <AboutHero
          eyebrow="Direct support"
          title="Give with confidence."
          description="Help fund practical support for vulnerable people and communities across Nigeria."
          image="/images/get-involved/donation-community-relief.webp"
          imageAlt="Nigerian volunteers presenting food relief supplies to women at a community centre"
          variant="story"
        >
          <ActionButton onClick={() => openDonation()} tone="primary">Make a donation</ActionButton>
          <ActionLink href="/transparency" tone="secondary">See our reporting</ActionLink>
        </AboutHero>

        <section className="donation-opening" aria-labelledby="donation-opening-title">
          <div className="involve-container donation-opening-grid">
            <div className="donation-opening-copy">
              <h2 id="donation-opening-title">A clear path from giving to support</h2>
              <p>
                Your donation helps the foundation plan, purchase and deliver practical assistance through verified outreaches and community partners.
              </p>
            </div>
            <div className="donation-start-panel">
              <div>
                <RiHandHeartLine aria-hidden="true" />
                <h3>Choose a starting amount</h3>
                <p>You can change the currency, frequency and payment method in the secure donation form.</p>
              </div>
              <div className="donation-amount-actions" aria-label="Suggested donation amounts in US dollars">
                {[25, 100, 250].map((amount) => (
                  <button key={amount} type="button" onClick={() => openDonation(amount, `donate-page-${amount}`)}>
                    ${amount}
                  </button>
                ))}
                <button type="button" onClick={() => openDonation(undefined, 'donate-page-custom')}>Custom amount</button>
              </div>
            </div>
          </div>
        </section>

        <section className="donation-use" aria-labelledby="donation-use-title">
          <div className="involve-container donation-use-grid">
            <DoubleBezel className="donation-use-bezel" coreClassName="donation-use-media" reveal={false}>
              <Image
                src="/images/outreaches/q2-widows-2026/food-relief-community.webp"
                alt="Women gathered with food relief supplies during a Saintlammy Foundation outreach"
                fill
                sizes="(max-width: 767px) 100vw, 47vw"
                className="object-cover"
              />
            </DoubleBezel>
            <div className="donation-use-copy">
              <p className="involve-eyebrow">Where support goes</p>
              <h2 id="donation-use-title">Practical help, delivered with dignity</h2>
              <div className="donation-use-list">
                {donationUses.map((item, index) => (
                  <article key={item.title}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <div><h3>{item.title}</h3><p>{item.description}</p></div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="donation-methods" aria-labelledby="donation-methods-title">
          <div className="involve-container donation-methods-grid">
            <div className="donation-methods-copy">
              <RiShieldCheckLine aria-hidden="true" />
              <h2 id="donation-methods-title">Use the method that works for you</h2>
              <p>The donation form keeps each payment path in one place and records the giving context for our reporting.</p>
              <ActionButton onClick={() => openDonation(undefined, 'donate-page-methods')} tone="primary">Open donation form</ActionButton>
            </div>
            <div className="donation-method-list">
              {[
                { icon: RiPaypalLine, title: 'PayPal', text: 'Give internationally with a PayPal balance, credit card or debit card.' },
                { icon: RiBankLine, title: 'Nigerian bank transfer', text: 'Send a one-time donation directly in Nigerian naira.' },
                { icon: RiCoinLine, title: 'Cryptocurrency', text: 'Give in supported digital currencies with network details shown before payment.' },
              ].map((method) => (
                <article key={method.title}>
                  <span className="involve-icon" aria-hidden="true"><method.icon /></span>
                  <div><h3>{method.title}</h3><p>{method.text}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="donation-accountability" aria-labelledby="donation-accountability-title">
          <div className="involve-container donation-accountability-grid">
            <div className="donation-accountability-number">
              <span>Approx.</span>
              <strong>$9,077</strong>
              <p>in donations received since inception</p>
            </div>
            <div className="donation-accountability-copy">
              <h2 id="donation-accountability-title">Giving deserves a record</h2>
              <p>
                Saintlammy Community Care Initiative is incorporated with Nigeria&apos;s Corporate Affairs Commission. We document donations and publish programme updates so supporters can follow the work.
              </p>
              <div className="donation-accountability-links">
                <ActionLink href="/transparency" tone="secondary">Review transparency</ActionLink>
                <ActionLink href="/outreaches" tone="secondary">View outreaches</ActionLink>
              </div>
            </div>
          </div>
        </section>

        <section className="donation-other" aria-labelledby="donation-other-title">
          <div className="involve-container donation-other-grid">
            <div>
              <h2 id="donation-other-title">Support can take many forms</h2>
              <p>Give your time, connect the foundation to resources or help more people understand the mission.</p>
            </div>
            <div className="donation-other-links">
              <ActionLink href="/volunteer" tone="secondary">Volunteer with us</ActionLink>
              <ActionLink href="/partner" tone="secondary">Discuss a partnership</ActionLink>
            </div>
            <div className="donation-other-marks" aria-label="Ways to support">
              <span><RiFundsLine aria-hidden="true" /> Fund</span>
              <span><RiGlobalLine aria-hidden="true" /> Connect</span>
              <span><RiFileList3Line aria-hidden="true" /> Follow</span>
              <span><RiHeart3Line aria-hidden="true" /> Serve</span>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Donate;
