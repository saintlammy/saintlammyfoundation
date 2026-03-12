import React from 'react';
import { Heart, User } from 'lucide-react';
import type { CampaignProfile } from '@/types';

export interface ProfileCardProps {
  profile: CampaignProfile;
  onReadMore: (profile: CampaignProfile) => void;
  onSponsor: (profile: CampaignProfile) => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onReadMore,
  onSponsor
}) => {
  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
      {/* Profile Image/Icon */}
      <div className="relative h-48 bg-gradient-to-br from-amber-50 to-teal-50 dark:from-amber-900/20 dark:to-teal-900/20 flex items-center justify-center">
        {profile.image_url ? (
          <img
            src={profile.image_url}
            alt={profile.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-white/80 dark:bg-gray-700/80 flex items-center justify-center shadow-lg">
            <User className="w-12 h-12 text-amber-600 dark:text-amber-400" />
          </div>
        )}

        {/* Profile Code Badge */}
        <div className="absolute top-3 left-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700 dark:text-gray-200 shadow-sm">
          {profile.profile_code}
        </div>

        {/* Featured Badge */}
        {profile.is_featured && (
          <div className="absolute top-3 right-3 bg-amber-500 dark:bg-amber-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title & Descriptor */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
            {profile.title}
          </h3>
          <p className="text-sm text-teal-700 dark:text-teal-400 font-medium">
            {profile.descriptor}
          </p>
        </div>

        {/* Story Snippet */}
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
          {profile.story_snippet}
        </p>

        {/* Tags */}
        {profile.tags && profile.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {profile.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* How Your Gift Helps */}
        {profile.how_your_gift_helps && (
          <div className="mb-5 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800">
            <p className="text-xs font-semibold text-amber-800 dark:text-amber-400 mb-1">
              How Your Gift Helps:
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
              {profile.how_your_gift_helps}
            </p>
          </div>
        )}

        {/* Funding Progress (if goal is set) */}
        {profile.funding_goal && profile.funding_goal > 0 && (
          <div className="mb-5">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                ${profile.current_funding.toLocaleString()} raised
              </span>
              <span className="text-xs font-semibold text-teal-700 dark:text-teal-400">
                Goal: ${profile.funding_goal.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-teal-600 dark:from-amber-400 dark:to-teal-500 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    (profile.current_funding / profile.funding_goal) * 100,
                    100
                  )}%`
                }}
              />
            </div>
          </div>
        )}

        {/* Sponsor Count */}
        {profile.sponsor_count > 0 && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            <Heart className="w-3.5 h-3.5 inline mr-1 text-red-500 dark:text-red-400" />
            {profile.sponsor_count} {profile.sponsor_count === 1 ? 'sponsor' : 'sponsors'}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => onReadMore(profile)}
            className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-sm font-medium"
          >
            Read Full Story
          </button>
          <button
            onClick={() => onSponsor(profile)}
            className="flex-1 px-4 py-2.5 bg-amber-600 dark:bg-amber-500 hover:bg-amber-700 dark:hover:bg-amber-600 text-white rounded-lg transition-colors duration-200 text-sm font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4" />
            Sponsor
          </button>
        </div>
      </div>
    </div>
  );
};
