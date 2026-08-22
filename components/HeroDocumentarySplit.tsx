import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import {
  RiArrowRightUpLine,
  RiGraduationCapLine,
  RiGroupLine,
  RiHeart3Line,
  RiLineChartLine,
  RiMapPin2Line,
  RiShakeHandsLine,
} from 'react-icons/ri';
import { ComponentProps, DashboardStats } from '@/types';

interface HeroProps extends ComponentProps {
  title?: string;
  subtitle?: string;
  onDonateClick?: () => void;
  stats?: DashboardStats;
}

const featurePills = [
  { icon: RiHeart3Line, label: 'Orphan Care' },
  { icon: RiGroupLine, label: 'Widow Support' },
  { icon: RiGraduationCapLine, label: 'Education' },
  { icon: RiLineChartLine, label: 'Empowerment' },
  { icon: RiShakeHandsLine, label: 'Partnerships' },
  { icon: RiMapPin2Line, label: 'Nigeria' },
];

const HeroDocumentarySplit: React.FC<HeroProps> = ({
  className = '',
  title = 'Hope has a home.',
  subtitle = 'We support widows, orphans, and vulnerable families with practical care, opportunity, and dignity across Nigeria.',
  onDonateClick,
}) => {
  return (
    <section
      className={`relative min-h-[100dvh] overflow-hidden bg-[#f8faf9] pt-16 text-gray-900 ${className}`}
      aria-labelledby="home-hero-title"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_20%,rgba(167,243,208,0.30),transparent_28%),radial-gradient(circle_at_38%_82%,rgba(192,132,252,0.16),transparent_34%)]" />

      <div className="relative mx-auto grid min-h-[calc(100dvh-4rem)] max-w-[1600px] lg:grid-cols-[43%_57%]">
        <div className="relative flex w-full items-center overflow-hidden px-4 py-8 sm:px-10 sm:py-12 lg:px-12 lg:py-24 xl:px-20">
          <div className="hero-orb-drift pointer-events-none absolute -left-24 top-12 h-72 w-72 rounded-full bg-accent-300/30 blur-3xl" />
          <div className="hero-orb-drift hero-orb-drift-delayed pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-purple-400/20 blur-3xl" />

          <div className="relative z-10 max-w-xl">
            <div className="hero-reveal hero-reveal-kicker inline-flex rounded-full bg-gradient-to-r from-accent-500/20 via-purple-500/15 to-transparent p-px shadow-[0_10px_35px_rgba(91,33,182,0.08)]">
              <span className="rounded-full bg-white/90 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-700">
                Nigerian-led care
              </span>
            </div>

            <h1
              id="home-hero-title"
              className="hero-reveal hero-reveal-title mt-5 max-w-[10ch] font-display text-5xl font-bold leading-[0.98] tracking-[-0.055em] text-gray-950 sm:mt-7 sm:text-6xl xl:text-7xl"
            >
              {title}
            </h1>

            <p className="hero-reveal hero-reveal-copy mt-5 max-w-[32rem] text-lg leading-relaxed text-gray-600 sm:mt-7 sm:text-xl">
              {subtitle}
            </p>

            <div className="hero-reveal hero-reveal-actions mt-6 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={onDonateClick}
                className="group inline-flex min-h-12 items-center justify-between gap-4 whitespace-nowrap rounded-full bg-accent-700 py-1 pl-6 pr-1 text-base font-semibold text-white shadow-[0_18px_50px_rgba(4,120,87,0.22)] transition-[transform,background-color,box-shadow] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-accent-800 hover:shadow-[0_22px_60px_rgba(4,120,87,0.28)] focus:outline-none focus:ring-2 focus:ring-accent-600 focus:ring-offset-2 active:scale-[0.98] sm:min-w-[176px]"
              >
                <span>Donate Now</span>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-105">
                  <RiArrowRightUpLine aria-hidden="true" className="h-[18px] w-[18px]" />
                </span>
              </button>
              <Link
                href="/outreaches"
                className="group inline-flex min-h-12 items-center justify-between gap-4 whitespace-nowrap rounded-full bg-white py-1 pl-6 pr-1 text-base font-semibold text-gray-900 ring-1 ring-black/[0.08] shadow-[0_16px_50px_rgba(71,48,99,0.10)] transition-[transform,background-color,box-shadow] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-[0_20px_55px_rgba(71,48,99,0.14)] focus:outline-none focus:ring-2 focus:ring-accent-600 focus:ring-offset-2 active:scale-[0.98] sm:min-w-[176px]"
              >
                <span>See Our Work</span>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-950 text-white transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-105">
                  <RiArrowRightUpLine aria-hidden="true" className="h-[18px] w-[18px]" />
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div className="hero-media-reveal relative m-3 min-h-[36.5dvh] rounded-[2.25rem] bg-gray-950/[0.04] p-1.5 ring-1 ring-black/[0.05] shadow-[0_30px_100px_rgba(73,38,101,0.16)] sm:m-5 sm:min-h-[44dvh] sm:p-2 lg:m-6 lg:min-h-0">
          <div className="relative h-full min-h-[calc(36.5dvh-1.5rem)] overflow-hidden rounded-[calc(2.25rem-0.375rem)] bg-gray-100 shadow-[inset_0_1px_1px_rgba(255,255,255,0.55)] sm:min-h-[calc(44dvh-2rem)] lg:min-h-0">
            <Image
              src="/images/nigerian-ngo/hero-widows-outreach-2026.webp"
              alt="Saintlammy Foundation volunteers and widows gathered during the 2026 widows relief outreach in Lagos"
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 55vw"
              className="hero-media-image object-cover object-[52%_center]"
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-purple-950/40 via-transparent to-white/5" />
            <div className="hero-orb-drift pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-purple-500/30 blur-3xl" />
            <div className="hero-orb-drift hero-orb-drift-delayed pointer-events-none absolute -bottom-20 left-1/4 h-64 w-64 rounded-full bg-accent-400/25 blur-3xl" />

            <div className="absolute inset-x-5 bottom-5 hidden gap-2 sm:grid sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
              {featurePills.map(({ icon: Icon, label }, index) => (
                <div
                  key={label}
                  className="hero-pill-reveal rounded-full bg-white/20 p-1 ring-1 ring-white/35"
                  style={{ animationDelay: `${620 + index * 70}ms` }}
                >
                  <div className="flex min-h-10 items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-xs font-semibold text-gray-900 shadow-[inset_0_1px_1px_rgba(255,255,255,0.75),0_10px_30px_rgba(39,12,70,0.12)] sm:text-sm">
                    <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-accent-700" />
                    <span className="truncate">{label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroDocumentarySplit;
