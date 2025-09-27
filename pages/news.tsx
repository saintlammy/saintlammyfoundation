import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { GetStaticProps } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useDonationModal } from '@/components/DonationModalProvider';
import { Calendar, ArrowRight, Heart, Users, Award, Search, Filter, Tag } from 'lucide-react';

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
  featured?: boolean;
}

interface NewsPageProps {
  articles: NewsArticle[];
  categories: string[];
}

const NewsPage: React.FC<NewsPageProps> = ({ articles, categories }) => {
  const { openDonationModal } = useDonationModal();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 9;

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const currentArticles = filteredArticles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );

  const featuredArticle = articles.find(article => article.featured);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'outreach':
        return Heart;
      case 'partnership':
        return Users;
      case 'achievement':
        return Award;
      default:
        return Calendar;
    }
  };

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
        return 'bg-gray-500/20 text-gray-500 dark:text-gray-400 border-gray-500/30';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <Head>
        <title>News & Updates - Saintlammy Foundation</title>
        <meta
          name="description"
          content="Stay updated with the latest news, outreach activities, achievements, and stories from Saintlammy Foundation's work across Nigeria."
        />
        <meta name="keywords" content="charity news, Nigeria nonprofit updates, orphan support news, widow empowerment stories, community outreach" />
        <link rel="canonical" href="https://www.saintlammyfoundation.org/news" />
      </Head>

      <ErrorBoundary>
          <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
          {/* Header Section */}
          <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-black">
            <div className="max-w-7xl mx-auto px-6">
              <Breadcrumb
                items={[{ label: 'News & Updates', current: true }]}
                className="mb-8"
              />

              <div className="text-center">
                <h1 className="text-display-lg md:text-display-xl font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
                  News & Updates
                </h1>
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                  Follow our journey as we transform lives across Nigeria. Read about our latest outreach programs, partnerships, achievements, and the inspiring stories of those we serve.
                </p>
              </div>
            </div>
          </section>

          {/* Featured Article */}
          {featuredArticle && (
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
              <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8 font-display">Featured Story</h2>
                <div className="bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden hover:bg-gray-100 dark:bg-gray-800/70 transition-all duration-300">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="relative h-64 lg:h-full">
                      <Image
                        src={featuredArticle.image}
                        alt={featuredArticle.title}
                        fill
                        className="object-cover"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-900/60 lg:bg-gradient-to-r"></div>
                    </div>
                    <div className="p-8 lg:p-12">
                      <div className="flex items-center space-x-4 mb-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(featuredArticle.category)}`}>
                          Featured
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm">{formatDate(featuredArticle.date)}</span>
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4 font-display">
                        {featuredArticle.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 font-light leading-relaxed">
                        {featuredArticle.excerpt}
                      </p>
                      <Link
                        href={`/news/${featuredArticle.id}`}
                        className="inline-flex items-center space-x-2 bg-accent-500 hover:bg-accent-600 text-gray-900 dark:text-white px-6 py-3 rounded-full font-medium transition-colors"
                      >
                        <span>Read Full Story</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Search and Filter */}
          <section className="py-8 bg-white dark:bg-black">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Search */}
                <div className="relative flex-grow max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Results Count */}
              <div className="mt-4 text-gray-500 dark:text-gray-400 text-sm">
                Showing {currentArticles.length} of {filteredArticles.length} articles
              </div>
            </div>
          </section>

          {/* Articles Grid */}
          <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentArticles.map((article, index) => {
                  const CategoryIcon = getCategoryIcon(article.category);

                  return (
                    <Link
                      href={`/news/${article.id}`}
                      key={article.id}
                      className="group block bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden hover:bg-gray-100 dark:bg-gray-800/70 hover:border-gray-600 transition-all duration-300 cursor-pointer"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>

                        <div className="absolute top-4 left-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(article.category)}`}>
                            <CategoryIcon className="w-3 h-3 mr-1" />
                            {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                          </span>
                        </div>

                        <div className="absolute bottom-4 right-4">
                          <span className="bg-white dark:bg-black/60 backdrop-blur-sm text-gray-900 dark:text-white text-xs px-2 py-1 rounded-full">
                            {article.readTime}
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(article.date)}
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 font-display group-hover:text-accent-400 transition-colors line-clamp-2">
                          {article.title}
                        </h3>

                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 font-light line-clamp-3">
                          {article.excerpt}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center text-accent-400 hover:text-accent-300 font-medium text-sm group/link transition-colors">
                            Read More
                            <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
                          </span>

                          <div className="flex items-center space-x-1">
                            {article.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400">
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <div className="flex items-center space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-accent-500 text-gray-900 dark:text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Newsletter CTA */}
          <section className="py-16 bg-white dark:bg-black">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 font-display">
                Stay Updated
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8 font-light">
                Subscribe to our newsletter to receive the latest updates on our programs and impact stories.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const email = (e.target as HTMLFormElement).email.value;
                  if (email) {
                    alert('Thank you for subscribing! You will receive updates on our latest news and impact stories.');
                    (e.target as HTMLFormElement).reset();
                  }
                }}
                className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto"
              >
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  className="flex-grow px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
                <button
                  type="submit"
                  className="bg-accent-500 hover:bg-accent-600 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </section>
          </main>
        </ErrorBoundary>

    </>
  );
};


export const getStaticProps: GetStaticProps<NewsPageProps> = async () => {
  // In a real app, fetch from your CMS or database
  const articles: NewsArticle[] = [
    {
      id: 'december-medical-outreach-2024',
      title: 'December Medical Outreach Reaches 200+ Families',
      excerpt: 'Our largest medical outreach program provided free health screenings, medications, and health education to over 200 families in rural Ogun State.',
      content: '', // Would be full content
      date: '2024-12-15',
      category: 'outreach',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      readTime: '3 min read',
      author: 'Saintlammy Foundation Team',
      tags: ['medical outreach', 'rural communities', 'healthcare'],
      featured: true
    },
    {
      id: 'school-partnership-expansion-2024',
      title: 'Partnership with Local Schools Expands Education Access',
      excerpt: 'New partnerships with 5 primary schools will provide educational materials, scholarships, and mentorship programs for 150 orphaned children.',
      content: '',
      date: '2024-12-10',
      category: 'partnership',
      image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
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
      category: 'achievement',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      readTime: '2 min read',
      author: 'Empowerment Team',
      tags: ['widow empowerment', 'business', 'independence']
    },
    // Add more articles as needed...
  ];

  const categories = Array.from(new Set(articles.map(article => article.category)));

  return {
    props: {
      articles,
      categories
    },
    revalidate: 3600 // Revalidate every hour
  };
};

export default NewsPage;