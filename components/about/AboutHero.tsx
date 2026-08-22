import React from 'react';
import Image from 'next/image';
import { DoubleBezel } from '@/components/home/HomePrimitives';

interface AboutHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  children: React.ReactNode;
  variant?: 'story' | 'impact';
}

const AboutHero: React.FC<AboutHeroProps> = ({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  children,
  variant = 'story',
}) => (
  <section className={`about-hero about-hero-${variant}`}>
    <div className="about-hero-orb about-hero-orb-purple" aria-hidden="true" />
    <div className="about-hero-orb about-hero-orb-green" aria-hidden="true" />

    <div className="about-container about-hero-grid">
      <div className="about-hero-copy">
        <p className="about-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="about-hero-description">{description}</p>
        <div className="about-hero-actions">{children}</div>
      </div>

      <DoubleBezel className="about-hero-bezel" coreClassName="about-hero-media" reveal={false}>
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          unoptimized={image.startsWith('data:')}
          sizes="(max-width: 767px) 100vw, 56vw"
          className="object-cover"
        />
      </DoubleBezel>
    </div>
  </section>
);

export default AboutHero;
