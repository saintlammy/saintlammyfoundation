import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import {
  RiArrowDownLine,
  RiArrowRightUpLine,
  RiCheckboxCircleLine,
  RiGlobalLine,
  RiMailLine,
  RiMapPin2Line,
  RiPhoneLine,
  RiQuestionAnswerLine,
  RiSendPlaneLine,
  RiTimeLine,
} from 'react-icons/ri';
import SEOHead from '@/components/SEOHead';
import AboutHero from '@/components/about/AboutHero';
import { ActionLink } from '@/components/home/HomePrimitives';
import { pageSEO } from '@/lib/seo';

interface ContactInfoItem {
  icon: string;
  title: string;
  details: string;
  description: string;
  link: string;
}

interface OfficeHours {
  weekday: string;
  saturday: string;
  sunday: string;
  note: string;
}

interface ContactProps {
  contactInfo: ContactInfoItem[];
  officeHours: OfficeHours | null;
}

interface InquiryType {
  id: string;
  title: string;
}

const fallbackContactInfo: ContactInfoItem[] = [
  {
    icon: 'Mail',
    title: 'Email',
    details: 'info@saintlammyfoundation.org',
    description: 'For general, donor and programme enquiries.',
    link: 'mailto:info@saintlammyfoundation.org',
  },
  {
    icon: 'Phone',
    title: 'Phone',
    details: '+234 706 307 6704',
    description: 'Call during the listed office hours.',
    link: 'tel:+2347063076704',
  },
  {
    icon: 'MapPin',
    title: 'Location',
    details: 'Lagos, Nigeria',
    description: 'Visits and meetings are arranged in advance.',
    link: 'https://maps.google.com/?q=Lagos,Nigeria',
  },
  {
    icon: 'Globe',
    title: 'Social',
    details: '@saintlammyfoundation',
    description: 'Follow current outreach and foundation updates.',
    link: 'https://www.instagram.com/saintlammyfoundation/',
  },
];

const fallbackOfficeHours: OfficeHours = {
  weekday: '9:00 AM to 5:00 PM (WAT)',
  saturday: '10:00 AM to 2:00 PM (WAT)',
  sunday: 'Closed',
  note: 'Messages sent outside these hours will be reviewed when the team is next available.',
};

const fallbackInquiryTypes: InquiryType[] = [
  { id: 'general', title: 'General enquiry' },
  { id: 'partnership', title: 'Partnership' },
  { id: 'volunteer', title: 'Volunteering' },
  { id: 'donation', title: 'Donation support' },
];

const iconMap = {
  Mail: RiMailLine,
  Phone: RiPhoneLine,
  MapPin: RiMapPin2Line,
  Globe: RiGlobalLine,
};

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  inquiryType: '',
  subject: '',
  message: '',
};

const faqs = [
  {
    question: 'How can I make a donation?',
    answer: 'Use the Donate page to choose from the currently available payment methods. The donation form will guide you through the details for each method.',
  },
  {
    question: 'Can I volunteer with the foundation?',
    answer: 'Yes. The Volunteer page lists current roles and includes a general application for people whose skills do not match a listed opening.',
  },
  {
    question: 'Where can I review your reporting?',
    answer: 'Our Transparency page brings together foundation reporting, governance information and records that help supporters understand how the work is managed.',
  },
  {
    question: 'Can an organisation propose a partnership?',
    answer: 'Yes. Choose Partnership in the form and tell us what your organisation would like to contribute or build with the foundation.',
  },
];

