/**
 * Alternate Payment Methods Component
 * Displays bank account details for direct bank transfers with Co-op Bank branding
 */

import { useState } from 'react';

interface BankDetail {
    label: string;
    value: string;
    isCopyable?: boolean;
}

const BANK_DETAILS: BankDetail[] = [
    { label: 'Bank Name', value: 'Co-operative Bank of Kenya' },
    { label: 'Account Name', value: 'Wiria CBO' },
    { label: 'Account Number', value: '01134637920300', isCopyable: true },
    { label: 'Branch', value: 'Ndhiwa Branch' },
];

export function AlternatePaymentMethods() {
    const [copied, setCopied] = useState(false);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div id="bank-details" className="mt-16 relative">
            {/* Background Decorative Element */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#006838]/5 to-[#fdb813]/5 rounded-[3rem] blur-2xl -z-10" />

            <div className="bg-white border-2 border-[#006838]/10 p-8 sm:p-12 rounded-[2.5rem] shadow-xl overflow-hidden relative">
                {/* Branding Stripe */}
                <div className="absolute top-0 left-0 w-full h-2 flex">
                    <div className="flex-[3] bg-[#006838]" />
                    <div className="flex-1 bg-[#fdb813]" />
                </div>

                <div className="flex flex-col lg:flex-row gap-12 items-center">
                    {/* Left Side: Branding & Context */}
                    <div className="flex-1 text-center lg:text-left">
                        <div className="inline-flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-[#006838] rounded-xl flex items-center justify-center text-white text-2xl shadow-lg shadow-[#006838]/20">
                                🏦
                            </div>
                            <h3 className="text-2xl font-black text-wiria-blue-dark">
                                Direct Bank Deposit
                            </h3>
                        </div>
                        <p className="text-gray-600 text-lg leading-relaxed mb-6">
                            For large contributions or if you prefer traditional banking, you can deposit directly to our official project account.
                        </p>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                            <span className="px-4 py-1.5 bg-green-50 text-[#006838] rounded-full text-xs font-bold uppercase tracking-wider border border-[#006838]/10">
                                Safe & Secure
                            </span>
                            <span className="px-4 py-1.5 bg-amber-50 text-[#b48a00] rounded-full text-xs font-bold uppercase tracking-wider border border-[#fdb813]/10">
                                Official Account
                            </span>
                        </div>
                    </div>

                    {/* Right Side: Account Card */}
                    <div className="flex-1 w-full max-w-md">
                        <div className="bg-gradient-to-br from-[#006838] to-[#004d2a] p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
                            {/* Decorative Pattern Overlay */}
                            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

                            {/* Bank Logo Area */}
                            <div className="flex justify-between items-start mb-10 relative z-10">
                                <div className="text-white">
                                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-70 mb-1">Affiliated Bank</p>
                                    <p className="font-black text-sm">Co-operative Bank</p>
                                </div>
                                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                                    <span className="text-xl">🇰🇪</span>
                                </div>
                            </div>

                            <div className="space-y-6 relative z-10">
                                {BANK_DETAILS.map((detail) => (
                                    <div key={detail.label} className="group/item">
                                        <p className="text-[10px] uppercase tracking-widest text-white/60 font-bold mb-1">
                                            {detail.label}
                                        </p>
                                        <div className="flex items-center justify-between gap-4">
                                            <p className={`text-white font-bold tracking-tight ${detail.isCopyable ? 'text-2xl sm:text-3xl font-black' : 'text-lg'}`}>
                                                {detail.value}
                                            </p>
                                            {detail.isCopyable && (
                                                <button
                                                    onClick={() => handleCopy(detail.value)}
                                                    className={`p-2 rounded-xl transition-all duration-300 flex items-center gap-2 ${copied ? 'bg-green-400 text-wiria-blue-dark' : 'bg-white/10 text-white hover:bg-white/20'
                                                        }`}
                                                    title="Copy account number"
                                                >
                                                    {copied ? (
                                                        <span className="text-[10px] font-bold uppercase tracking-tighter">Copied!</span>
                                                    ) : (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                                        </svg>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Gold "Chip" Accent */}
                            <div className="mt-10 pt-6 border-t border-white/10 flex justify-between items-center relative z-10">
                                <div className="w-10 h-7 bg-gradient-to-br from-[#fdb813] to-[#d49a00] rounded-md shadow-inner" />
                                <p className="text-[10px] font-black text-white/40 tracking-widest uppercase">WIRIA CBO OFFICIAL</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
