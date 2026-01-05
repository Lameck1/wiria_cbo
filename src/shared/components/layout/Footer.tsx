/**
 * Footer Component - Exact HTML Match
 * Global footer matching original index.html exactly
 */

import { Link } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gradient-to-b from-wiria-blue-dark to-slate-900 text-white">
            {/* Main Footer Content */}
            <div className="container mx-auto px-4 lg:px-6 pt-16 pb-8">
                {/* Top Section with Logo and Newsletter */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-12 pb-12 border-b border-white/10">
                    {/* Brand Section */}
                    <div className="lg:max-w-sm text-center lg:text-left">
                        <Link to={ROUTES.HOME} className="inline-flex items-center gap-3 mb-4">
                            <img
                                src={`${import.meta.env.BASE_URL}images/Wiria_CBO_Logo_NEW_IV.png`}
                                alt="WIRIA CBO"
                                className="h-14 w-auto"
                            />
                            <span className="text-2xl font-bold">WIRIA CBO</span>
                        </Link>
                        <p className="text-gray-300 text-sm leading-relaxed mb-6">
                            Wiria (Wellness, Inclusion, Rights, and Impact Advocates) Community Based Organization.
                            Empowering Communities, Enhancing Health, Championing Rights for Key and Vulnerable Populations.
                        </p>
                        <Link
                            to={ROUTES.DONATIONS}
                            className="inline-flex items-center gap-2 bg-wiria-yellow text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            Support Our Mission
                        </Link>
                    </div>

                    {/* Newsletter Signup */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 lg:p-8 lg:max-w-md w-full border border-white/10">
                        <h4 className="font-bold text-lg mb-2">Stay Updated</h4>
                        <p className="text-gray-300 text-sm mb-4">
                            Subscribe to our newsletter for updates on our programs and community impact.
                        </p>
                        <form className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-wiria-yellow focus:border-transparent text-sm"
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-wiria-green-light text-wiria-blue-dark font-bold rounded-lg hover:bg-green-400 transition-all whitespace-nowrap text-sm"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Links Grid - Flexbox Layout */}
                <div className="flex flex-wrap gap-8 lg:gap-12 justify-center lg:justify-between mb-12">
                    {/* Explore */}
                    <div className="flex-1 min-w-[200px] text-center lg:text-left">
                        <h4 className="font-bold text-wiria-yellow mb-4 text-sm uppercase tracking-wider">
                            Explore
                        </h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link to={ROUTES.ABOUT} className="text-gray-300 hover:text-white transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to={ROUTES.PROGRAMS} className="text-gray-300 hover:text-white transition-colors">
                                    Our Programs
                                </Link>
                            </li>
                            <li>
                                <Link to={ROUTES.MEMBERSHIP} className="text-gray-300 hover:text-white transition-colors">
                                    Get Involved
                                </Link>
                            </li>
                            <li>
                                <Link to={ROUTES.MEMBER_MEETINGS} className="text-gray-300 hover:text-white transition-colors">
                                    Meetings
                                </Link>
                            </li>
                            <li>
                                <Link to={ROUTES.DONATIONS} className="text-gray-300 hover:text-white transition-colors">
                                    Donate
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Opportunities */}
                    <div className="flex-1 min-w-[200px] text-center lg:text-left">
                        <h4 className="font-bold text-wiria-yellow mb-4 text-sm uppercase tracking-wider">
                            Opportunities
                        </h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link to={ROUTES.CAREERS} className="text-gray-300 hover:text-white transition-colors">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link to={ROUTES.OPPORTUNITIES} className="text-gray-300 hover:text-white transition-colors">
                                    Volunteering
                                </Link>
                            </li>
                            <li>
                                <Link to={`${ROUTES.RESOURCES}#tenders`} className="text-gray-300 hover:text-white transition-colors">
                                    Tenders
                                </Link>
                            </li>
                            <li>
                                <Link to={`${ROUTES.OPPORTUNITIES}#internships`} className="text-gray-300 hover:text-white transition-colors">
                                    Internships
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="flex-1 min-w-[200px] text-center lg:text-left">
                        <h4 className="font-bold text-wiria-yellow mb-4 text-sm uppercase tracking-wider">
                            Resources
                        </h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link to={ROUTES.RESOURCES} className="text-gray-300 hover:text-white transition-colors">
                                    Documents
                                </Link>
                            </li>
                            <li>
                                <Link to={`${ROUTES.RESOURCES}#publications`} className="text-gray-300 hover:text-white transition-colors">
                                    Publications
                                </Link>
                            </li>
                            <li>
                                <Link to={`${ROUTES.RESOURCES}#annual-reports`} className="text-gray-300 hover:text-white transition-colors">
                                    Annual Reports
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Transparency */}
                    <div className="flex-1 min-w-[200px] text-center lg:text-left">
                        <h4 className="font-bold text-wiria-yellow mb-4 text-sm uppercase tracking-wider">
                            Transparency
                        </h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link to={ROUTES.STAFF_LOGIN} className="text-gray-300 hover:text-white transition-colors">
                                    Staff Portal
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="text-gray-300 hover:text-white transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to={ROUTES.SAFEGUARDING} className="text-gray-300 hover:text-white transition-colors inline-flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                    Report a Concern
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Us */}
                    <div className="flex-1 min-w-[200px] text-center lg:text-left">
                        <h4 className="font-bold text-wiria-yellow mb-4 text-sm uppercase tracking-wider">
                            Contact Us
                        </h4>
                        <ul className="space-y-3 text-sm flex flex-col items-center lg:items-start">
                            <li className="inline-flex items-start gap-3 text-gray-300">
                                <svg className="w-5 h-5 text-wiria-yellow flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>
                                    Wanyaga Village, Ndhiwa<br />
                                    Homa Bay County, Kenya
                                </span>
                            </li>
                            <li className="inline-flex items-center gap-3 text-gray-300">
                                <svg className="w-5 h-5 text-wiria-yellow flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <a href="mailto:mwiriacbo@gmail.com" className="hover:text-wiria-yellow transition-colors">
                                    mwiriacbo@gmail.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Social Links & Copyright Bar */}
                <div className="pt-8 border-t border-white/10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        {/* Social Icons */}
                        <div className="flex items-center gap-4">
                            <span className="text-gray-400 text-sm hidden sm:block">Follow us:</span>
                            <div className="flex gap-3">
                                <a
                                    href="https://web.facebook.com/profile.php?id=61576279347609"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Facebook"
                                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-wiria-yellow hover:scale-110 transition-all"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v2.385z" />
                                    </svg>
                                </a>
                                <a
                                    href="#"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="X (formerly Twitter)"
                                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-wiria-yellow hover:scale-110 transition-all"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                </a>
                                <a
                                    href="https://www.linkedin.com/company/wiria-cbo/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="LinkedIn"
                                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-wiria-yellow hover:scale-110 transition-all"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.98v16h4.98v-8.396c0-2.002.356-4.004 2.982-4.004 2.584 0 2.584 2.336 2.584 4.004v8.396h4.98v-10.396c0-5.522-2.982-8.604-6.982-8.604-3.5 0-5.022 1.926-5.982 4.004z" />
                                    </svg>
                                </a>
                                <a
                                    href="https://www.youtube.com/@WIRIACBO"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="YouTube"
                                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-500 hover:scale-110 transition-all"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Copyright */}
                        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm text-gray-400 text-center">
                            <p>&copy; {currentYear} WIRIA Community Based Organization.</p>
                            <span className="hidden sm:block">•</span>
                            <p>All Rights Reserved.</p>
                            <span className="hidden sm:block">•</span>
                            <a href="#" className="hover:text-wiria-yellow transition-colors">Kenya Data Protection Act 2019</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
