import React from 'react';
import { X, Heart, User, Tag } from 'lucide-react';
import type { CampaignProfile } from '@/types';

export interface ProfileDetailModalProps {
  profile: CampaignProfile | null;
  open: boolean;
  onClose: () => void;
  onSponsor?: (profile: CampaignProfile) => void;
}

export const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({
  profile,
  open,
  onClose,
  onSponsor
}) => {
  if (!open || !profile) return null;

  const handleSponsorClick = () => {
    if (onSponsor && profile) {
      onSponsor(profile);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 shadow-lg"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            </button>

            {/* Scrollable Content */}
            <div className="overflow-y-auto max-h-[90vh]">
              {/* Header with Image */}
              <div className="relative h-64 bg-gradient-to-br from-amber-50 via-teal-50 to-amber-50 dark:from-amber-900/20 dark:via-teal-900/20 dark:to-amber-900/20">
                {profile.image_url ? (
                  <img
                    src={profile.image_url}
                    alt={profile.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-white/80 dark:bg-gray-700/80 flex items-center justify-center shadow-xl">
                      <User className="w-16 h-16 text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>
                )}

                {/* Profile Code Badge */}
                <div className="absolute top-4 left-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold text-gray-800 dark:text-gray-200 shadow-md">
                  {profile.profile_code}
                </div>

                {/* Gradient Overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Title & Descriptor */}
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {profile.title}
                  </h2>
                  <p className="text-lg text-teal-700 dark:text-teal-400 font-semibold">
                    {profile.descriptor}
                  </p>
                </div>

                {/* Tags */}
                {profile.tags && profile.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {profile.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-700"
                      >
                        <Tag className="w-3.5 h-3.5" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Full Story */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Their Story
                  </h3>
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                      {profile.story_full}
                    </p>
                  </div>
                </div>

                {/* How Your Gift Helps */}
                {profile.how_your_gift_helps && (
                  <div className="mb-6 p-5 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl border border-amber-200 dark:border-amber-800">
                    <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-400 mb-2 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-amber-700 dark:text-amber-500" />
                      How Your Gift Helps
                    </h3>
                    <p className="text-gray-800 dark:text-gray-300 leading-relaxed">
                      {profile.how_your_gift_helps}
                    </p>
                  </div>
                )}

                {/* Funding Progress */}
                {profile.funding_goal && profile.funding_goal > 0 && (
                  <div className="mb-6 p-5 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          ${profile.current_funding.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          raised of ${profile.funding_goal.toLocaleString()} goal
                        </p>
                      </div>
                      {profile.sponsor_count > 0 && (
                        <div className="text-right">
                          <p className="text-2xl font-bold text-teal-700 dark:text-teal-400">
                            {profile.sponsor_count}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {profile.sponsor_count === 1 ? 'sponsor' : 'sponsors'}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-500 via-amber-600 to-teal-600 dark:from-amber-400 dark:via-amber-500 dark:to-teal-500 h-3 rounded-full transition-all duration-500"
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

                {/* Video (if available) */}
                {profile.video_url && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Video Testimonial
                    </h3>
                    <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900">
                      <iframe
                        src={profile.video_url}
                        className="w-full h-full"
                        allowFullScreen
                        title={`${profile.title} video testimonial`}
                      />
                    </div>
                  </div>
                )}

                {/* CTA Button */}
                <div className="sticky bottom-0 pt-6 pb-2 bg-white dark:bg-gray-800 -mx-8 px-8 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleSponsorClick}
                    className="w-full py-4 px-6 bg-gradient-to-r from-amber-600 to-amber-500 dark:from-amber-500 dark:to-amber-400 hover:from-amber-700 hover:to-amber-600 dark:hover:from-amber-600 dark:hover:to-amber-500 text-white rounded-xl transition-all duration-200 text-lg font-bold shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                  >
                    <Heart className="w-6 h-6" />
                    Sponsor {profile.title.split('—')[0].trim()} Today
                  </button>
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
                    Your support makes a real difference in their life
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
