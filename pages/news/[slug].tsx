import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { GetStaticProps, GetStaticPaths } from 'next';
import Navigation from '@/components/Navigation';
import Breadcrumb from '@/components/Breadcrumb';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useDonationModal } from '@/components/DonationModalProvider';
import { Calendar, Clock, User, ArrowRight, Share2, Facebook, Twitter, Linkedin, Tag, Heart } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import { getCanonicalUrl } from '@/lib/seo';

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: 'outreach' | 'achievement' | 'partnership' | 'update' | 'story';
  image: string;
  readTime: string;
  author: string;
  tags: string[];
}

interface NewsDetailProps {
  article: NewsArticle;
  relatedArticles: NewsArticle[];
}

const NewsDetailPage: React.FC<NewsDetailProps> = ({ article, relatedArticles }) => {
  const { openDonationModal } = useDonationModal();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'outreach':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'partnership':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'achievement':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'story':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `${article.title} - ${article.excerpt}`;

  const shareOnSocial = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);

    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    };

    window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400');
  };

  return (
    <>
      <SEOHead
        config={{
          title: `${article.title} - News`,
          description: article.excerpt,
          image: article.image,
          url: getCanonicalUrl(`/news/${article.id}`),
          type: 'article',
          author: article.author,
          publishedTime: article.date,
          keywords: `${article.tags.join(', ')}, Saintlammy Foundation, Nigeria charity, ${article.category}`
        }}
      />

      <Navigation onDonateClick={() => openDonationModal({
        source: 'newsletter',
        title: 'Support Our Work',
        description: 'Stay updated and support our ongoing humanitarian efforts'
      })} />

      <ErrorBoundary>
        <main className="min-h-screen bg-gray-900 pt-16">
          {/* Header */}
          <section className="py-8 bg-black">
            <div className="max-w-4xl mx-auto px-6">
              <Breadcrumb
                items={[
                  { label: 'News & Updates', href: '/news' },
                  { label: article.title, current: true }
                ]}
                className="mb-6"
              />
            </div>
          </section>

          {/* Article */}
          <article className="py-16 bg-gray-900">
            <div className="max-w-4xl mx-auto px-6">
              {/* Article Header */}
              <header className="mb-12">
                <div className="flex items-center space-x-4 mb-6">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(article.category)}`}>
                    {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                  </span>
                  <div className="flex items-center text-gray-400 text-sm space-x-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(article.date)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {article.readTime}
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      {article.author}
                    </div>
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 font-display tracking-tight leading-tight">
                  {article.title}
                </h1>

                <p className="text-xl text-gray-300 font-light leading-relaxed mb-8">
                  {article.excerpt}
                </p>

                {/* Share Buttons */}
                <div className="flex items-center space-x-4">
                  <span className="text-gray-400 text-sm">Share:</span>
                  <button
                    onClick={() => shareOnSocial('facebook')}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Facebook className="w-4 h-4" />
                    <span className="hidden sm:inline">Facebook</span>
                  </button>
                  <button
                    onClick={() => shareOnSocial('twitter')}
                    className="flex items-center space-x-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                    <span className="hidden sm:inline">Twitter</span>
                  </button>
                  <button
                    onClick={() => shareOnSocial('linkedin')}
                    className="flex items-center space-x-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span className="hidden sm:inline">LinkedIn</span>
                  </button>
                </div>
              </header>

              {/* Featured Image */}
              <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-12">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent"></div>
              </div>

              {/* Article Content */}
              <div className="prose prose-lg prose-invert max-w-none">
                <div className="text-gray-300 leading-relaxed space-y-6">
                  {/* This would be the full article content */}
                  <p>
                    This remarkable outreach program represents the largest single medical intervention our foundation has organized to date. Over the course of three days, our dedicated team of volunteers and medical professionals traveled to remote communities in Ogun State, bringing essential healthcare services directly to families who often lack access to basic medical care.
                  </p>

                  <p>
                    The program included comprehensive health screenings for children and adults, vaccination drives, distribution of essential medications, and educational workshops on preventive healthcare practices. Our medical team, consisting of doctors, nurses, and community health workers, worked tirelessly to ensure every family received the care they needed.
                  </p>

                  <blockquote className="border-l-4 border-accent-500 pl-6 my-8 bg-gray-800/30 p-6 rounded-r-lg">
                    <p className="text-accent-100 text-lg italic mb-4">
                      "When we saw the medical team arriving in our community, it felt like hope had come to us. My children had been sick for weeks, and we couldn't afford to travel to the nearest clinic. This program saved us."
                    </p>
                    <footer className="text-gray-400 text-sm">
                      — Mrs. Adunni, Beneficiary from Ogun State
                    </footer>
                  </blockquote>

                  <p>
                    The impact of this outreach extends far beyond the immediate medical care provided. By bringing healthcare directly to these communities, we're demonstrating our commitment to reaching the most vulnerable populations and ensuring that geographic barriers don't prevent access to essential services.
                  </p>

                  <p>
                    This program was made possible through the generous support of our donors and the tireless dedication of our volunteer team. As we look ahead, we're already planning our next medical outreach, with the goal of reaching even more communities across Nigeria.
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-gray-700">
                <div className="flex items-center space-x-2 mb-4">
                  <Tag className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-400 font-medium">Tags:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map(tag => (
                    <span
                      key={tag}
                      className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Call to Action */}
              <div className="mt-12 bg-gradient-to-r from-accent-500/10 to-accent-600/10 border border-accent-500/20 rounded-2xl p-8 text-center">
                <Heart className="w-12 h-12 text-accent-400 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-white mb-4 font-display">
                  Help Us Continue This Work
                </h3>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto font-light">
                  Your donation makes programs like this possible. Join us in bringing hope and healing to communities across Nigeria.
                </p>
                <button
                  onClick={() => openDonationModal({
                    source: 'story-page',
                    category: article.category === 'outreach' ? 'outreach' as const :
                              article.category === 'achievement' ? 'empowerment' as const :
                              article.category === 'partnership' ? 'infrastructure' as const : 'education' as const,
                    title: `Support ${article.category} Programs`,
                    description: `Help us continue the important work featured in "${article.title}"`,
                    suggestedAmount: article.category === 'outreach' ? 75 :
                                   article.category === 'achievement' ? 100 : 50,
                    storyId: article.id,
                    programType: article.category
                  })}
                  className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-3 rounded-full font-medium transition-colors"
                >
                  Support This Work
                </button>
              </div>
            </div>
          </article>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section className="py-16 bg-black">
              <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-2xl font-semibold text-white mb-8 font-display">Related Stories</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {relatedArticles.map(relatedArticle => (
                    <Link
                      key={relatedArticle.id}
                      href={`/news/${relatedArticle.id}`}
                      className="group bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden hover:bg-gray-800/70 transition-all duration-300"
                    >
                      <div className="relative h-48">
                        <Image
                          src={relatedArticle.image}
                          alt={relatedArticle.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-accent-400 transition-colors">
                          {relatedArticle.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4">
                          {formatDate(relatedArticle.date)}
                        </p>
                        <div className="flex items-center text-accent-400 text-sm font-medium">
                          Read More
                          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="text-center mt-12">
                  <Link
                    href="/news"
                    className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-full font-medium transition-colors"
                  >
                    <span>View All Articles</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </section>
          )}
        </main>
      </ErrorBoundary>
    </>
  );
};


export const getStaticPaths: GetStaticPaths = async () => {
  // In a real app, fetch all article slugs from your CMS/database
  const paths = [
    { params: { slug: 'december-medical-outreach-2024' } },
    { params: { slug: 'school-partnership-expansion-2024' } },
    { params: { slug: 'widow-empowerment-success-2024' } }
  ];

  return {
    paths,
    fallback: 'blocking' // Generate pages on-demand for other slugs
  };
};

export const getStaticProps: GetStaticProps<NewsDetailProps> = async ({ params }) => {
  const slug = params?.slug as string;

  // In a real app, fetch the article and related articles from your CMS/database
  const articles = [
    {
      id: 'december-medical-outreach-2024',
      title: 'December Medical Outreach Reaches 200+ Families',
      excerpt: 'Our largest medical outreach program provided free health screenings, medications, and health education to over 200 families in rural Ogun State.',
      content: '', // Full content would be here
      date: '2024-12-15',
      category: 'outreach' as const,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      readTime: '3 min read',
      author: 'Saintlammy Foundation Team',
      tags: ['medical outreach', 'rural communities', 'healthcare']
    },
    {
      id: 'school-partnership-expansion-2024',
      title: 'Partnership with Local Schools Expands Education Access',
      excerpt: 'New partnerships with 5 primary schools will provide educational materials, scholarships, and mentorship programs for 150 orphaned children.',
      content: '',
      date: '2024-12-10',
      category: 'partnership' as const,
      image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      readTime: '4 min read',
      author: 'Education Team',
      tags: ['education', 'partnerships', 'orphans']
    },
    {
      id: 'widow-empowerment-success-2024',
      title: 'Widow Empowerment Program Celebrates 50 New Businesses',
      excerpt: 'Through micro-loans and business training, 50 widows have successfully launched small businesses, achieving financial independence.',
      content: '',
      date: '2024-12-05',
      category: 'achievement' as const,
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      readTime: '2 min read',
      author: 'Empowerment Team',
      tags: ['widow empowerment', 'business', 'independence']
    }
  ];

  const article = articles.find(a => a.id === slug);

  if (!article) {
    return {
      notFound: true
    };
  }

  const relatedArticles = articles
    .filter(a => a.id !== slug && a.category === article.category)
    .slice(0, 3);

  return {
    props: {
      article,
      relatedArticles
    },
    revalidate: 3600
  };
};

export default NewsDetailPage;