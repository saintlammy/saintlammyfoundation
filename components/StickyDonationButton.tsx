import React, { useEffect, useState } from 'react';
import { RiCloseLine, RiHeart3Line } from 'react-icons/ri';
import { ComponentProps } from '@/types';

interface StickyDonationButtonProps extends ComponentProps {
  onDonateClick?: () => void;
}

const StickyDonationButton: React.FC<StickyDonationButtonProps> = ({
  className = '',
  onDonateClick,
}) => {
  const [heroVisible, setHeroVisible] = useState(true);
  const [footerVisible, setFooterVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const hero = document.querySelector('.homepage-premium > section:first-of-type');
    const footer = document.querySelector('footer');
    if (!hero || !footer || !('IntersectionObserver' in window)) return;

    const heroObserver = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    const footerObserver = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { rootMargin: '240px 0px 0px', threshold: 0 }
    );

    heroObserver.observe(hero);
    footerObserver.observe(footer);
    return () => {
      heroObserver.disconnect();
      footerObserver.disconnect();
    };
  }, []);

  const isVisible = !heroVisible && !footerVisible && !isDismissed;
  if (!isVisible) return null;

  return (
    <aside className={`home-sticky-donation ${className}`} aria-label="Donation reminder">
      <div className="home-sticky-shell">
        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          className="home-sticky-dismiss"
          aria-label="Dismiss donation reminder"
        >
          <RiCloseLine />
        </button>
        <button
          type="button"
          onClick={onDonateClick}
          className="home-sticky-action group"
          aria-label="Make a donation to Saintlammy Foundation"
        >
          <span>Donate now</span>
          <span className="home-sticky-island" aria-hidden="true">
            <RiHeart3Line />
          </span>
        </button>
      </div>
    </aside>
  );
};

export default StickyDonationButton;
