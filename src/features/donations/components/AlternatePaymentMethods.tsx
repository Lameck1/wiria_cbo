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
    void navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="bank-details" className="relative mt-16">
      {/* Background Decorative Element */}
      <div className="absolute -inset-4 -z-10 rounded-[3rem] bg-gradient-to-tr from-[#006838]/5 to-[#fdb813]/5 blur-2xl" />

      <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-[#006838]/10 bg-white p-8 shadow-xl sm:p-12">
        {/* Branding Stripe */}
        <div className="absolute left-0 top-0 flex h-2 w-full">
          <div className="flex-[3] bg-[#006838]" />
          <div className="flex-1 bg-[#fdb813]" />
        </div>

        <div className="flex flex-col items-center gap-12 lg:flex-row">
          {/* Left Side: Branding & Context */}
          <div className="flex-1 text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#006838] text-2xl text-white shadow-lg shadow-[#006838]/20">
                🏦
              </div>
              <h3 className="text-2xl font-black text-wiria-blue-dark">Direct Bank Deposit</h3>
            </div>
            <p className="mb-6 text-lg leading-relaxed text-gray-600">
              For large contributions or if you prefer traditional banking, you can deposit directly
              to our official project account.
            </p>
            <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
              <span className="rounded-full border border-[#006838]/10 bg-green-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#006838]">
                Safe & Secure
              </span>
              <span className="rounded-full border border-[#fdb813]/10 bg-amber-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#b48a00]">
                Official Account
              </span>
            </div>
          </div>

          {/* Right Side: Account Card */}
          <div className="w-full max-w-md flex-1">
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#006838] to-[#004d2a] p-8 shadow-2xl">
              {/* Decorative Pattern Overlay */}
              <div className="pointer-events-none absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

              {/* Bank Logo Area */}
              <div className="relative z-10 mb-10 flex items-start justify-between">
                <div className="text-white">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">
                    Affiliated Bank
                  </p>
                  <p className="text-sm font-black">Co-operative Bank</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
                  <span className="text-xl">🇰🇪</span>
                </div>
              </div>

              <div className="relative z-10 space-y-6">
                {BANK_DETAILS.map((detail) => (
                  <div key={detail.label} className="group/item">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-white/60">
                      {detail.label}
                    </p>
                    <div className="flex items-center justify-between gap-4">
                      <p
                        className={`font-bold tracking-tight text-white ${detail.isCopyable ? 'text-2xl font-black sm:text-3xl' : 'text-lg'}`}
                      >
                        {detail.value}
                      </p>
                      {detail.isCopyable && (
                        <button
                          onClick={() => handleCopy(detail.value)}
                          className={`flex items-center gap-2 rounded-xl p-2 transition-all duration-300 ${
                            copied
                              ? 'bg-green-400 text-wiria-blue-dark'
                              : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
                          title="Copy account number"
                        >
                          {copied ? (
                            <span className="text-[10px] font-bold uppercase tracking-tighter">
                              Copied!
                            </span>
                          ) : (
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                              />
                            </svg>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Gold "Chip" Accent */}
              <div className="relative z-10 mt-10 flex items-center justify-between border-t border-white/10 pt-6">
                <div className="h-7 w-10 rounded-md bg-gradient-to-br from-[#fdb813] to-[#d49a00] shadow-inner" />
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
                  WIRIA CBO OFFICIAL
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
