/**
 * Contact Page
 * Contact Us - Get in touch with WIRIA CBO
 * Layout: Left = Map/Address/Contact Details | Right = Form Only
 */

import { Layout } from '@/shared/components/layout/Layout';
import { PageHero } from '@/shared/components/sections/PageHero';
import {
    ContactFormSection,
    SafeguardingCallout,
    LocationMap,
} from '@/features/contact';

function ContactPage() {
    return (
        <Layout>
            <main>
                {/* Hero Section */}
                <PageHero
                    badge="Get In Touch"
                    title="Contact Us"
                    subtitle="We'd love to hear from you. Reach out with questions, comments, or concerns"
                    backgroundImage="/images/contact-hero.png"
                />

                {/* Contact Section */}
                <section className="py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white">
                    <div className="container mx-auto px-4 lg:px-6">
                        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                            {/* Left Column - Map, Address, Contact Details */}
                            <div className="lg:sticky lg:top-24 order-2 lg:order-1 bg-white/80 backdrop-blur-sm p-6 md:p-8 lg:p-10 rounded-2xl shadow-xl border border-gray-100/50 relative overflow-hidden">
                                {/* Decorative gradient blob */}
                                <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-wiria-blue-dark/10 to-wiria-green-light/20 rounded-full blur-3xl pointer-events-none" />
                                <LocationMap />
                            </div>

                            {/* Right Column - Form Only */}
                            <div className="bg-white/80 backdrop-blur-sm p-6 md:p-8 lg:p-10 rounded-2xl shadow-xl border border-gray-100/50 relative overflow-hidden order-1 lg:order-2">
                                {/* Decorative gradient blob */}
                                <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-wiria-yellow/20 to-wiria-green-light/20 rounded-full blur-3xl pointer-events-none" />

                                <h2 className="text-2xl md:text-3xl font-bold text-wiria-blue-dark mb-2 relative">
                                    Send us a Message
                                </h2>
                                <div className="w-20 h-1 bg-gradient-to-r from-wiria-yellow to-wiria-green-light rounded-full mb-6" />
                                <p className="text-gray-600 mb-6">
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
        </Layout>
    );
}

export default ContactPage;
