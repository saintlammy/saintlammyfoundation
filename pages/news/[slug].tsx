import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';
import {
  RiArrowLeftLine,
  RiArrowRightUpLine,
  RiCalendarLine,
  RiHeart3Line,
  RiTimeLine,
} from 'react-icons/ri';
import SEOHead from '@/components/SEOHead';
import { ActionButton } from '@/components/home/HomePrimitives';
import { useDonationModal } from '@/components/DonationModalProvider';
import { getCanonicalUrl } from '@/lib/seo';

interface NewsArticle {
  id: string;
  slug?: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  image: string;
  readTime?: string;
  author?: string;
  tags?: string[];
}

interface NewsDetailProps {
  article: NewsArticle;
  relatedArticles: NewsArticle[];
}

const articlePath = (article: NewsArticle) => `/news/${article.slug || article.id}`;
const formatDate = (value: string) => new Date(value).toLocaleDateString('en-NG', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const NewsDetailPage: React.FC<NewsDetailProps> = ({ article, relatedArticles }) => {
  const { openDonationModal } = useDonationModal();

  return (
    <>
      <SEOHead config={{
        title: `${article.title} - News`,
        description: article.excerpt,
        image: article.image,
        url: getCanonicalUrl(articlePath(article)),
        type: 'article',
        author: article.author || 'Saintlammy Foundation Team',
        publishedTime: article.date,
        keywords: [...(article.tags || []), 'Saintlammy Foundation', 'Nigeria NGO'].join(', '),
      }} />
      <main className="editorial-page news-detail-page">
        <article>
          <header className="news-detail-header">
            <div className="editorial-container">
              <Link href="/news" className="news-detail-back"><RiArrowLeftLine aria-hidden="true" />All updates</Link>
              <div className="news-meta">
                <span>{article.category || 'Update'}</span>
                <time dateTime={article.date}><RiCalendarLine aria-hidden="true" />{formatDate(article.date)}</time>
                {article.readTime && <span className="news-detail-time"><RiTimeLine aria-hidden="true" />{article.readTime}</span>}
              </div>
              <h1>{article.title}</h1>
              <p>{article.excerpt}</p>
            </div>
          </header>

          <div className="editorial-container news-detail-image">
            <Image src={article.image} alt={article.title} fill priority sizes="(max-width: 767px) 100vw, 78rem" className="object-cover" />
          </div>

          <div className="editorial-container news-detail-layout">
            <aside>
              <span>Published by</span>
              <strong>{article.author || 'Saintlammy Foundation Team'}</strong>
              {(article.tags || []).length > 0 && (
                <div>{article.tags?.map((tag) => <span key={tag}>{tag}</span>)}</div>
              )}
            </aside>
            <div className="news-detail-content">
              {article.content ? (
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              ) : (
                <p>{article.excerpt}</p>
              )}
            </div>
          </div>
        </article>

        <section className="news-detail-support" aria-labelledby="news-detail-support-title">
          <div className="editorial-container">
            <RiHeart3Line aria-hidden="true" />
            <h2 id="news-detail-support-title">Help keep practical support moving.</h2>
            <p>Contributions help the foundation prepare and deliver verified outreach work across Nigeria.</p>
            <ActionButton onClick={() => openDonationModal({
              source: 'news-detail',
              category: article.category === 'outreach' ? 'outreach' : 'general',
              title: 'Support the foundation',
              description: `Support practical work connected to ${article.title}.`,
              storyId: article.id,
            })}>Make a donation</ActionButton>
          </div>
        </section>

        {relatedArticles.length > 0 && (
          <section className="news-detail-related" aria-labelledby="related-updates-title">
            <div className="editorial-container">
              <header><p className="editorial-eyebrow">Continue reading</p><h2 id="related-updates-title">Related updates</h2></header>
              <div>
                {relatedArticles.map((related) => (
                  <Link href={articlePath(related)} key={related.id}>
                    <span>{formatDate(related.date)}</span>
                    <h3>{related.title}</h3>
                    <RiArrowRightUpLine aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => ({ paths: [], fallback: 'blocking' });

export const getStaticProps: GetStaticProps<NewsDetailProps> = async ({ params }) => {
  const slug = params?.slug;
  if (typeof slug !== 'string') return { notFound: true };

  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/news?status=published`);
    if (!response.ok) return { notFound: true, revalidate: 300 };
    const data = await response.json();
    const articles: NewsArticle[] = Array.isArray(data) ? data : [];
    const article = articles.find((item) => item.slug === slug || item.id === slug);
    if (!article) return { notFound: true, revalidate: 300 };

    return {
      props: {
        article,
        relatedArticles: articles
          .filter((item) => item.id !== article.id && item.category === article.category)
          .slice(0, 3),
      },
      revalidate: 900,
    };
  } catch (error) {
    console.error('Error fetching news detail:', error);
    return { notFound: true, revalidate: 300 };
  }
};

export default NewsDetailPage;
