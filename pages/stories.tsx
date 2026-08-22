import React, { useEffect, useMemo, useState } from 'react';
import { GetStaticProps } from 'next';
import Image from 'next/image';
import {
  RiCalendarEventLine,
  RiMapPin2Line,
  RiSearch2Line,
  RiShieldLine,
} from 'react-icons/ri';
import SEOHead from '@/components/SEOHead';
import AboutHero from '@/components/about/AboutHero';
import { ActionButton, ActionLink, DoubleBezel } from '@/components/home/HomePrimitives';
import StoryDetailModal, { formatSupportedSince, ImpactStoryRecord } from '@/components/stories/StoryDetailModal';
import { useDonationModal } from '@/components/DonationModalProvider';
import { pageSEO } from '@/lib/seo';
import { truncateForCard } from '@/lib/textUtils';

interface StoriesPageProps {
  initialStories: ImpactStoryRecord[];
}

const categories = [
  { value: 'all', label: 'All stories' },
  { value: 'orphan', label: 'Orphan support' },
  { value: 'widow', label: 'Widow empowerment' },
  { value: 'community', label: 'Community support' },
];

const cleanDisplayCopy = (value: string) => value
  .replace(/[—–]/g, '-')
  .replace(/[1-9]️⃣/g, '')
  .replace(/[⸻￼]/g, '')
  .replace(/\s+/g, ' ')
  .trim();

const getCategoryLabel = (category: ImpactStoryRecord['category']) => (
  categories.find((item) => item.value === category)?.label || 'Community support'
);

const fallbackStories: ImpactStoryRecord[] = [
  {
    id: 'amara-fallback',
    name: 'Amara',
    age: 8,
    location: 'Lagos, Nigeria',
    story: 'Amara lost her parents when she was very young. Through our orphan support program, she receives education funding, healthcare, and consistent emotional support.',
    quote: 'I want to become a doctor and help other children. School makes me feel that my dream is possible.',
    image: '/images/nigerian-ngo/people/amara.webp',
    category: 'orphan',
    impact: 'Regular school attendance, dependable care, and renewed confidence in her future.',
    dateHelped: 'January 2026',
  },
  {
    id: 'grace-fallback',
    name: 'Grace',
    age: 35,
    location: 'Lagos, Nigeria',
    story: 'After losing her husband, Grace needed a dependable path to support her children. The widow empowerment program provides practical business support and ongoing guidance.',
    quote: 'The support gave me a way to keep moving forward for my children and to believe in my own ability again.',
    image: '/images/nigerian-ngo/people/grace.webp',
    category: 'widow',
    impact: 'Practical livelihood support and greater household stability.',
    dateHelped: 'October 2025',
  },
  {
    id: 'emmanuel-fallback',
    name: 'Emmanuel',
    age: 12,
    location: 'Lagos, Nigeria',
    story: 'Emmanuel is passionate about technology and learning. Consistent support gives him access to education, care, and the tools he needs to keep building his future.',
    quote: 'I enjoy learning how things work. I want to use technology to solve problems in my community.',
    image: '/images/nigerian-ngo/people/emmanuel.webp',
    category: 'orphan',
    impact: 'Continued access to education, learning resources, and dependable care.',
    dateHelped: 'February 2026',
  },
];

