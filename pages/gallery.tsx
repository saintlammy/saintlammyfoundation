import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Breadcrumb from '@/components/Breadcrumb';
import ErrorBoundary from '@/components/ErrorBoundary';
import { DonationModalProvider, useDonationModal } from '@/components/DonationModalProvider';
import { Users, GraduationCap, Heart, Building, Search, Filter, Calendar, MapPin, ArrowRight } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: string;
  category: string;
  date: string;
}

const GalleryContent: React.FC = () => {
  const { openDonationModal } = useDonationModal();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch('/api/gallery');
        const data = await response.json();

        // Transform gallery data to match expected interface
        const transformedData = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          image: item.image,
          icon: item.icon,
          category: item.category,
          date: item.date || new Date().toLocaleDateString()
        }));

        setGalleryItems(transformedData);
      } catch (error) {
        console.error('Error fetching gallery:', error);
        // Fallback to comprehensive mock data
        setGalleryItems([
          {
            id: '1',
            title: 'Back-to-School Initiative 2024',
            description: 'Over 500 children received complete school supply packages, uniforms, and educational materials for the new academic year across Lagos and Abuja.',
            image: 'https://images.unsplash.com/photo-1497375638960-ca368c7231e4?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            icon: 'GraduationCap',
            category: 'Education',
            date: 'January 2024'
          },
          {
            id: '2',
            title: 'Mobile Health Clinic Launch',
            description: 'Our new mobile healthcare unit reached 12 rural communities, providing free medical checkups, treatments, and health education sessions.',
            image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
            icon: 'Heart',
            category: 'Healthcare',
            date: 'February 2024'
          },
          {
            id: '3',
            title: 'Widow Empowerment Graduation',
            description: '35 widows completed our comprehensive skills training program and received startup funds for their new businesses, achieving financial independence.',
            image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
            icon: 'Users',
            category: 'Empowerment',
            date: 'March 2024'
          },
          {
            id: '4',
            title: 'Community Center Opening - Abuja',
            description: 'Grand opening of our new community center providing safe space for education, community meetings, and youth development programs.',
            image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
            icon: 'Building',
            category: 'Infrastructure',
            date: 'April 2024'
          },
          {
            id: '5',
            title: 'Scholarship Program Success',
            description: '150 orphaned students received full scholarships covering tuition, books, and boarding for the entire academic year.',
            image: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            icon: 'GraduationCap',
            category: 'Education',
            date: 'May 2024'
          },
          {
            id: '6',
            title: 'Emergency Food Distribution',
            description: 'Rapid response food distribution reached 2,000 families during the flooding emergency in rural communities.',
            image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
            icon: 'Heart',
            category: 'Emergency Relief',
            date: 'June 2024'
          },
          {
            id: '7',
            title: 'Skills Training Workshop',
            description: '80 young adults completed vocational training in tailoring, carpentry, and digital skills, with 90% employment rate.',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            icon: 'Users',
            category: 'Empowerment',
            date: 'July 2024'
          },
          {
            id: '8',
            title: 'Water Well Project',
            description: 'New water well and purification system installed, providing clean water access to 800 residents in remote village.',
            image: 'https://images.unsplash.com/photo-1494790108755-2616c34ca2f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            icon: 'Building',
            category: 'Infrastructure',
            date: 'August 2024'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap':
        return GraduationCap;
      case 'Heart':
        return Heart;
      case 'Users':
        return Users;
      case 'Building':
        return Building;
      default:
        return GraduationCap;
    }
  };

  const categories = ['all', ...Array.from(new Set(galleryItems.map(item => item.category)))];

  const filteredItems = galleryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Head>
        <title>Impact Gallery - Our Work in Action | Saintlammy Foundation</title>
        <meta
          name="description"
          content="Explore our impact gallery showcasing real projects and their outcomes across Nigeria. See how donations create lasting change in communities."
        />
        <meta name="keywords" content="impact gallery, project photos, Nigeria charity work, community projects, before after results" />
        <link rel="canonical" href="https://www.saintlammyfoundation.org/gallery" />
      </Head>

      <Navigation onDonateClick={() => openDonationModal({
        source: 'general',
        title: 'Support Our Mission',
        description: 'Your donation helps us transform lives across Nigeria'
      })} />

      <ErrorBoundary>
        <main className="min-h-screen bg-gray-900 pt-16">
          {/* Header Section */}
          <section className="py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            <div className="max-w-7xl mx-auto px-6">
              <Breadcrumb
                items={[{ label: 'Impact Gallery', current: true }]}
                className="mb-8"
              />

              <div className="text-center mb-12">
                <h1 className="text-display-lg md:text-display-xl font-medium text-white mb-6 font-display tracking-tight">
                  Impact Gallery
                </h1>
                <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto font-light leading-relaxed">
                  Every project tells a story of transformation. Explore the real, measurable impact
                  your donations create in Nigerian communities.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: 'Active Projects', value: '24+', icon: Calendar },
                  { label: 'Communities Served', value: '45+', icon: MapPin },
                  { label: 'Lives Transformed', value: '850+', icon: Users },
                  { label: 'Success Rate', value: '94%', icon: Heart }
                ].map((stat, index) => (
                  <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center">
                    <stat.icon className="w-8 h-8 text-accent-400 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-white mb-2 font-display">
                      {stat.value}
                    </div>
                    <div className="text-gray-400 text-sm font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Filters Section */}
          <section className="py-8 bg-black">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-4">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="text-gray-400 text-sm">
                  Showing {filteredItems.length} of {galleryItems.length} projects
                </div>
              </div>
            </div>
          </section>

          {/* Gallery Grid */}
          <section className="py-16 bg-gray-900">
            <div className="max-w-7xl mx-auto px-6">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="animate-pulse bg-gray-800 rounded-2xl h-96">
                      <div className="h-64 bg-gray-700 rounded-t-2xl"></div>
                      <div className="p-6">
                        <div className="h-4 bg-gray-700 rounded mb-3"></div>
                        <div className="h-3 bg-gray-700 rounded mb-2"></div>
                        <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
                  <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredItems.map((item) => {
                    const IconComponent = getIconComponent(item.icon);
                    return (
                      <Link
                        key={item.id}
                        href={`/story/${item.id}`}
                        className="group bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden hover:bg-gray-800/70 hover:border-gray-600 transition-all duration-300 block"
                      >
                        {/* Image */}
                        <div className="relative h-64 overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>

                          {/* Category Badge */}
                          <div className="absolute top-4 left-4">
                            <div className="flex items-center bg-accent-500/90 backdrop-blur-sm rounded-full px-3 py-1">
                              <IconComponent className="w-4 h-4 text-white mr-2" />
                              <span className="text-white text-xs font-medium">
                                {item.category}
                              </span>
                            </div>
                          </div>

                          {/* Date */}
                          <div className="absolute top-4 right-4">
                            <span className="bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                              {item.date}
                            </span>
                          </div>

                          {/* Read More Indicator */}
                          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-accent-500 rounded-full p-2">
                              <ArrowRight className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h3 className="text-xl font-semibold text-white mb-3 font-display group-hover:text-accent-400 transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-gray-300 text-sm leading-relaxed font-light">
                            {item.description}
                          </p>

                          {/* Read More Link */}
                          <div className="mt-4 flex items-center text-accent-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                            Read Full Story
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 bg-black">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-display-md font-medium text-white mb-6 font-display tracking-tight">
                Be Part of the Next Success Story
              </h2>
              <p className="text-lg text-gray-300 mb-8 font-light">
                Every project in our gallery started with a donation. Your contribution today
                will appear in future impact stories, creating lasting change in communities across Nigeria.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => openDonationModal({
                    source: 'gallery',
                    title: 'Fund the Next Project',
                    description: 'Create the next success story with your donation'
                  })}
                  className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-full font-medium transition-colors shadow-lg hover:shadow-xl"
                >
                  Start a New Project
                </button>
                <a
                  href="/beneficiaries"
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-full font-medium transition-colors"
                >
                  Meet Our Beneficiaries
                </a>
              </div>
            </div>
          </section>
        </main>
      </ErrorBoundary>
    </>
  );
};

const GalleryPage: React.FC = () => {
  return (
    <DonationModalProvider>
      <GalleryContent />
    </DonationModalProvider>
  );
};

export default GalleryPage;