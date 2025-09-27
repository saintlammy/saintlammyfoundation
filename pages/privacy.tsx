import React from 'react';
import Head from 'next/head';
import Navigation from '@/components/Navigation';
import Breadcrumb from '@/components/Breadcrumb';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useDonationModal } from '@/components/DonationModalProvider';
import { Shield, Eye, Lock, Users, Mail, Database } from 'lucide-react';

const PrivacyPage: React.FC = () => {
  const { openDonationModal } = useDonationModal();

  return (
    <>
      <Head>
        <title>Privacy Policy - Saintlammy Foundation</title>
        <meta
          name="description"
          content="Learn how Saintlammy Foundation protects your privacy and handles your personal information. Read our comprehensive privacy policy."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.saintlammyfoundation.org/privacy" />
      </Head>

      <Navigation onDonateClick={() => openDonationModal({
        source: 'general',
        title: 'Support Our Mission',
        description: 'Your donation helps us transform lives across Nigeria'
      })} />

      <ErrorBoundary>
        <main className="min-h-screen bg-gray-900 pt-16">
          <section className="py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            <div className="max-w-4xl mx-auto px-6">
              <Breadcrumb
                items={[{ label: 'Privacy Policy', current: true }]}
                className="mb-8"
              />

              <div className="text-center mb-12">
                <div className="w-16 h-16 bg-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-display-lg md:text-display-xl font-medium text-white mb-6 font-display tracking-tight">
                  Privacy Policy
                </h1>
                <p className="text-lg text-gray-300 font-light">
                  Your privacy is important to us. This policy explains how we collect, use, and protect your information.
                </p>
                <p className="text-sm text-gray-400 mt-4">
                  Last updated: January 1, 2024
                </p>
              </div>
            </div>
          </section>

          <section className="py-16 bg-gray-900">
            <div className="max-w-4xl mx-auto px-6 prose prose-lg prose-invert max-w-none">

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 mb-12">
                <h2 className="text-2xl font-semibold text-white mb-6 font-display flex items-center">
                  <Eye className="w-6 h-6 mr-3 text-accent-400" />
                  Information We Collect
                </h2>
                <div className="space-y-6 text-gray-300">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-3">Personal Information</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Name, email address, and phone number when you contact us or sign up for our newsletter</li>
                      <li>• Donation information including billing address and payment method details</li>
                      <li>• Volunteer application information including background and skills</li>
                      <li>• Communication preferences and interaction history</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-3">Automatically Collected Information</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Website usage data through cookies and analytics tools</li>
                      <li>• IP address, browser type, and device information</li>
                      <li>• Pages visited and time spent on our website</li>
                      <li>• Referral source (how you found our website)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 mb-12">
                <h2 className="text-2xl font-semibold text-white mb-6 font-display flex items-center">
                  <Database className="w-6 h-6 mr-3 text-accent-400" />
                  How We Use Your Information
                </h2>
                <div className="space-y-4 text-gray-300 text-sm">
                  <p><strong>To provide our services:</strong> Processing donations, sending receipts, and communicating about our programs</p>
                  <p><strong>To improve our website:</strong> Analyzing usage patterns to enhance user experience and functionality</p>
                  <p><strong>To communicate with you:</strong> Sending newsletters, updates about our impact, and responding to inquiries</p>
                  <p><strong>To ensure security:</strong> Protecting against fraud and maintaining the security of our systems</p>
                  <p><strong>For compliance:</strong> Meeting legal requirements for nonprofit organizations and tax reporting</p>
                </div>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 mb-12">
                <h2 className="text-2xl font-semibold text-white mb-6 font-display flex items-center">
                  <Lock className="w-6 h-6 mr-3 text-accent-400" />
                  How We Protect Your Information
                </h2>
                <div className="space-y-4 text-gray-300 text-sm">
                  <p><strong>Encryption:</strong> All sensitive data is encrypted both in transit and at rest using industry-standard protocols</p>
                  <p><strong>Access Controls:</strong> Limited access to personal information on a need-to-know basis</p>
                  <p><strong>Secure Payment Processing:</strong> We use PCI-compliant payment processors and never store payment card information</p>
                  <p><strong>Regular Security Audits:</strong> Our systems undergo regular security assessments and updates</p>
                  <p><strong>Staff Training:</strong> All team members receive privacy and security training</p>
                </div>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 mb-12">
                <h2 className="text-2xl font-semibold text-white mb-6 font-display flex items-center">
                  <Users className="w-6 h-6 mr-3 text-accent-400" />
                  Information Sharing
                </h2>
                <div className="space-y-4 text-gray-300 text-sm">
                  <p><strong>We do not sell or rent your personal information to third parties.</strong></p>
                  <p>We may share your information only in these limited circumstances:</p>
                  <ul className="space-y-2 mt-4">
                    <li>• <strong>Service Providers:</strong> With trusted partners who help us operate our website and process donations (under strict confidentiality agreements)</li>
                    <li>• <strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                    <li>• <strong>Anonymized Data:</strong> We may share aggregated, non-identifying information for research or reporting purposes</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 mb-12">
                <h2 className="text-2xl font-semibold text-white mb-6 font-display">Your Rights and Choices</h2>
                <div className="space-y-4 text-gray-300 text-sm">
                  <p><strong>Access and Update:</strong> You can request access to your personal information and ask us to correct or update it</p>
                  <p><strong>Opt-Out:</strong> You can unsubscribe from our communications at any time using the link in our emails</p>
                  <p><strong>Data Deletion:</strong> You can request deletion of your personal information, subject to legal retention requirements</p>
                  <p><strong>Cookies:</strong> You can control cookie settings through your browser preferences</p>
                </div>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 mb-12">
                <h2 className="text-2xl font-semibold text-white mb-6 font-display">Cookies and Analytics</h2>
                <div className="space-y-4 text-gray-300 text-sm">
                  <p>We use cookies and similar technologies to:</p>
                  <ul className="space-y-2 mt-4">
                    <li>• Remember your preferences and improve your experience</li>
                    <li>• Analyze website traffic and usage patterns</li>
                    <li>• Provide relevant content and ensure website security</li>
                  </ul>
                  <p className="mt-4">You can manage cookie preferences through your browser settings. Note that disabling cookies may affect website functionality.</p>
                </div>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 mb-12">
                <h2 className="text-2xl font-semibold text-white mb-6 font-display">Children's Privacy</h2>
                <div className="space-y-4 text-gray-300 text-sm">
                  <p>Our website is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, please contact us immediately.</p>
                </div>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 mb-12">
                <h2 className="text-2xl font-semibold text-white mb-6 font-display">International Users</h2>
                <div className="space-y-4 text-gray-300 text-sm">
                  <p>Our services are primarily intended for users in Nigeria. If you are accessing our website from outside Nigeria, please be aware that your information may be transferred to and processed in Nigeria, where our servers and central database are located.</p>
                </div>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 mb-12">
                <h2 className="text-2xl font-semibold text-white mb-6 font-display">Policy Updates</h2>
                <div className="space-y-4 text-gray-300 text-sm">
                  <p>We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the "Last updated" date. Your continued use of our services after such modifications constitutes your acceptance of the updated policy.</p>
                </div>
              </div>

              <div className="bg-accent-500/10 border border-accent-500/30 rounded-xl p-8">
                <h2 className="text-2xl font-semibold text-white mb-6 font-display flex items-center">
                  <Mail className="w-6 h-6 mr-3 text-accent-400" />
                  Contact Us
                </h2>
                <div className="space-y-4 text-gray-300 text-sm">
                  <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
                  <div className="space-y-2">
                    <p><strong>Email:</strong> privacy@saintlammyfoundation.org</p>
                    <p><strong>Address:</strong> Saintlammy Foundation, Lagos, Nigeria</p>
                    <p><strong>Phone:</strong> +234 XXX XXX XXXX</p>
                  </div>
                  <p className="mt-4">We will respond to your inquiry within 30 days.</p>
                </div>
              </div>

            </div>
          </section>
        </main>
      </ErrorBoundary>
    </>
  );
};


export default PrivacyPage;