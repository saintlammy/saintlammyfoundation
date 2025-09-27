import React, { useState } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, User, Globe } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would integrate with your email service
    console.log('Contact form submitted:', formData);
    setIsSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: 'hello@saintlammyfoundation.org',
      description: 'Send us an email and we\'ll respond within 24 hours',
      link: 'mailto:hello@saintlammyfoundation.org'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: '+234 XXX XXX XXXX',
      description: 'Available Monday to Friday, 9AM - 5PM WAT',
      link: 'tel:+234XXXXXXXXX'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: 'Lagos, Nigeria',
      description: 'Schedule an appointment to visit our office',
      link: '#'
    },
    {
      icon: Globe,
      title: 'Social Media',
      details: '@SaintlammyFoundation',
      description: 'Follow us for updates and impact stories',
      link: '#'
    }
  ];

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'donation', label: 'Donation Questions' },
    { value: 'volunteer', label: 'Volunteer Opportunities' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'media', label: 'Media & Press' },
    { value: 'support', label: 'Technical Support' }
  ];

  const faqs = [
    {
      question: 'How can I make a donation?',
      answer: 'You can donate through our secure online platform using traditional payment methods or cryptocurrency. Visit our donate page for all available options.'
    },
    {
      question: 'Can I volunteer with your organization?',
      answer: 'Yes! We welcome volunteers. Please fill out our volunteer application form, and our team will contact you with available opportunities that match your skills and interests.'
    },
    {
      question: 'How do you ensure transparency?',
      answer: 'We provide detailed financial reports, donation tracking, and regular updates on our programs. All major donors receive quarterly impact reports showing exactly how their contributions are being used.'
    },
    {
      question: 'Do you accept international donations?',
      answer: 'Yes, we accept donations from anywhere in the world through cryptocurrency and international wire transfers. Contact us for specific instructions for your country.'
    }
  ];

  return (
    <>
      <Head>
        <title>Contact Us - Saintlammy Foundation</title>
        <meta name="description" content="Get in touch with Saintlammy Foundation. Contact us for donations, volunteer opportunities, partnerships, or general inquiries." />
      </Head>

      <Layout>
        {/* Hero Section */}
        <section className="py-32 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
              Get In Touch
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-light leading-relaxed">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-24 bg-white dark:bg-black">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-display-md md:text-display-lg font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
                Contact Information
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                Multiple ways to reach us - choose what works best for you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {contactInfo.map((info, index) => (
                <div key={index} className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-accent-500 transition-colors shadow-lg dark:shadow-none text-center group">
                  <div className="w-12 h-12 bg-accent-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <info.icon className="w-6 h-6 text-accent-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 font-display">{info.title}</h3>
                  <p className="text-accent-400 font-medium text-sm mb-2">{info.details}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-xs font-light mb-4">{info.description}</p>
                  <a
                    href={info.link}
                    className="inline-flex items-center text-accent-400 hover:text-accent-300 font-medium text-sm transition-colors"
                  >
                    Contact Now
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-24 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-display-md md:text-display-lg font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
                Send Us a Message
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 font-light leading-relaxed">
                Fill out the form below and we'll get back to you within 24 hours
              </p>
            </div>

            <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 md:p-12 border border-gray-200 dark:border-gray-700">
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-green-400 mb-2 font-display">
                    Message Sent!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Thank you for reaching out. We'll respond to your message within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors font-sans"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors font-sans"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="inquiryType" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                        Inquiry Type
                      </label>
                      <select
                        id="inquiryType"
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors font-sans"
                      >
                        {inquiryTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors font-sans"
                        placeholder="Brief subject of your message"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors font-sans resize-none"
                      placeholder="Please provide details about your inquiry..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-accent-500 hover:bg-accent-600 text-gray-900 dark:text-white px-8 py-4 rounded-full font-medium text-base transition-colors shadow-lg hover:shadow-xl flex items-center justify-center font-sans"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-white dark:bg-black">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-display-md md:text-display-lg font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 font-light leading-relaxed">
                Quick answers to common questions
              </p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 font-display">{faq.question}</h3>
                  <p className="text-gray-600 dark:text-gray-300 font-light leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Can't find what you're looking for?
              </p>
              <button className="bg-accent-500 hover:bg-accent-600 text-gray-900 dark:text-white px-6 py-3 rounded-full font-medium text-sm transition-colors font-sans">
                Ask a Question
              </button>
            </div>
          </div>
        </section>

        {/* Office Hours */}
        <section className="py-24 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 md:p-12 border border-gray-200 dark:border-gray-700 text-center">
              <div className="w-16 h-16 bg-accent-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-accent-400" />
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-4 font-display">
                Office Hours
              </h2>
              <div className="space-y-2 text-gray-600 dark:text-gray-300 mb-8">
                <p><strong>Monday - Friday:</strong> 9:00 AM - 5:00 PM (WAT)</p>
                <p><strong>Saturday:</strong> 10:00 AM - 2:00 PM (WAT)</p>
                <p><strong>Sunday:</strong> Closed</p>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-light">
                Emergency inquiries will be responded to within 24 hours regardless of office hours.
              </p>
            </div>
          </div>
        </section>
      </Layout>

    </>
  );
};

export default Contact;