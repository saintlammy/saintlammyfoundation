import React from 'react';
import Image from 'next/image';
import { RiCalendarEventLine, RiMapPin2Line, RiShieldLine } from 'react-icons/ri';
import LandingModal from '@/components/home/LandingModal';

export interface ImpactStoryRecord {
  id: string;
  name: string;
  age?: number;
  location: string;
  story: string;
  quote: string;
  image: string;
  category: 'orphan' | 'widow' | 'community';
  impact: string;
  dateHelped: string;
}

export const formatSupportedSince = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en-NG', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
};

interface StoryDetailModalProps {
  story: ImpactStoryRecord | null;
  onClose: () => void;
  onSupport: (story: ImpactStoryRecord) => void;
}

const cleanDisplayText = (value: string) => value
  .replace(/[—–]/g, '-')
  .replace(/[1-9]️⃣/g, '')
  .replace(/[⸻￼]/g, '')
  .trim();

const paragraphsFrom = (value: string) => cleanDisplayText(value)
  .split(/\n{2,}/)
  .map((paragraph) => paragraph.replace(/^\s*[•\t]+\s*/gm, '').trim())
  .filter(Boolean);

const StoryDetailModal: React.FC<StoryDetailModalProps> = ({ story, onClose, onSupport }) => {
  if (!story) return null;

  const categoryLabel = story.category === 'orphan'
    ? 'Orphan support'
    : story.category === 'widow'
      ? 'Widow support'
      : 'Community support';

  return (
    <LandingModal
      isOpen
      onClose={onClose}
      title={story.name}
      description="A closer look at the person, support, and outcome behind this story."
      eyebrow={categoryLabel}
      icon={<RiShieldLine />}
      size="xl"
      className="story-reader-modal"
      bodyClassName="story-reader-body"
    >
      <div className="story-reader-content">
        <div className="story-reader-image">
          <Image
            src={story.image}
            alt={`Portrait of ${story.name} from ${story.location}`}
            fill
            unoptimized={story.image.startsWith('data:')}
            sizes="(max-width: 767px) 100vw, 58rem"
            className="object-cover object-top"
          />
        </div>

        <div className="story-reader-meta" aria-label="Story details">
          <span><RiMapPin2Line aria-hidden="true" />{story.location}</span>
          <span><RiCalendarEventLine aria-hidden="true" />Supported since {formatSupportedSince(story.dateHelped)}</span>
          {story.age && <span>Age {story.age}</span>}
        </div>

        <div className="story-reader-prose">
          {paragraphsFrom(story.story).map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <blockquote className="story-reader-quote">
          <p>&ldquo;{cleanDisplayText(story.quote)}&rdquo;</p>
          <cite>{story.name}</cite>
        </blockquote>

        <section className="story-reader-impact" aria-labelledby="story-impact-heading">
          <h3 id="story-impact-heading">What the support changed</h3>
          {paragraphsFrom(story.impact).slice(0, 5).map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </section>
      </div>

      <div className="landing-modal-footer">
        <button className="landing-modal-primary" onClick={() => onSupport(story)}>
          Support similar work
        </button>
        <button className="landing-modal-secondary" onClick={onClose}>
          Close story
        </button>
      </div>
    </LandingModal>
  );
};

export default StoryDetailModal;
