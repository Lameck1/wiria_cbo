/**
 * Impact Stats Section
 * Animated counters and decorative elements
 */

import { useRef, useEffect, useState } from 'react';

import { motion, useInView } from 'framer-motion';

interface ImpactStat {
  label: string;
  value: string;
  target: number;
  description: string;
}

interface ImpactStatsSectionProps {
  stats: ImpactStat[];
}

function Counter({ target, duration = 2 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);

      setCount(Math.floor(progress * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, target, duration]);

  return (
    <p
      ref={ref}
      className="mb-2 bg-gradient-to-r from-wiria-blue-dark to-blue-700 bg-clip-text text-5xl font-bold text-transparent md:text-6xl"
    >
      {count.toLocaleString()}+
    </p>
  );
}

export function ImpactStatsSection({ stats }: ImpactStatsSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="section-gradient-green relative overflow-hidden py-20">
      {/* decorative floating elements */}
      <div className="absolute left-10 top-10 h-24 w-24 animate-float rounded-full bg-wiria-blue-dark/5 blur-xl" />
      <div
        className="absolute right-1/4 top-1/3 h-16 w-16 animate-float rounded-full bg-wiria-yellow/10 blur-lg"
        style={{ animationDelay: '0.5s' }}
      />
      <div
        className="absolute bottom-10 right-10 h-32 w-32 animate-float rounded-full bg-wiria-yellow/10 blur-xl"
        style={{ animationDelay: '1s' }}
      />
      <div
        className="absolute bottom-1/4 left-1/4 h-20 w-20 animate-float rounded-full bg-green-200/20 blur-lg"
        style={{ animationDelay: '1.5s' }}
      />

      <div className="container relative z-10 mx-auto px-4 lg:px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-wiria-blue-dark md:text-4xl">Our Impact</h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '6rem' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mb-6 h-1 rounded-full bg-gradient-to-r from-wiria-yellow to-wiria-green-light"
          />
          <p className="mx-auto max-w-2xl text-gray-600">
            Making a measurable difference in Homa Bay County since 2019
          </p>
        </motion.div>

        <div id="impact-counters" className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={
                isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }
              }
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group relative"
            >
              {/* Pulsing glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-wiria-yellow/20 to-wiria-green-light/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative rounded-2xl border border-white/50 bg-white/80 p-8 text-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <Counter target={stat.target} />
                <p className="text-lg font-semibold text-wiria-blue-dark">{stat.label}</p>
                {stat.description && (
                  <p className="mt-2 text-sm text-gray-500">{stat.description}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