const Contact: React.FC<ContactProps> = ({ contactInfo: apiContactInfo, officeHours: apiOfficeHours }) => {
  const [formData, setFormData] = useState(emptyForm);
  const [inquiryTypes, setInquiryTypes] = useState<InquiryType[]>([]);
  const [loadingInquiryTypes, setLoadingInquiryTypes] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const contactInfo = useMemo(
    () => (apiContactInfo.length > 0 ? apiContactInfo : fallbackContactInfo),
    [apiContactInfo],
  );
  const officeHours = apiOfficeHours || fallbackOfficeHours;

  useEffect(() => {
    const controller = new AbortController();

    const fetchInquiryTypes = async () => {
      try {
        const response = await fetch('/api/public/contact-inquiry-types', { signal: controller.signal });
        if (!response.ok) throw new Error('Inquiry types could not be loaded.');
        const types = await response.json();
        const availableTypes = Array.isArray(types) && types.length > 0 ? types : fallbackInquiryTypes;
        setInquiryTypes(availableTypes);
        setFormData((current) => ({ ...current, inquiryType: current.inquiryType || availableTypes[0].id }));
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        console.error('Error fetching inquiry types:', error);
        setInquiryTypes(fallbackInquiryTypes);
        setFormData((current) => ({ ...current, inquiryType: current.inquiryType || fallbackInquiryTypes[0].id }));
      } finally {
        if (!controller.signal.aborted) setLoadingInquiryTypes(false);
      }
    };

    fetchInquiryTypes();
    return () => controller.abort();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const inquiryTitle = inquiryTypes.find((type) => type.id === formData.inquiryType)?.title;
    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      subject: inquiryTitle ? `${inquiryTitle}: ${formData.subject}` : formData.subject,
      message: formData.message,
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        const details = Array.isArray(result.details) ? result.details.join(' ') : '';
        throw new Error(details || result.message || result.error || 'Your message could not be sent.');
      }
      setIsSubmitted(true);
      setFormData({ ...emptyForm, inquiryType: inquiryTypes[0]?.id || 'general' });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Your message could not be sent. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEOHead config={pageSEO.contact} />
      <main className="editorial-page contact-editorial-page">
        <AboutHero
          eyebrow="Contact the foundation"
          title="Start a useful conversation."
          description="Talk with our team about support, volunteering, partnerships or foundation programmes."
          image="/images/editorial/contact-community-conversation.webp"
          imageAlt="Women and Saintlammy Foundation team members speaking together during a Lagos community outreach"
          variant="story"
        >
          <a href="#contact-form" className="home-action home-action-primary group">
            <span>Send a message</span>
            <span className="home-action-island" aria-hidden="true"><RiArrowDownLine /></span>
          </a>
          <ActionLink href="/partner" tone="secondary">Discuss a partnership</ActionLink>
        </AboutHero>

        <section className="contact-channels" aria-labelledby="contact-channels-title">
          <div className="editorial-container contact-channels-grid">
            <header>
              <p className="editorial-eyebrow">Direct channels</p>
              <h2 id="contact-channels-title">Reach the right place.</h2>
              <p>Choose a direct channel or use the form to give the team more context.</p>
            </header>
            <div className="contact-channel-list">
              {contactInfo.map((item) => {
                const Icon = iconMap[item.icon as keyof typeof iconMap] || RiMailLine;
                const external = item.link.startsWith('http');
                return (
                  <a key={`${item.title}-${item.details}`} href={item.link} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>
                    <span className="contact-channel-icon"><Icon aria-hidden="true" /></span>
                    <span><strong>{item.title}</strong><small>{item.description}</small></span>
                    <span className="contact-channel-detail">{item.details}</span>
                    <RiArrowRightUpLine aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        <section id="contact-form" className="contact-form-section" aria-labelledby="contact-form-title">
          <div className="editorial-container contact-form-grid">
            <aside className="contact-form-intro">
              <p className="editorial-eyebrow">Send a message</p>
              <h2 id="contact-form-title">Give us the context.</h2>
              <p>Tell us what you need, who you represent and the best way to continue the conversation.</p>
              <div className="contact-hours">
                <RiTimeLine aria-hidden="true" />
                <div>
                  <h3>Office hours</h3>
                  <dl>
                    <div><dt>Monday to Friday</dt><dd>{officeHours.weekday}</dd></div>
                    <div><dt>Saturday</dt><dd>{officeHours.saturday}</dd></div>
                    <div><dt>Sunday</dt><dd>{officeHours.sunday}</dd></div>
                  </dl>
                  <p>{officeHours.note}</p>
                </div>
              </div>
            </aside>

            <div className="contact-form-shell">
              {isSubmitted ? (
                <div className="contact-success" role="status">
                  <RiCheckboxCircleLine aria-hidden="true" />
                  <h3>Your message has been received.</h3>
                  <p>Thank you for contacting Saintlammy Foundation. The team will review your message and respond when appropriate.</p>
                  <button type="button" onClick={() => setIsSubmitted(false)}>Send another message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="contact-form-row">
                    <label>
                      <span>Full name <em>*</em></span>
                      <input name="name" value={formData.name} onChange={handleChange} autoComplete="name" placeholder="Your full name" required />
                    </label>
                    <label>
                      <span>Email address <em>*</em></span>
                      <input name="email" type="email" value={formData.email} onChange={handleChange} autoComplete="email" placeholder="you@example.com" required />
                    </label>
                  </div>
                  <div className="contact-form-row">
                    <label>
                      <span>Phone number</span>
                      <input name="phone" type="tel" value={formData.phone} onChange={handleChange} autoComplete="tel" placeholder="+234…" />
                    </label>
                    <label>
                      <span>Enquiry type</span>
                      <select name="inquiryType" value={formData.inquiryType} onChange={handleChange} disabled={loadingInquiryTypes}>
                        {loadingInquiryTypes && <option value="">Loading options…</option>}
                        {inquiryTypes.map((type) => <option key={type.id} value={type.id}>{type.title}</option>)}
                      </select>
                    </label>
                  </div>
                  <label>
                    <span>Subject <em>*</em></span>
                    <input name="subject" value={formData.subject} onChange={handleChange} placeholder="A short summary of your enquiry" required />
                  </label>
                  <label>
                    <span>Message <em>*</em></span>
                    <textarea name="message" value={formData.message} onChange={handleChange} rows={7} minLength={10} placeholder="Share the details that will help our team understand your enquiry." required />
                  </label>
                  {submitError && <div className="contact-form-error" role="alert"><strong>Message not sent.</strong><span>{submitError}</span></div>}
                  <button type="submit" disabled={isSubmitting}>
                    <span>{isSubmitting ? 'Sending…' : 'Send message'}</span>
                    <RiSendPlaneLine aria-hidden="true" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        <section className="contact-faq" aria-labelledby="contact-faq-title">
          <div className="editorial-container contact-faq-grid">
            <header>
              <RiQuestionAnswerLine aria-hidden="true" />
              <p className="editorial-eyebrow">Before you write</p>
              <h2 id="contact-faq-title">A few useful answers.</h2>
              <p>These links may get you to the right information faster.</p>
              <div><Link href="/donate">Donate</Link><Link href="/volunteer">Volunteer</Link><Link href="/transparency">Transparency</Link></div>
            </header>
            <div className="contact-faq-list">
              {faqs.map((faq, index) => (
                <details key={faq.question} open={index === 0}>
                  <summary>{faq.question}<span aria-hidden="true">+</span></summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps<ContactProps> = async () => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const [contactInfoRes, officeHoursRes] = await Promise.all([
      fetch(`${baseUrl}/api/page-content?slug=contact&section=info`),
      fetch(`${baseUrl}/api/page-content?slug=contact&section=office-hours`),
    ]);
    const contactInfoData = contactInfoRes.ok ? await contactInfoRes.json() : [];
    const officeHoursData = officeHoursRes.ok ? await officeHoursRes.json() : [];
    return {
      props: {
        contactInfo: Array.isArray(contactInfoData) ? contactInfoData.map((item: { data: ContactInfoItem }) => item.data).filter(Boolean) : [],
        officeHours: Array.isArray(officeHoursData) && officeHoursData.length > 0 ? officeHoursData[0].data : null,
      },
      revalidate: 3600,
    };
  } catch (error) {
    console.error('Error fetching contact page content:', error);
    return { props: { contactInfo: [], officeHours: null }, revalidate: 3600 };
  }
};

export default Contact;
