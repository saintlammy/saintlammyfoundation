import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  RiArrowDownLine,
  RiBriefcase4Line,
  RiCheckboxCircleLine,
  RiHeart3Line,
  RiLoginBoxLine,
  RiMapPin2Line,
  RiSendPlaneLine,
  RiTeamLine,
  RiTimeLine,
  RiUserHeartLine,
} from 'react-icons/ri';
import SEOHead from '@/components/SEOHead';
import AboutHero from '@/components/about/AboutHero';
import { ActionLink } from '@/components/home/HomePrimitives';
import { pageSEO } from '@/lib/seo';

interface VolunteerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  interests: string[];
  availability: string;
  experience: string;
  motivation: string;
  skills: string;
  backgroundCheck: boolean;
  commitment: string;
}

interface VolunteerRole {
  id: string;
  title: string;
  description: string;
  required_skills: string[];
  time_commitment: string;
  location: string;
  spots_available: number | null;
  category: string;
}

const emptyForm: VolunteerFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  location: '',
  interests: [],
  availability: '',
  experience: '',
  motivation: '',
  skills: '',
  backgroundCheck: false,
  commitment: '',
};

const fallbackInterests = [
  'Administrative Support',
  'Fundraising',
  'Social Media',
  'Photography/Videography',
];

const Volunteer: React.FC = () => {
  const [formData, setFormData] = useState<VolunteerFormData>(emptyForm);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [volunteerOpportunities, setVolunteerOpportunities] = useState<VolunteerRole[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [rolesError, setRolesError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchOpportunities = async () => {
      try {
        const response = await fetch('/api/public/volunteer-roles', { signal: controller.signal });
        if (!response.ok) throw new Error('Volunteer opportunities could not be loaded.');
        const roles = await response.json();
        setVolunteerOpportunities(Array.isArray(roles) ? roles : []);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        console.error('Error fetching volunteer roles:', error);
        setRolesError('We could not load the current roles. You can still send a general application below.');
      } finally {
        if (!controller.signal.aborted) setLoadingRoles(false);
      }
    };

    fetchOpportunities();
    return () => controller.abort();
  }, []);

  const dedupedOpportunities = useMemo(() => {
    const seen = new Set<string>();
    return volunteerOpportunities.filter((role) => {
      const key = role.title.trim().toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [volunteerOpportunities]);

  const interests = useMemo(
    () => Array.from(new Set([...dedupedOpportunities.map((role) => role.title), ...fallbackInterests])),
    [dedupedOpportunities],
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/volunteer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.details
          ? `Validation failed:\n${data.details.join('\n')}`
          : data.message || data.error || 'Submission failed. Please try again.';
        throw new Error(errorMessage);
      }

      setIsSubmitted(true);
      setFormData(emptyForm);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? (event.target as HTMLInputElement).checked : value,
    }));
  };

  const handleInterestChange = (interest: string) => {
    setFormData((current) => ({
      ...current,
      interests: current.interests.includes(interest)
        ? current.interests.filter((item) => item !== interest)
        : [...current.interests, interest],
    }));
  };

  const applyForRole = (title: string) => {
    setFormData((current) => ({
      ...current,
      interests: current.interests.includes(title) ? current.interests : [...current.interests, title],
    }));
    document.getElementById('volunteer-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <SEOHead config={pageSEO.volunteer} />
      <main className="get-involved-page">
        <AboutHero
          eyebrow="Volunteer with us"
          title="Serve. Build hope."
          description="Join practical, people-centred work supporting vulnerable communities across Nigeria."
          image="/images/get-involved/volunteer-relief-preparation.webp"
          imageAlt="Nigerian volunteers preparing food relief packages together in a community hall"
          variant="impact"
        >
          <a href="#volunteer-form" className="home-action home-action-primary group">
            <span>Apply to volunteer</span>
            <span className="home-action-island" aria-hidden="true"><RiArrowDownLine /></span>
          </a>
          <ActionLink href="/volunteer/login" tone="secondary">Volunteer login</ActionLink>
        </AboutHero>

        <section className="involve-principles" aria-labelledby="volunteer-principles-title">
          <div className="involve-container involve-principles-grid">
            <div className="involve-principles-copy">
              <h2 id="volunteer-principles-title">Service that meets a real need</h2>
              <p>
                Volunteers strengthen the planning, care and follow-through behind every outreach. We match people to work where their time and experience can be useful.
              </p>
            </div>
            <div className="involve-principles-list">
              {[
                { icon: RiTeamLine, title: 'Work alongside the team', text: 'Support preparation, logistics and community engagement.' },
                { icon: RiUserHeartLine, title: 'Serve with dignity', text: 'Meet people with respect, care and responsible boundaries.' },
                { icon: RiHeart3Line, title: 'Use what you know', text: 'Bring professional, creative or practical skills to the mission.' },
              ].map((item) => (
                <article key={item.title} className="involve-principle-row">
                  <span className="involve-icon" aria-hidden="true"><item.icon /></span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="volunteer-roles" className="involve-roles" aria-labelledby="volunteer-roles-title">
          <div className="involve-container">
            <header className="involve-section-heading">
              <p className="involve-eyebrow">Current opportunities</p>
              <h2 id="volunteer-roles-title">Find your place in the work</h2>
              <p>Choose a listed role or send a general application if your skill set is different.</p>
            </header>

            {loadingRoles ? (
              <div className="involve-role-grid" aria-label="Loading volunteer opportunities" aria-busy="true">
                {[0, 1, 2, 3].map((item) => <div key={item} className="involve-role-skeleton" />)}
              </div>
            ) : rolesError ? (
              <div className="involve-state involve-state-error" role="status">
                <RiBriefcase4Line aria-hidden="true" />
                <div><h3>Current roles are temporarily unavailable</h3><p>{rolesError}</p></div>
                <a href="#volunteer-form">Send a general application</a>
              </div>
            ) : dedupedOpportunities.length === 0 ? (
              <div className="involve-state" role="status">
                <RiBriefcase4Line aria-hidden="true" />
                <div><h3>No specific roles are open right now</h3><p>General applications are welcome and will be reviewed for future outreach needs.</p></div>
                <a href="#volunteer-form">Send a general application</a>
              </div>
            ) : (
              <div className="involve-role-grid">
                {dedupedOpportunities.map((opportunity, index) => (
                  <article key={opportunity.id} className={`involve-role involve-role-${(index % 4) + 1}`}>
                    <div className="involve-role-heading">
                      <span className="involve-role-category">{opportunity.category || 'Volunteer role'}</span>
                      <h3>{opportunity.title}</h3>
                    </div>
                    <p>{opportunity.description}</p>
                    <dl className="involve-role-meta">
                      {opportunity.time_commitment && (
                        <div><dt><RiTimeLine aria-hidden="true" /> Time</dt><dd>{opportunity.time_commitment}</dd></div>
                      )}
                      {opportunity.location && (
                        <div><dt><RiMapPin2Line aria-hidden="true" /> Location</dt><dd>{opportunity.location}</dd></div>
                      )}
                      {opportunity.spots_available !== null && opportunity.spots_available > 0 && (
                        <div><dt><RiTeamLine aria-hidden="true" /> Openings</dt><dd>{opportunity.spots_available}</dd></div>
                      )}
                    </dl>
                    {opportunity.required_skills?.length > 0 && (
                      <div className="involve-role-skills" aria-label="Required skills">
                        {opportunity.required_skills.map((skill) => <span key={skill}>{skill}</span>)}
                      </div>
                    )}
                    <button type="button" onClick={() => applyForRole(opportunity.title)}>
                      Apply for this role <RiArrowDownLine aria-hidden="true" />
                    </button>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section id="volunteer-form" className="involve-application" aria-labelledby="volunteer-form-title">
          <div className="involve-container involve-application-grid">
            <aside className="involve-application-intro">
              <h2 id="volunteer-form-title">Tell us how you can help</h2>
              <p>Share your availability, experience and interests. Our team will review your application and contact you by email.</p>
              <div className="involve-application-note">
                <RiLoginBoxLine aria-hidden="true" />
                <div>
                  <strong>Already registered?</strong>
                  <Link href="/volunteer/login">Open the volunteer portal</Link>
                </div>
              </div>
            </aside>

            <div className="involve-form-shell">
              {isSubmitted ? (
                <div className="involve-success" role="status">
                  <RiCheckboxCircleLine aria-hidden="true" />
                  <h3>Application received</h3>
                  <p>Thank you for offering your time. Our team will review your application and respond within 5-7 business days.</p>
                  <button type="button" onClick={() => setIsSubmitted(false)}>Send another application</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="involve-form">
                  <div className="involve-form-grid">
                    <div className="involve-field">
                      <label htmlFor="firstName">First name <span aria-hidden="true">*</span></label>
                      <input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required autoComplete="given-name" />
                    </div>
                    <div className="involve-field">
                      <label htmlFor="lastName">Last name <span aria-hidden="true">*</span></label>
                      <input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required autoComplete="family-name" />
                    </div>
                    <div className="involve-field">
                      <label htmlFor="email">Email address <span aria-hidden="true">*</span></label>
                      <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required autoComplete="email" />
                    </div>
                    <div className="involve-field">
                      <label htmlFor="phone">Phone number <span aria-hidden="true">*</span></label>
                      <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required autoComplete="tel" />
                    </div>
                  </div>

                  <div className="involve-field">
                    <label htmlFor="location">Location <span aria-hidden="true">*</span></label>
                    <input id="location" name="location" value={formData.location} onChange={handleChange} required autoComplete="address-level2" placeholder="City, State" />
                  </div>

                  <fieldset className="involve-field involve-interest-fieldset">
                    <legend>Areas of interest <span aria-hidden="true">*</span></legend>
                    <p>Select at least one option.</p>
                    <div className="involve-interest-grid">
                      {interests.map((interest) => (
                        <label key={interest} className="involve-interest" data-selected={formData.interests.includes(interest)}>
                          <input type="checkbox" checked={formData.interests.includes(interest)} onChange={() => handleInterestChange(interest)} />
                          <span>{interest}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <div className="involve-field">
                    <label htmlFor="availability">Availability <span aria-hidden="true">*</span></label>
                    <select id="availability" name="availability" value={formData.availability} onChange={handleChange} required>
                      <option value="">Select your availability</option>
                      <option value="weekdays">Weekdays</option>
                      <option value="weekends">Weekends</option>
                      <option value="both">Both weekdays and weekends</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>

                  <div className="involve-field">
                    <label htmlFor="skills">Skills and qualifications <span aria-hidden="true">*</span></label>
                    <textarea id="skills" name="skills" value={formData.skills} onChange={handleChange} required rows={4} placeholder="Relevant skills, training or professional experience" />
                  </div>

                  <div className="involve-field">
                    <label htmlFor="experience">Previous volunteer experience <span aria-hidden="true">*</span></label>
                    <textarea id="experience" name="experience" value={formData.experience} onChange={handleChange} required rows={4} placeholder="Tell us about any previous community or volunteer work" />
                  </div>

                  <div className="involve-field">
                    <label htmlFor="motivation">Why do you want to volunteer? <span aria-hidden="true">*</span></label>
                    <textarea id="motivation" name="motivation" value={formData.motivation} onChange={handleChange} required minLength={10} rows={5} placeholder="What draws you to this work?" />
                  </div>

                  <div className="involve-field">
                    <label htmlFor="commitment">Time commitment <span aria-hidden="true">*</span></label>
                    <select id="commitment" name="commitment" value={formData.commitment} onChange={handleChange} required>
                      <option value="">Select your time commitment</option>
                      <option value="1-3 hours per week">1-3 hours per week</option>
                      <option value="4-6 hours per week">4-6 hours per week</option>
                      <option value="7-10 hours per week">7-10 hours per week</option>
                      <option value="10+ hours per week">10+ hours per week</option>
                      <option value="One-time event">One-time event</option>
                      <option value="Seasonal/Project-based">Seasonal or project-based</option>
                    </select>
                  </div>

                  <label className="involve-consent" data-selected={formData.backgroundCheck}>
                    <input id="backgroundCheck" name="backgroundCheck" type="checkbox" checked={formData.backgroundCheck} onChange={handleChange} required />
                    <span>I agree to a background check if it is required for the volunteer role. <span aria-hidden="true">*</span></span>
                  </label>

                  {submitError && (
                    <div className="involve-form-error" role="alert">
                      <strong>We could not submit your application.</strong>
                      <p className="whitespace-pre-line">{submitError}</p>
                    </div>
                  )}

                  <button type="submit" className="involve-submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting application...' : 'Submit application'}
                    <RiSendPlaneLine aria-hidden="true" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Volunteer;
