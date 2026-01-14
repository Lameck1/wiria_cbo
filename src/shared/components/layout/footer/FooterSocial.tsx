interface SocialLink {
  href?: string;
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
  hoverColor?: string;
}

export function FooterSocial() {
  const socialLinks: SocialLink[] = [
    {
      href: 'https://web.facebook.com/profile.php?id=61576279347609',
      label: 'Facebook',
      hoverColor: 'hover:bg-wiria-yellow',
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v2.385z" />
        </svg>
      ),
    },
    {
      label: 'X (formerly Twitter) - Coming soon',
      disabled: true,
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      href: 'https://www.linkedin.com/company/wiria-cbo/',
      label: 'LinkedIn',
      hoverColor: 'hover:bg-wiria-yellow',
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.98v16h4.98v-8.396c0-2.002.356-4.004 2.982-4.004 2.584 0 2.584 2.336 2.584 4.004v8.396h4.98v-10.396c0-5.522-2.982-8.604-6.982-8.604-3.5 0-5.022 1.926-5.982 4.004z" />
        </svg>
      ),
    },
    {
      href: 'https://www.youtube.com/@WIRIACBO',
      label: 'YouTube',
      hoverColor: 'hover:bg-red-500',
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex items-center gap-4">
      <span className="hidden text-sm text-gray-400 sm:block">Follow us:</span>
      <div className="flex gap-3">
        {socialLinks.map((link) =>
          link.disabled ? (
            <span
              key={link.label}
              aria-label={link.label}
              className="flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-full bg-white/10 opacity-50"
            >
              {link.icon}
            </span>
          ) : (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className={`flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-all hover:scale-110 ${link.hoverColor || 'hover:bg-wiria-yellow'}`}
            >
              {link.icon}
            </a>
          )
        )}
      </div>
    </div>
  );
}
