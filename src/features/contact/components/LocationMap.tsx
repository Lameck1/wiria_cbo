/**
 * LocationMap Component
 * Location info and map - designed to be inside a card container
 */

import { motion } from 'framer-motion';

export function LocationMap() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="mb-2 text-2xl font-bold text-wiria-blue-dark md:text-3xl">Find Us</h2>
        <div className="h-1 w-20 rounded-full bg-gradient-to-r from-wiria-yellow to-wiria-green-light" />
      </div>

      {/* Our Address */}
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-wiria-blue-dark/10">
          <svg
            className="h-5 w-5 text-wiria-blue-dark"
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
        </div>
        <div>
          <h4 className="mb-1 font-semibold text-gray-800">Our Address</h4>
          <p className="text-sm text-gray-600">
            Wanyaga Village, Kobita Sub-Location,
            <br />
            Ndhiwa Sub-County, Homa Bay County, Kenya
            <br />
            <span className="text-xs text-gray-500">Postal: 40302-12, Ndhiwa</span>
          </p>
        </div>
      </div>

      {/* Map container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="h-[220px] w-full overflow-hidden rounded-xl border border-gray-200 shadow-md"
      >
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src="https://www.openstreetmap.org/export/embed.html?bbox=34.32015419006348%2C-0.7629577399424168%2C34.52055931091309%2C-0.6959523424916695&amp;layer=mapnik&amp;marker=-0.7294551980830725%2C34.42035675048828"
          title="WIRIA CBO Location Map"
          className="h-full w-full"
        />
      </motion.div>

      {/* Contact Info Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Contact Details */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <svg
              className="h-5 w-5 text-wiria-yellow"
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
            <h4 className="text-sm font-semibold text-gray-800">Contact</h4>
          </div>
          <div className="space-y-1.5 text-sm">
            <a
              href="mailto:wiriacbo@gmail.com"
              className="flex items-center gap-2 text-gray-600 transition-colors hover:text-wiria-yellow"
            >
              wiriacbo@gmail.com
            </a>
            <a
              href="tel:+254705929293"
              className="flex items-center gap-2 text-gray-600 transition-colors hover:text-wiria-yellow"
            >
              +254 705 929 293
            </a>
          </div>
        </div>

        {/* Office Hours */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <svg
              className="h-5 w-5 text-wiria-green-light"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h4 className="text-sm font-semibold text-gray-800">Hours</h4>
          </div>
          <p className="text-sm text-gray-600">
            Mon - Fri: 8AM - 5PM
            <br />
            Sat & Sun: <span className="font-semibold text-red-500">Closed</span>
          </p>
        </div>
      </div>

      {/* Get Directions Button */}
      <a
        href="https://www.google.com/maps/dir/?api=1&destination=-0.7294551980830725,34.42035675048828"
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-wiria-blue-dark to-blue-800 px-4 py-3 font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
        Get Directions
      </a>
    </div>
  );
}
