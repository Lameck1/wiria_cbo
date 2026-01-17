export function FooterContact() {
  return (
    <div className="min-w-[200px] flex-1 text-center lg:text-left">
      <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-wiria-yellow">
        Contact Us
      </h4>
      <ul className="flex flex-col items-center space-y-3 text-sm lg:items-start">
        <li className="inline-flex items-start gap-3 text-gray-300">
          <svg
            className="mt-0.5 h-5 w-5 flex-shrink-0 text-wiria-yellow"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>
            Wanyaga Village, Ndhiwa
            <br />
            Homa Bay County, Kenya
          </span>
        </li>
        <li className="inline-flex items-center gap-3 text-gray-300">
          <svg
            className="h-5 w-5 flex-shrink-0 text-wiria-yellow"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <a href="mailto:wiriacbo@gmail.com" className="transition-colors hover:text-wiria-yellow">
            wiriacbo@gmail.com
          </a>
        </li>
      </ul>
    </div>
  );
}
