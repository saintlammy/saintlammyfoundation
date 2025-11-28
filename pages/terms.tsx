import React from 'react';
import Head from 'next/head';
import Navigation from '@/components/Navigation';
import Breadcrumb from '@/components/Breadcrumb';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useDonationModal } from '@/components/DonationModalProvider';
import { FileText, Scale, AlertTriangle, Users, CreditCard, Globe } from 'lucide-react';

const TermsPage: React.FC = () => {
  const { openDonationModal } = useDonationModal();

  return (
    <>
      <Head>
        <title>Terms of Service - Saintlammy Foundation</title>
        <meta
          name="description"
          content="Read the terms and conditions for using Saintlammy Foundation's website and services. Understand your rights and responsibilities."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.saintlammyfoundation.org/terms" />
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
                items={[{ label: 'Terms of Service', current: true }]}
                className="mb-8"
              />

              <div className="text-center mb-12">
                <div className="w-16 h-16 bg-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-display-lg md:text-display-xl font-medium text-white mb-6 font-display tracking-tight">
                  Terms of Service
                </h1>
                <p className="text-lg text-gray-300 font-light">
                  These terms govern your use of our website and services. Please read them carefully.
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
                  <Scale className="w-6 h-6 mr-3 text-accent-400" />
                  Acceptance of Terms
                </h2>
                <div className="space-y-4 text-gray-300 text-sm">
                  <p>By accessing and using the Saintlammy Foundation website and services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or services.</p>
                  <p>These terms apply to all users of the website, including visitors, donors, volunteers, and partners.</p>
                </div>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 mb-12">
                <h2 className="text-2xl font-semibold text-white mb-6 font-display flex items-center">
                  <Globe className="w-6 h-6 mr-3 text-accent-400" />
                  About Saintlammy Foundation
                </h2>
                <div className="space-y-4 text-gray-300 text-sm">
                  <p>Saintlammy Foundation is a registered nonprofit organization in Nigeria, dedicated to empowering orphans, widows, and vulnerable communities through comprehensive support programs.</p>
                  <p><strong>CAC Registration:</strong> [Registration Number]</p>
                  <p><strong>Tax Status:</strong> Tax-exempt nonprofit organization under Nigerian law</p>
                </div>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 mb-12">
                <h2 className="text-2xl font-semibold text-white mb-6 font-display flex items-center">
                  <Users className="w-6 h-6 mr-3 text-accent-400" />
                  Use of Our Website
                </h2>
                <div className="space-y-4 text-gray-300 text-sm">
                  <h3 className="text-lg font-medium text-white">Permitted Uses</h3>
                  <ul className="space-y-2">
                    <li>• Browsing and learning about our programs and impact</li>
                    <li>• Making donations to support our mission</li>
                    <li>• Applying to volunteer or partner with us</li>
                    <li>• Subscribing to our newsletter and updates</li>
                    <li>• Sharing our content for charitable purposes</li>
                  </ul>

                  <h3 className="text-lg font-medium text-white mt-6">Prohibited Uses</h3>
                  <ul className="space-y-2">
                    <li>• Using the website for any unlawful purpose</li>
                    <li>• Attempting to gain unauthorized access to our systems</li>
                    <li>• Distributing malware or harmful code</li>
                    <li>• Impersonating the foundation or its representatives</li>
                    <li>• Using automated systems to scrape or harvest data</li>
                    <li>• Interfering with the website's operation or security</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 mb-12">
                <h2 className="text-2xl font-semibold text-white mb-6 font-display flex items-center">
                  <CreditCard className="w-6 h-6 mr-3 text-accent-400" />
                  Donations and Payments
                </h2>
                <div className="space-y-4 text-gray-300 text-sm">
                  <h3 className="text-lg font-medium text-white">Donation Policy</h3>
                  <ul className="space-y-2">
                    <li>• All donations are voluntary and non-refundable unless required by law</li>
                    <li>• Donations are used to support our charitable programs and operations</li>
                    <li>• We provide receipts for tax-deductible donations as applicable</li>
                    <li>• Recurring donations can be cancelled at any time by contacting us</li>
                  </ul>

                  <h3 className="text-lg font-medium text-white mt-6">Payment Processing</h3>
                  <ul className="space-y-2">
                    <li>• We use secure, PCI-compliant payment processors</li>
                    <li>• We do not store payment card information on our servers</li>
                    <li>• Payment processing fees may be deducted from donations</li>
                    <li>• Failed payments will result in notification and retry attempts</li>
                  </ul>

                  <h3 className="text-lg font-medium text-white mt-6">Sponsorship Programs</h3>
                  <ul className="space-y-2">
                    <li>• Sponsorship commitments are made on a monthly basis</li>
                    <li>• Sponsors can cancel their commitments with 30 days notice</li>
                    <li>• We reserve the right to reassign beneficiaries if necessary</li>
                    <li>• Updates and communications are provided as specified in sponsorship tiers</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 mb-12">
                <h2 className="text-2xl font-semibold text-white mb-6 font-display">Intellectual Property</h2>
                <div className="space-y-4 text-gray-300 text-sm">
                  <p><strong>Our Content:</strong> All content on this website, including text, images, logos, and design elements, is owned by Saintlammy Foundation or used with permission. It is protected by copyright and other intellectual property laws.</p>
                  <p><strong>Your Content:</strong> When you submit content to us (such as testimonials or stories), you grant us a non-exclusive license to use, modify, and display that content for our charitable purposes.</p>
                  <p><strong>Third-Party Content:</strong> Some content may be licensed from third parties. Use of such content is subject to the respective license terms.</p>
                </div>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 mb-12">
                <h2 className="text-2xl font-semibold text-white mb-6 font-display">Privacy and Data Protection</h2>
                <div className="space-y-4 text-gray-300 text-sm">
                  <p>Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these terms by reference.</p>
                  <p>By using our website, you consent to the collection and use of your information as described in our Privacy Policy.</p>
                </div>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 mb-12">
                <h2 className="text-2xl font-semibold text-white mb-6 font-display flex items-center">
                  <AlertTriangle className="w-6 h-6 mr-3 text-yellow-400" />
                  Disclaimers and Limitations
                </h2>
                <div className="space-y-4 text-gray-300 text-sm">
                  <h3 className="text-lg font-medium text-white">Website Availability</h3>
                  <p>We strive to maintain website availability but cannot guarantee uninterrupted access. We may suspend or modify our services for maintenance or other operational reasons.</p>

                  <h3 className="text-lg font-medium text-white mt-6">Information Accuracy</h3>
                  <p>While we make every effort to ensure accuracy, we cannot guarantee that all information on our website is current, complete, or error-free. We reserve the right to correct errors and update information at any time.</p>

                  <h3 className="text-lg font-medium text-white mt-6">External Links</h3>
                  <p>Our website may contain links to external websites. We are not responsible for the content, privacy practices, or terms of service of these external sites.</p>

                  <h3 className="text-lg font-medium text-white mt-6">Limitation of Liability</h3>
                  <p>To the fullest extent permitted by law, Saintlammy Foundation shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our website or services.</p>
                </div>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 mb-12">
                <h2 className="text-2xl font-semibold text-white mb-6 font-display">Volunteer and Partnership Terms</h2>
                <div className="space-y-4 text-gray-300 text-sm">
                  <p><strong>Volunteer Agreements:</strong> Volunteers may be required to sign additional agreements covering background checks, confidentiality, and specific role responsibilities.</p>
                  <p><strong>Partnership Terms:</strong> Corporate and organizational partnerships are subject to separate written agreements that supplement these terms.</p>
                  <p><strong>Code of Conduct:</strong> All volunteers and partners must adhere to our code of conduct and ethical standards.</p>
                </div>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 mb-12">
                <h2 className="text-2xl font-semibold text-white mb-6 font-display">Governing Law and Jurisdiction</h2>
                <div className="space-y-4 text-gray-300 text-sm">
                  <p>These Terms of Service are governed by the laws of Nigeria. Any disputes arising from these terms or your use of our website shall be subject to the exclusive jurisdiction of Nigerian courts.</p>
                  <p>If any provision of these terms is found to be unenforceable, the remaining provisions shall remain in full force and effect.</p>
                </div>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 mb-12">
                <h2 className="text-2xl font-semibent text-white mb-6 font-display">Termination</h2>
                <div className="space-y-4 text-gray-300 text-sm">
                  <p>We reserve the right to terminate or suspend your access to our website and services at any time, without notice, for conduct that we believe violates these terms or is harmful to other users or our organization.</p>
                  <p>Upon termination, your right to use our website ceases immediately, but provisions regarding intellectual property, disclaimers, and limitations shall survive.</p>
                </div>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 mb-12">
                <h2 className="text-2xl font-semibold text-white mb-6 font-display">Changes to Terms</h2>
                <div className="space-y-4 text-gray-300 text-sm">
                  <p>We may modify these Terms of Service at any time. When we make changes, we will update the "Last updated" date and post the new terms on our website.</p>
                  <p>Your continued use of our website after such modifications constitutes your acceptance of the updated terms. We encourage you to review these terms periodically.</p>
                </div>
              </div>

              <div className="bg-accent-500/10 border border-accent-500/30 rounded-xl p-8">
                <h2 className="text-2xl font-semibold text-white mb-6 font-display">Contact Information</h2>
                <div className="space-y-4 text-gray-300 text-sm">
                  <p>If you have any questions about these Terms of Service, please contact us:</p>
                  <div className="space-y-2">
                    <p><strong>Email:</strong> legal@saintlammyfoundation.org</p>
                    <p><strong>Address:</strong> Saintlammy Foundation, Lagos, Nigeria</p>
                    <p><strong>Phone:</strong> +234 706 307 6704</p>
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


export default TermsPage;