import React from 'react';
import Link from 'next/link';
import { RiArrowRightUpLine } from 'react-icons/ri';

interface SectionHeadingProps {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  align?: 'left' | 'center';
  inverse?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  description,
  align = 'left',
  inverse = false,
}) => (
  <header
    data-home-reveal
    className={`home-section-heading ${align === 'center' ? 'home-section-heading-center' : ''} ${inverse ? 'home-section-heading-inverse' : ''}`}
  >
    <span className="home-eyebrow">{eyebrow}</span>
    <h2>{title}</h2>
    <p>{description}</p>
  </header>
);

interface ActionLinkProps {
  href: string;
  children: React.ReactNode;
  tone?: 'primary' | 'secondary' | 'light';
  className?: string;
}

export const ActionLink: React.FC<ActionLinkProps> = ({
  href,
  children,
  tone = 'primary',
  className = '',
}) => (
  <Link href={href} className={`home-action home-action-${tone} group ${className}`}>
    <span>{children}</span>
    <span className="home-action-island" aria-hidden="true">
      <RiArrowRightUpLine />
    </span>
  </Link>
);

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: 'primary' | 'secondary' | 'light' | 'urgent';
  showArrow?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  tone = 'primary',
  showArrow = true,
  className = '',
  type = 'button',
  ...props
}) => (
  <button type={type} className={`home-action home-action-${tone} group ${className}`} {...props}>
    <span>{children}</span>
    {showArrow && (
      <span className="home-action-island" aria-hidden="true">
        <RiArrowRightUpLine />
      </span>
    )}
  </button>
);

interface DoubleBezelProps {
  children: React.ReactNode;
  className?: string;
  coreClassName?: string;
  reveal?: boolean;
}

export const DoubleBezel: React.FC<DoubleBezelProps> = ({
  children,
  className = '',
  coreClassName = '',
  reveal = true,
}) => (
  <div data-home-reveal={reveal ? '' : undefined} className={`home-bezel ${className}`}>
    <div className={`home-bezel-core ${coreClassName}`}>{children}</div>
  </div>
);