const StoriesPage: React.FC<StoriesPageProps> = ({ initialStories }) => {
  const { openDonationModal } = useDonationModal();
  const [stories, setStories] = useState<ImpactStoryRecord[]>(initialStories);
  const [loading, setLoading] = useState(initialStories.length === 0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedStory, setSelectedStory] = useState<ImpactStoryRecord | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/stories?status=published');
        if (!response.ok) throw new Error('Failed to fetch stories');

        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setStories(data);
          setFetchError(null);
        } else if (initialStories.length === 0) {
          setStories(fallbackStories);
          setFetchError('New impact stories are being prepared. Here are representative examples of our work.');
        }
      } catch (error) {
        console.error('Error fetching stories:', error);
        if (initialStories.length === 0) setStories(fallbackStories);
        setFetchError('Live story updates are temporarily unavailable. Existing stories remain available.');
      } finally {
        setLoading(false);
      }
    };

    void fetchStories();
  }, [initialStories.length]);

  const filteredStories = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return stories.filter((story) => {
      const categoryMatches = selectedCategory === 'all' || story.category === selectedCategory;
      const searchMatches = !query || [story.name, story.location, story.story]
        .some((value) => value.toLowerCase().includes(query));
      return categoryMatches && searchMatches;
    });
  }, [searchTerm, selectedCategory, stories]);

  const featuredStory = filteredStories[0];
  const remainingStories = filteredStories.slice(1);
  const heroImage = stories[0]?.image || '/images/nigerian-ngo/community-relief.webp';

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchTerm('');
  };

  const supportStory = (story: ImpactStoryRecord) => {
    setSelectedStory(null);
    openDonationModal({
      source: 'stories-page',
      category: story.category === 'community' ? 'outreach' : story.category,
      storyId: story.id,
      title: `Support work like ${story.name}'s`,
      description: 'Help fund consistent, dignified support for more people and households across Nigeria.',
    });
  };

  return (
    <>
      <SEOHead config={pageSEO.stories} />

      <main className="about-family-page stories-page">
        <AboutHero
          eyebrow="Impact stories"
          title="Every outcome has a name."
          description="Meet the people behind our mission and see what sustained, dignified support makes possible."
          image={heroImage}
          imageAlt="A person supported through Saintlammy Foundation's work in Nigeria"
          variant="impact"
        >
          <ActionLink href="#stories">Read the stories</ActionLink>
          <ActionButton
            tone="secondary"
            onClick={() => openDonationModal({
              source: 'stories-page-hero',
              category: 'general',
              title: 'Create the Next Impact Story',
              description: 'Help extend practical support to more vulnerable people across Nigeria.',
            })}
          >
            Support the work
          </ActionButton>
        </AboutHero>

        <section id="stories" className="stories-browser" aria-labelledby="stories-heading">
          <div className="about-container">
            <header className="about-section-heading about-section-heading-compact stories-heading">
              <h2 id="stories-heading">Lives changed through consistent care.</h2>
              <p>Search by name or location, or focus on the area of support that matters most to you.</p>
            </header>

            <div className="stories-toolbar">
              <label className="stories-search">
                <span>Search stories</span>
                <div>
                  <RiSearch2Line aria-hidden="true" />
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Name, place, or story"
                  />
                </div>
              </label>

              <div className="stories-category-filter">
                <span>Filter by program</span>
                <div role="group" aria-label="Filter stories by program">
                  {categories.map((category) => (
                    <button
                      key={category.value}
                      type="button"
                      aria-pressed={selectedCategory === category.value}
                      onClick={() => setSelectedCategory(category.value)}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="stories-results-meta" role="status">
              <span>{filteredStories.length} {filteredStories.length === 1 ? 'story' : 'stories'}</span>
              {fetchError && <p>{fetchError}</p>}
            </div>

            {loading && stories.length === 0 ? (
              <div className="stories-loading" aria-label="Loading impact stories">
                <span />
                <span />
                <span />
              </div>
            ) : filteredStories.length === 0 ? (
              <div className="stories-empty">
                <RiShieldLine aria-hidden="true" />
                <h3>No stories match those filters.</h3>
                <p>Try a different name, location, or program category.</p>
                <button type="button" onClick={clearFilters}>Clear filters</button>
              </div>
            ) : (
              <div className="stories-results">
                <article className="stories-featured">
                  <DoubleBezel className="stories-featured-bezel" coreClassName="stories-featured-image">
                    <Image
                      src={featuredStory.image}
                      alt={`Portrait of ${featuredStory.name} from ${featuredStory.location}`}
                      fill
                      unoptimized={featuredStory.image.startsWith('data:')}
                      sizes="(max-width: 767px) 100vw, 52vw"
                      className="object-cover object-top"
                    />
                  </DoubleBezel>

                  <div className="stories-featured-copy">
                    <span className="stories-category">{getCategoryLabel(featuredStory.category)}</span>
                    <h3>{featuredStory.name}{featuredStory.age ? `, ${featuredStory.age}` : ''}</h3>
                    <p className="stories-location"><RiMapPin2Line aria-hidden="true" />{featuredStory.location}</p>
                    <p>{cleanDisplayCopy(truncateForCard(featuredStory.story, 3))}</p>
                    <blockquote>&ldquo;{cleanDisplayCopy(truncateForCard(featuredStory.quote, 2))}&rdquo;</blockquote>
                    <div className="stories-featured-footer">
                      <span><RiCalendarEventLine aria-hidden="true" />Supported since {formatSupportedSince(featuredStory.dateHelped)}</span>
                      <button type="button" onClick={() => setSelectedStory(featuredStory)}>Read full story</button>
                    </div>
                  </div>
                </article>

                {remainingStories.length > 0 && (
                  <div className="stories-grid">
                    {remainingStories.map((story, index) => (
                      <article key={story.id} className="stories-card">
                        <div className="stories-card-image">
                          <Image
                            src={story.image}
                            alt={`Portrait of ${story.name} from ${story.location}`}
                            fill
                            unoptimized={story.image.startsWith('data:')}
                            loading={index > 1 ? 'lazy' : 'eager'}
                            sizes="(max-width: 767px) 100vw, 50vw"
                            className="object-cover object-top"
                          />
                        </div>
                        <div className="stories-card-copy">
                          <span className="stories-category">{getCategoryLabel(story.category)}</span>
                          <h3>{story.name}{story.age ? `, ${story.age}` : ''}</h3>
                          <p className="stories-location"><RiMapPin2Line aria-hidden="true" />{story.location}</p>
                          <p>{cleanDisplayCopy(truncateForCard(story.story, 2))}</p>
                          <button type="button" onClick={() => setSelectedStory(story)}>Read full story</button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="about-closing stories-closing">
          <div className="about-container about-closing-grid">
            <div>
              <h2>The next story can begin with you.</h2>
              <p>A donation can become medicine, school access, food relief, or the first step toward a stable livelihood.</p>
            </div>
            <div className="about-closing-actions">
              <ActionButton
                tone="light"
                onClick={() => openDonationModal({
                  source: 'stories-page-closing',
                  category: 'general',
                  title: 'Create the Next Impact Story',
                  description: 'Help create more stories of stability, dignity, and opportunity across Nigeria.',
                })}
              >
                Donate today
              </ActionButton>
              <ActionLink href="/volunteer" tone="secondary">Volunteer with us</ActionLink>
            </div>
          </div>
        </section>
      </main>

      <StoryDetailModal
        story={selectedStory}
        onClose={() => setSelectedStory(null)}
        onSupport={supportStory}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps<StoriesPageProps> = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/stories?status=published`);
    if (!response.ok) throw new Error('Stories request failed');
    const stories = await response.json() as ImpactStoryRecord[];
    const initialStories = Array.isArray(stories)
      ? stories.map((story) => ({
          ...story,
          image: story.image?.startsWith('data:')
            ? '/images/nigerian-ngo/portrait-widow.webp'
            : story.image,
        }))
      : [];

    return {
      props: { initialStories },
      revalidate: 3600,
    };
  } catch (error) {
    console.error('Error fetching stories during build:', error);
    return {
      props: { initialStories: fallbackStories },
      revalidate: 3600,
    };
  }
};

export default StoriesPage;
