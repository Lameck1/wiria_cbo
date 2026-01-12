/**
 * Contact Page
 * Contact Us - Get in touch with WIRIA CBO
 * Layout: Left = Map/Address/Contact Details | Right = Form Only
 */

import { PageHero } from '@/shared/components/sections/PageHero';
import { ContactFormSection, SafeguardingCallout, LocationMap } from '@/features/contact';

function ContactPage() {
  return (
    <main>
      {/* Hero Section */}
      <PageHero
        badge="Get In Touch"
        title="Contact Us"
        subtitle="We'd love to hear from you. Reach out with questions, comments, or concerns"
        backgroundImage="/images/contact-hero.png"
      />

      {/* Contact Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Left Column - Map, Address, Contact Details */}
            <div className="relative order-2 overflow-hidden rounded-2xl border border-gray-100/50 bg-white/80 p-6 shadow-xl backdrop-blur-sm md:p-8 lg:sticky lg:top-24 lg:order-1 lg:p-10">
              {/* Decorative gradient blob */}
              <div className="pointer-events-none absolute -left-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-wiria-blue-dark/10 to-wiria-green-light/20 blur-3xl" />
              <LocationMap />
            </div>

            {/* Right Column - Form Only */}
            <div className="relative order-1 overflow-hidden rounded-2xl border border-gray-100/50 bg-white/80 p-6 shadow-xl backdrop-blur-sm md:p-8 lg:order-2 lg:p-10">
              {/* Decorative gradient blob */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-wiria-yellow/20 to-wiria-green-light/20 blur-3xl" />

              <h2 className="relative mb-2 text-2xl font-bold text-wiria-blue-dark md:text-3xl">
                Send us a Message
              </h2>
              <div className="mb-6 h-1 w-20 rounded-full bg-gradient-to-r from-wiria-yellow to-wiria-green-light" />
              <p className="mb-6 text-gray-600">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>

              {/* Contact Form */}
              <ContactFormSection />

              {/* Safeguarding Callout */}
              <SafeguardingCallout />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ContactPage;
