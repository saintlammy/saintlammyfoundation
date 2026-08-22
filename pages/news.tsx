import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import {
  RiArrowDownLine,
  RiArrowRightUpLine,
  RiCalendarLine,
  RiFilter3Line,
  RiMailSendLine,
  RiNewspaperLine,
  RiSearchLine,
} from 'react-icons/ri';
import SEOHead from '@/components/SEOHead';
import AboutHero from '@/components/about/AboutHero';
import { ActionLink } from '@/components/home/HomePrimitives';
import { pageSEO } from '@/lib/seo';
import { truncateForCard } from '@/lib/textUtils';

interface NewsArticle {
  id: string;
  slug?: string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  category: string;
  image: string;
  readTime?: string;
  author?: string;
  tags?: string[];
  featured?: boolean;
}

interface NewsPageProps {
  articles: NewsArticle[];
}

type NewsletterState = 'idle' | 'submitting' | 'success' | 'error';

const articlePath = (article: NewsArticle) => `/news/${article.slug || article.id}`;

const formatDate = (value: string) => new Date(value).toLocaleDateString('en-NG', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const NewsPage: React.FC<NewsPageProps> = ({ articles: initialArticles }) => {
  const [articles, setArticles] = useState(initialArticles);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(initialArticles.length === 0);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [newsletterState, setNewsletterState] = useState<NewsletterState>('idle');
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const articlesPerPage = 8;

  useEffect(() => {
    const controller = new AbortController();

    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news?status=published', { signal: controller.signal });
        if (!response.ok) throw new Error('Published updates could not be loaded.');
        const data = await response.json();
        setArticles(Array.isArray(data) ? data : []);
        setFetchError(null);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        console.error('Error fetching news:', error);
        setFetchError('We could not refresh the news archive. Please try again shortly.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchNews();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const categories = useMemo(
    () => Array.from(new Set(articles.map((article) => article.category).filter(Boolean))),
    [articles],
  );

  const featuredArticle = articles.find((article) => article.featured) || articles[0];

  const filteredArticles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return articles.filter((article) => {
      const matchesSearch = !query
        || article.title.toLowerCase().includes(query)
        || (article.excerpt || '').toLowerCase().includes(query);
      const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [articles, searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const currentArticles = filteredArticles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage,
  );

  const subscribe = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = new FormData(form).get('email');
    if (typeof email !== 'string' || !email) return;

    setNewsletterState('submitting');
    setNewsletterMessage('');
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: '', source: 'news-page' }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || result.error || 'Subscription failed.');
      setNewsletterState('success');
      setNewsletterMessage(result.message || 'You are subscribed to foundation updates.');
      form.reset();
    } catch (error) {
      setNewsletterState('error');
      setNewsletterMessage(error instanceof Error ? error.message : 'Please try again.');
    }
  };

  return (
    <>
      <SEOHead config={pageSEO.news} />
      <main className="editorial-page news-editorial-page">
        <AboutHero
          eyebrow="News and updates"
          title="The work, documented."
          description="Outreach notes, programme milestones and verified updates from communities across Nigeria."
          image="/images/editorial/news-outreach-assembly.webp"
          imageAlt="Saintlammy Foundation volunteers and widows gathered after a community relief outreach in Lagos"
          variant="impact"
        >
          <a href="#news-archive" className="home-action home-action-primary group">
            <span>Browse updates</span>
            <span className="home-action-island" aria-hidden="true"><RiArrowDownLine /></span>
          </a>
          <ActionLink href="/outreaches" tone="secondary">View outreaches</ActionLink>
        </AboutHero>

        {fetchError && (
          <div className="editorial-notice" role="status">
            <RiNewspaperLine aria-hidden="true" />
            <span>{fetchError}</span>
          </div>
        )}

        {featuredArticle && !loading && (
          <section className="news-feature" aria-labelledby="featured-news-title">
            <div className="editorial-container">
              <p className="editorial-eyebrow">Latest update</p>
              <Link href={articlePath(featuredArticle)} className="news-feature-card">
                <div className="news-feature-media">
                  <Image
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    fill
                    sizes="(max-width: 767px) 100vw, 58vw"
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="news-feature-copy">
                  <div className="news-meta">
                    <span>{featuredArticle.category || 'Update'}</span>
                    <time dateTime={featuredArticle.date}>{formatDate(featuredArticle.date)}</time>
                  </div>
                  <h2 id="featured-news-title">{featuredArticle.title}</h2>
                  <p>{truncateForCard(featuredArticle.excerpt || '', 4)}</p>
                  <span className="news-read-link">Read the update <RiArrowRightUpLine aria-hidden="true" /></span>
                </div>
              </Link>
            </div>
          </section>
        )}

        <section id="news-archive" className="news-archive" aria-labelledby="news-archive-title">
          <div className="editorial-container">
            <header className="news-archive-heading">
              <div>
                <p className="editorial-eyebrow">Published archive</p>
                <h2 id="news-archive-title">Updates from the foundation</h2>
              </div>
              <p>Search by topic or narrow the archive by category.</p>
            </header>

            <div className="news-controls">
              <label className="news-search">
                <span className="sr-only">Search published updates</span>
                <RiSearchLine aria-hidden="true" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search published updates"
                />
              </label>
              <label className="news-filter">
                <span className="sr-only">Filter updates by category</span>
                <RiFilter3Line aria-hidden="true" />
                <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
                  <option value="all">All categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </label>
              <span className="news-count">{filteredArticles.length} published {filteredArticles.length === 1 ? 'update' : 'updates'}</span>
            </div>

            {loading ? (
              <div className="news-grid news-loading" aria-busy="true" aria-label="Loading published updates">
                {[0, 1, 2, 3].map((item) => <div key={item} />)}
              </div>
            ) : currentArticles.length > 0 ? (
              <div className="news-grid">
                {currentArticles.map((article, index) => (
                  <Link href={articlePath(article)} key={article.id} className={`news-card news-card-${(index % 4) + 1}`}>
                    <div className="news-card-media">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        sizes="(max-width: 767px) 100vw, (max-width: 1100px) 50vw, 38vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="news-card-copy">
                      <div className="news-meta">
                        <span>{article.category || 'Update'}</span>
                        <time dateTime={article.date}><RiCalendarLine aria-hidden="true" />{formatDate(article.date)}</time>
                      </div>
                      <h3>{article.title}</h3>
                      <p>{truncateForCard(article.excerpt || '', 3)}</p>
                      <span className="news-read-link">Read more <RiArrowRightUpLine aria-hidden="true" /></span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="editorial-empty">
                <RiNewspaperLine aria-hidden="true" />
                <h3>{articles.length === 0 ? 'No published updates yet' : 'No updates match your search'}</h3>
                <p>{articles.length === 0
                  ? 'The archive will show verified foundation news as soon as it is published.'
                  : 'Try a different keyword or view all categories.'}</p>
                {articles.length > 0 && (
                  <button type="button" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
                    Clear filters
                  </button>
                )}
              </div>
            )}

            {totalPages > 1 && (
              <nav className="news-pagination" aria-label="News archive pages">
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    aria-current={currentPage === page ? 'page' : undefined}
                    onClick={() => {
                      setCurrentPage(page);
                      document.getElementById('news-archive')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    {page}
                  </button>
                ))}
              </nav>
            )}
          </div>
        </section>

        <section className="news-subscribe" aria-labelledby="news-subscribe-title">
          <div className="editorial-container news-subscribe-inner">
            <div>
              <RiMailSendLine aria-hidden="true" />
              <p className="editorial-eyebrow">Foundation updates</p>
              <h2 id="news-subscribe-title">Keep the work in view.</h2>
              <p>Receive occasional outreach and programme updates by email.</p>
            </div>
            <form onSubmit={subscribe}>
              <label htmlFor="news-email">Email address</label>
              <div>
                <input id="news-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
                <button type="submit" disabled={newsletterState === 'submitting'}>
                  {newsletterState === 'submitting' ? 'Subscribing…' : 'Subscribe'}
                </button>
              </div>
              {newsletterMessage && (
                <p className={`news-subscribe-message news-subscribe-${newsletterState}`} role="status">{newsletterMessage}</p>
              )}
            </form>
          </div>
        </section>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps<NewsPageProps> = async () => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/news?status=published`);
    const data = response.ok ? await response.json() : [];
    return {
      props: { articles: Array.isArray(data) ? data : [] },
      revalidate: 900,
    };
  } catch (error) {
    console.error('Error fetching published news:', error);
    return { props: { articles: [] }, revalidate: 300 };
  }
};

export default NewsPage;
