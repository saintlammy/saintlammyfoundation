import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SponsorModal from './SponsorModal';
import { Heart, MapPin, Loader2 } from 'lucide-react';
import { truncateToLines } from '@/lib/textUtils';

interface Beneficiary {
  id: string;
  name: string;
  age: number | null;
  location: string;
  category: 'orphan' | 'widow' | 'family';
  story: string;
  needs: string[];
  monthly_cost: number;
  image: string;
  school_grade?: string | null;
  family_size?: number | null;
  dream_aspiration?: string;
  is_sponsored?: boolean;
  days_supported?: number;
}

// Adapter — API uses snake_case; SponsorModal expects camelCase
const toSponsorShape = (b: Beneficiary) => ({
  id: b.id,
  name: b.name,
  age: b.age ?? 0,
  location: b.location,
  category: b.category,
  story: b.story,
  needs: b.needs,
  monthlyCost: b.monthly_cost,
  image: b.image,
  schoolGrade: b.school_grade ?? undefined,
  familySize: b.family_size ?? undefined,
  dreamAspiration: b.dream_aspiration ?? '',
  isSponsored: b.is_sponsored ?? false,
  daysSupported: b.days_supported ?? 0,
});

const BeneficiaryShowcase: React.FC = () => {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<ReturnType<typeof toSponsorShape> | null>(null);
  const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/beneficiaries?featured=true&limit=3')
      .then(r => r.json())
      .then(json => setBeneficiaries(json.data || []))
      .catch(() => setBeneficiaries([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSponsorClick = (beneficiary: Beneficiary) => {
    setSelectedBeneficiary(toSponsorShape(beneficiary));
    setIsSponsorModalOpen(true);
  };

  // Don't render the section if there are no beneficiaries in the DB
  if (!loading && beneficiaries.length === 0) return null;

  return (
    <section className="py-24 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-display-md md:text-display-lg font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
            Meet the Lives You&apos;re Transforming
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
            Every donation has a face, a story, and a dream. Here are some of the amazing people
            your support is helping to thrive.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 text-accent-500 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {beneficiaries.map((beneficiary) => (
              <div
                key={beneficiary.id}
                className="group bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-accent-500"
              >
                {/* Photo */}
                <div className="relative h-64 overflow-hidden bg-gray-200 dark:bg-gray-700">
                  {beneficiary.image ? (
                    <Image
                      src={beneficiary.image}
                      alt={`${beneficiary.name}${beneficiary.age ? `, ${beneficiary.age} years old` : ''}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Heart className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                      beneficiary.category === 'orphan' ? 'bg-blue-500' :
                      beneficiary.category === 'widow' ? 'bg-purple-500' : 'bg-gray-600'
                    }`}>
                      {beneficiary.category.charAt(0).toUpperCase() + beneficiary.category.slice(1)}
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
                      {beneficiary.name}{beneficiary.age ? `, ${beneficiary.age}` : ''}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <MapPin className="w-4 h-4 mr-1" />
                      {beneficiary.location.split(',')[0]}
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 text-sm font-light leading-relaxed mb-4">
                    {truncateToLines(beneficiary.story, 3)}
                  </p>

                  {/* Support Info */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 dark:text-gray-400 font-medium">Monthly Need</span>
                      <span className="font-semibold text-gray-900 dark:text-white">${beneficiary.monthly_cost}</span>
                    </div>

                    {(beneficiary.days_supported ?? 0) > 0 && (
                      <>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500 dark:text-gray-400 font-medium">Days Supported</span>
                          <span className="font-semibold text-accent-400">{beneficiary.days_supported} days</span>
                        </div>

                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-accent-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(((beneficiary.days_supported ?? 0) / 365) * 100, 100)}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>Goal: 365 days</span>
                          <span>{Math.round(((beneficiary.days_supported ?? 0) / 365) * 100)}% funded</span>
                        </div>
                      </>
                    )}
                  </div>

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
        )}

        {!loading && beneficiaries.length > 0 && (
          <div className="text-center mt-16">
            <Link
              href="/beneficiaries"
              className="inline-block bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-full font-medium text-base transition-colors shadow-lg hover:shadow-xl font-sans"
            >
              View All Beneficiaries
            </Link>
          </div>
        )}
      </div>

      <SponsorModal
        isOpen={isSponsorModalOpen}
        onClose={() => setIsSponsorModalOpen(false)}
        beneficiary={selectedBeneficiary}
      />
    </section>
  );
};

export default BeneficiaryShowcase;
