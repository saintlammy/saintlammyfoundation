import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import Layout from '@/components/Layout';
import Image from 'next/image';
import { Quote, Star, Calendar, MapPin, ArrowLeft, Filter, Search } from 'lucide-react';
import { useDonationModal } from '@/components/DonationModalProvider';

interface Story {
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

interface StoriesPageProps {
  initialStories: Story[];
}

const StoriesPage: React.FC<StoriesPageProps> = ({ initialStories }) => {
  const { openDonationModal } = useDonationModal();
  const [stories, setStories] = useState<Story[]>(initialStories);
  const [filteredStories, setFilteredStories] = useState<Story[]>(initialStories);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Filter stories based on category and search term
    let filtered = stories;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(story => story.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(story =>
        story.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.story.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredStories(filtered);
  }, [stories, selectedCategory, searchTerm]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'orphan':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'widow':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'community':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const categories = [
    { value: 'all', label: 'All Stories' },
    { value: 'orphan', label: 'Orphan Support' },
    { value: 'widow', label: 'Widow Empowerment' },
    { value: 'community', label: 'Community Support' }
  ];

  return (
    <Layout>
      <Head>
        <title>Success Stories - Saintlammy Foundation</title>
        <meta name="description" content="Read inspiring success stories from beneficiaries of Saintlammy Foundation. Real people, real impact across Nigeria." />
        <meta name="keywords" content="success stories, testimonials, impact, Nigeria, charity, foundation" />
      </Head>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-display-lg md:text-display-xl font-medium text-white mb-6 font-display tracking-tight">
            Success Stories
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto font-light leading-relaxed">
            Every donation creates opportunities for transformation. These are the real faces and stories behind our mission to change lives across Nigeria.
          </p>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search stories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-accent-500 focus:outline-none"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-accent-500 focus:outline-none"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-gray-400 text-sm">
            Showing {filteredStories.length} of {stories.length} stories
          </div>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          {filteredStories.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 text-lg mb-4">No stories found matching your criteria.</div>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchTerm('');
                }}
                className="text-accent-400 hover:text-accent-300 font-medium"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredStories.map((story, index) => (
                <article
                  key={story.id}
                  className="group bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden hover:bg-gray-800/70 hover:border-gray-600 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={story.image}
                      alt={`Portrait of ${story.name}, a beneficiary of Saintlammy Foundation's ${story.category} support program from ${story.location}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      loading={index > 2 ? 'lazy' : 'eager'}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(story.category)}`}>
                        {story.category.charAt(0).toUpperCase() + story.category.slice(1)} Support
                      </span>
                    </div>

                    {/* Quote Icon */}
                    <div className="absolute bottom-4 right-4">
                      <div className="w-10 h-10 bg-accent-500/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <Quote className="w-5 h-5 text-accent-400" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-1 font-display">
                          {story.name}
                        </h3>
                        <div className="flex items-center text-sm text-gray-400 gap-4">
                          {story.age && <span>Age {story.age}</span>}
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {story.location}
                          </div>
                        </div>
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm leading-relaxed mb-4 font-light">
                      {story.story.length > 150 ? `${story.story.substring(0, 150)}...` : story.story}
                    </p>

                    <blockquote className="border-l-4 border-accent-500 pl-4 mb-4">
                      <p className="text-accent-100 text-sm italic font-medium leading-relaxed">
                        "{story.quote.length > 100 ? `${story.quote.substring(0, 100)}...` : story.quote}"
                      </p>
                    </blockquote>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Impact:</span>
                        <span className="text-green-400 font-medium">Successful</span>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        {story.impact}
                      </p>
                      <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-700">
                        <div className="flex items-center gap-1 text-gray-400">
                          <Calendar className="w-3 h-3" />
                          Supported since {story.dateHelped}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-6 font-display">
            Be Part of the Next Success Story
          </h2>
          <p className="text-xl text-gray-300 mb-8 font-light leading-relaxed">
            Every donation creates opportunities for transformation. Join us in writing more success stories across Nigeria.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => openDonationModal({
                source: 'stories-page',
                category: 'general',
                title: 'Support More Success Stories',
                description: 'Help create more life-changing success stories like these'
              })}
              className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-full font-medium text-lg transition-colors"
            >
              Make a Donation
            </button>
            <a
              href="/volunteer"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-full font-medium text-lg transition-colors"
            >
              Volunteer With Us
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  try {
    // In a real app, this would fetch from your API
    // For now, we'll use the same mock data as the component
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/stories`);
    const stories = await response.json();

    return {
      props: {
        initialStories: stories,
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    console.error('Error fetching stories:', error);

    // Fallback mock data
    const mockStories = [
      {
        id: '1',
        name: 'Amara N.',
        age: 12,
        location: 'Lagos, Nigeria',
        story: 'Amara lost both parents in a car accident when she was 8. Through our orphan support program, she has received consistent education funding, healthcare, and emotional support.',
        quote: "Before Saintlammy Foundation found me, I thought my dreams of becoming a doctor were impossible. Now I'm excelling in school and know that anything is possible with the right support.",
        image: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        category: 'orphan' as const,
        impact: 'Maintained 95% attendance rate and top 10% academic performance',
        dateHelped: 'January 2022'
      },
      {
        id: '2',
        name: 'Mrs. Folake O.',
        age: 34,
        location: 'Ibadan, Nigeria',
        story: 'After losing her husband, Folake struggled to feed her three children. Our widow empowerment program provided monthly stipends and helped her start a small tailoring business.',
        quote: "The foundation didn't just give me money - they gave me hope and the tools to build a better future for my children. My tailoring business now supports my family independently.",
        image: 'https://images.unsplash.com/photo-1494790108755-2616c34ca2f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        category: 'widow' as const,
        impact: 'Achieved financial independence and expanded business to employ 3 others',
        dateHelped: 'March 2022'
      },
      {
        id: '3',
        name: 'Emmanuel A.',
        age: 16,
        location: 'Abuja, Nigeria',
        story: 'Emmanuel was living on the streets when our outreach team found him. Through our comprehensive support program, he was enrolled in school and provided with safe housing.',
        quote: "I never thought I'd see the inside of a classroom again. Now I'm preparing for university and want to become an engineer to help build better communities.",
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        category: 'orphan' as const,
        impact: 'Completed secondary education with honors and received university scholarship',
        dateHelped: 'September 2021'
      }
    ];

    return {
      props: {
        initialStories: mockStories,
      },
      revalidate: 3600,
    };
  }
};

export default StoriesPage;