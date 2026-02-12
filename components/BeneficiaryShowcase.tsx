import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SponsorModal from './SponsorModal';
import { Heart, MapPin, Calendar } from 'lucide-react';
import { truncateText } from '@/lib/textUtils';

interface Beneficiary {
  id: string;
  name: string;
  age: number;
  location: string;
  category: 'orphan' | 'widow' | 'family';
  story: string;
  needs: string[];
  monthlyCost: number;
  image: string;
  schoolGrade?: string;
  familySize?: number;
  dreamAspiration?: string;
  isSponsored?: boolean;
  daysSupported?: number;
}

const BeneficiaryShowcase: React.FC = () => {
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false);

  const beneficiaries: Beneficiary[] = [
    {
      id: 'amara-showcase',
      name: 'Amara',
      age: 8,
      category: 'orphan',
      location: 'Lagos, Nigeria',
      story: 'Dreams of becoming a doctor to help other children like herself. Your support provides her with education, healthcare, and hope.',
      needs: ['School fees and supplies', 'Healthcare', 'Nutritious meals', 'Educational materials'],
      monthlyCost: 45,
      image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
      schoolGrade: '3',
      dreamAspiration: 'I want to become a doctor so I can help sick children get better and make them smile again.',
      isSponsored: false,
      daysSupported: 120
    },
    {
      id: 'grace-showcase',
      name: 'Grace',
      age: 35,
      category: 'widow',
      location: 'Lagos, Nigeria',
      story: 'Mother of three children, learning new skills to provide for her family. Your support helps her start a small business.',
      needs: ['Business training', 'Micro-loan support', 'Childcare assistance', 'Basic necessities'],
      monthlyCost: 80,
      image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
      familySize: 4,
      dreamAspiration: 'I want to build a successful tailoring business so my children can have the education I never had.',
      isSponsored: false,
      daysSupported: 85
    },
    {
      id: 'emmanuel-showcase',
      name: 'Emmanuel',
      age: 12,
      category: 'orphan',
      location: 'Lagos, Nigeria',
      story: 'Passionate about technology and coding. Your support gives him access to education and the tools to build his future.',
      needs: ['Computer access', 'Internet connectivity', 'Programming books', 'School fees'],
      monthlyCost: 55,
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
      schoolGrade: '7',
      dreamAspiration: 'I want to become a software engineer and create apps that help people in my community.',
      isSponsored: false,
      daysSupported: 200
    }
  ];

  const handleSponsorClick = (beneficiary: Beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setIsSponsorModalOpen(true);
  };

  return (
    <section className="py-24 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-display-md md:text-display-lg font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
            Meet the Lives You're Transforming
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
            Every donation has a face, a story, and a dream. Here are some of the amazing people
            your support is helping to thrive.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {beneficiaries.map((beneficiary) => (
            <div
              key={beneficiary.id}
              className="group bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-accent-500"
            >
              {/* Photo */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={beneficiary.image}
                  alt={`${beneficiary.name}, ${beneficiary.age} years old`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                    beneficiary.category === 'orphan' ? 'bg-blue-500' : 'bg-purple-500'
                  }`}>
                    {beneficiary.category === 'orphan' ? 'Orphan' : 'Widow'}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                    <Heart className="w-4 h-4 text-red-500" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white font-display">
                    {beneficiary.name}, {beneficiary.age}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-1" />
                    {beneficiary.location.split(',')[0]}
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-sm font-light leading-relaxed mb-4">
                  {truncateText(beneficiary.story, 3)}
                </p>

                {/* Support Info */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">Monthly Need</span>
                    <span className="font-semibold text-gray-900 dark:text-white">${beneficiary.monthlyCost}</span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">Days Supported</span>
                    <span className="font-semibold text-accent-400">{beneficiary.daysSupported} days</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-accent-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(((beneficiary.daysSupported || 0) / 365) * 100, 100)}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Goal: 365 days</span>
                    <span>{Math.round(((beneficiary.daysSupported || 0) / 365) * 100)}% funded</span>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleSponsorClick(beneficiary)}
                  className="w-full mt-6 bg-accent-500 hover:bg-accent-600 text-white font-medium py-3 px-4 rounded-full transition-colors duration-200 font-sans"
                >
                  Sponsor {beneficiary.name}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 dark:text-gray-300 mb-6 font-light">
            Join 14 committed donors who are making a real difference in these lives
          </p>
          <Link
            href="/beneficiaries"
            className="inline-block bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-full font-medium text-base transition-colors shadow-lg hover:shadow-xl font-sans"
          >
            View All Beneficiaries
          </Link>
        </div>
      </div>

      {/* Sponsor Modal */}
      <SponsorModal
        isOpen={isSponsorModalOpen}
        onClose={() => setIsSponsorModalOpen(false)}
        beneficiary={selectedBeneficiary}
      />
    </section>
  );
};

export default BeneficiaryShowcase;