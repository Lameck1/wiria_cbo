/**
 * Governance Section
 * Organization structure: 3 levels, Secretariat with Tree View
 */

import { motion } from 'framer-motion';

import { GOVERNANCE_LEVELS, SECRETARIAT_TEAM } from '../constants/aboutData';

export function GovernanceSection() {
  const leadership = SECRETARIAT_TEAM.find((d) => d.title === 'Leadership')?.members[0];
  const departments = SECRETARIAT_TEAM.filter((d) => d.title !== 'Leadership');

  return (
    <section className="overflow-hidden bg-white py-24">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-4xl font-bold text-wiria-blue-dark md:text-5xl">
            Our Governance
          </h2>
          <div className="mx-auto mb-8 h-1.5 w-24 rounded-full bg-gradient-to-r from-wiria-yellow to-wiria-green-light" />
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600">
            WIRIA CBO maintains a transparent, accountable governance structure with clear
            leadership from our community members to professional staff.
          </p>
        </div>

        {/* Governance Levels Overview */}
        <div className="mx-auto mb-32 grid max-w-6xl gap-8 md:grid-cols-3">
          {GOVERNANCE_LEVELS.map((level, index) => (
            <motion.div
              key={level.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group rounded-2xl border border-gray-50 bg-white p-10 text-center shadow-lg transition-all duration-300 hover:shadow-2xl"
            >
              <div className="mb-8 flex justify-center">
                <div
                  className={`h-20 w-20 ${level.gradient} flex items-center justify-center rounded-3xl text-3xl font-bold text-white shadow-xl transition-transform group-hover:scale-110`}
                >
                  {level.level}
                </div>
              </div>
              <h4 className="mb-4 text-2xl font-bold text-wiria-blue-dark">{level.title}</h4>
              <p className="text-lg text-gray-600">{level.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Secretariat Org Chart / Tree */}
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 px-4 text-center">
            <h3 className="mb-4 text-3xl font-bold text-wiria-blue-dark">
              WIRIA CBO Secretariat Team
            </h3>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-600">
              Organized to ensure maximum community impact and professional accountability.
            </p>
          </div>

          <div className="relative pt-12">
            {/* THE TREE ROOT: Executive Director */}
            {leadership && (
              <div className="relative mb-24 flex flex-col items-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group relative z-10 flex flex-col items-center"
                >
                  <div className="mb-6 h-32 w-32 overflow-hidden rounded-full border-4 border-wiria-yellow bg-white shadow-2xl transition-transform duration-500 group-hover:scale-110">
                    <img
                      src={leadership.image}
                      alt={leadership.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="text-center">
                    <h4 className="mb-1 text-2xl font-bold text-wiria-blue-dark">
                      {leadership.name}
                    </h4>
                    {leadership.roles.map((role) => (
                      <p
                        key={role}
                        className="mt-1 inline-block rounded-full bg-wiria-yellow/10 px-4 py-1 text-sm font-medium text-wiria-blue-dark/70"
                      >
                        {role}
                      </p>
                    ))}
                  </div>
                </motion.div>

                {/* Connecting Line: Root to Branch Point */}
                <div className="absolute left-1/2 top-full h-16 w-0.5 -translate-x-1/2 bg-gradient-to-b from-wiria-yellow to-gray-200" />
              </div>
            )}

            {/* THE BRANCHES: Units */}
            <div className="relative grid gap-12 md:grid-cols-3">
              {/* Connecting Line: Branch Point to Branches */}
              <div className="absolute -top-8 left-[16.6%] right-[16.6%] hidden h-0.5 bg-gray-200 md:block" />

              {departments.map((dept, deptIndex) => (
                <div key={dept.title} className="relative flex flex-col items-center">
                  {/* Vertical Connectors */}
                  <div className="hidden h-8 w-0.5 bg-gray-200 md:block" />

                  <div className="w-full">
                    <div className="mb-12 text-center">
                      <h5 className="mb-8 inline-block rounded-lg border border-gray-100 px-4 py-2 text-sm font-bold uppercase tracking-widest text-gray-400">
                        {dept.title}
                      </h5>

                      <div className="flex flex-col items-center gap-12">
                        {dept.members.map((member, mIndex) => (
                          <motion.div
                            key={member.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: deptIndex * 0.2 + mIndex * 0.1 }}
                            className="group flex flex-col items-center"
                          >
                            <div className="mb-4 h-24 w-24 overflow-hidden rounded-full border-2 border-gray-100 bg-white shadow-md transition-all duration-300 group-hover:scale-105 group-hover:border-wiria-blue-dark group-hover:shadow-xl">
                              <img
                                src={member.image}
                                alt={member.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="text-center">
                              <h6 className="mb-1 text-lg font-bold text-wiria-blue-dark">
                                {member.name}
                              </h6>
                              <div className="flex flex-col items-center gap-1">
                                {member.roles.map((role) => (
                                  <span
                                    key={role}
                                    className="max-w-[180px] text-xs font-medium leading-tight text-gray-500"
                                  >
                                    {role}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GovernanceSection;
