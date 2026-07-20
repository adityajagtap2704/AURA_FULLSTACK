'use client';
import { motion } from 'framer-motion';

const INTEGRATIONS = [
  {
    name: 'Gmail',
    description: 'Stay on top of your emails effortlessly.',
    color: '#EA4335',
    bg: '#FEF2F2',
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6z" fill="#EA4335"/>
        <path d="M22 6l-10 7L2 6" fill="none" stroke="white" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    name: 'Google Calendar',
    description: 'Never miss a meeting or deadline.',
    color: '#4285F4',
    bg: '#EFF6FF',
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <rect x="3" y="4" width="18" height="18" rx="2" fill="#4285F4"/>
        <rect x="3" y="4" width="18" height="5" fill="#3367D6"/>
        <text x="12" y="17" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">31</text>
      </svg>
    ),
  },
  {
    name: 'Notion',
    description: 'Organize your docs and ideas.',
    color: '#000000',
    bg: '#F9FAFB',
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <rect x="2" y="2" width="20" height="20" rx="4" fill="#1F1B16"/>
        <text x="12" y="16" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">N</text>
      </svg>
    ),
  },
  {
    name: 'Google Meet',
    description: 'Join or start meetings in one click.',
    color: '#34A853',
    bg: '#F0FDF4',
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <rect x="2" y="6" width="14" height="12" rx="2" fill="#34A853"/>
        <path d="M16 10l6-4v12l-6-4V10z" fill="#4285F4"/>
      </svg>
    ),
  },
  {
    name: 'Slack',
    description: 'Team communication, streamlined.',
    color: '#4A154B',
    bg: '#FDF4FF',
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <rect x="2" y="2" width="20" height="20" rx="4" fill="#4A154B"/>
        <text x="12" y="16" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">S</text>
      </svg>
    ),
  },
  {
    name: 'Google Drive',
    description: 'Access all your files anywhere.',
    color: '#FBBC04',
    bg: '#FFFBEB',
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <path d="M4 17l4-7 4 7H4z" fill="#34A853"/>
        <path d="M12 10l4 7H8l4-7z" fill="#4285F4"/>
        <path d="M16 10l4 7H12l4-7z" fill="#FBBC04"/>
      </svg>
    ),
  },
  {
    name: 'Linear',
    description: 'Track issues with speed.',
    color: '#5E6AD2',
    bg: '#EEF2FF',
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <rect x="2" y="2" width="20" height="20" rx="10" fill="#5E6AD2"/>
        <text x="12" y="16" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">L</text>
      </svg>
    ),
  },
  {
    name: 'GitHub',
    description: 'Code management unified.',
    color: '#24292F',
    bg: '#F6F8FA',
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <rect x="2" y="2" width="20" height="20" rx="4" fill="#24292F"/>
        <text x="12" y="16" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">GH</text>
      </svg>
    ),
  },
];

const basePathX = [0, 4.2, 6, 4.2, 0, -4.2, -6, -4.2];
const basePathY = [-6, -4.2, 0, 4.2, 6, 4.2, 0, -4.2];

const getOrbitPath = (offset: number) => {
  const x = [...basePathX.slice(offset), ...basePathX.slice(0, offset)];
  const y = [...basePathY.slice(offset), ...basePathY.slice(0, offset)];
  x.push(x[0]);
  y.push(y[0]);
  return { x, y };
};

export default function FeaturesSection() {
  return (
    <section id="integrations" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-bold text-[#C17817] uppercase tracking-widest mb-3">All Your Tools</p>
          <h2 className="text-4xl lg:text-5xl font-black text-[#1F1B16] mb-4 tracking-tight">
            All your tools. Connected seamlessly.
          </h2>
          <p className="text-lg text-[#6B6258] max-w-xl mx-auto leading-relaxed">
            AURA integrates with the tools you already love, bringing everything into one intelligent workspace.
          </p>
        </motion.div>

        {/* Integration cards grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {INTEGRATIONS.map((integration, i) => (
            <motion.div
              key={integration.name}
              initial="initial"
              whileInView="inView"
              viewport={{ once: true }}
              whileHover="hover"
              variants={{
                initial: { opacity: 0, y: 24 },
                inView: { opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.07 } },
                hover: { y: -6, scale: 1.02, transition: { duration: 0.3 } }
              }}
              className="group relative bg-white rounded-2xl p-6 border border-[#F0EBE3] hover:border-transparent hover:shadow-xl hover:shadow-[#1F1B16]/10 transition-all duration-300 cursor-pointer"
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: integration.bg }}
                >
                  <motion.div
                    custom={i}
                    variants={{
                      inView: (i: number) => ({
                        x: getOrbitPath(i % 8).x,
                        y: getOrbitPath(i % 8).y,
                        transition: {
                          duration: 8 + (i % 3) * 2,
                          repeat: Infinity,
                          ease: "linear"
                        }
                      }),
                      hover: {
                        x: 0,
                        y: 0,
                        transition: {
                          type: "spring",
                          stiffness: 400,
                          damping: 25
                        }
                      }
                    }}
                  >
                    {integration.icon}
                  </motion.div>
                </div>
                <div>
                  <h3 className="font-bold text-[#1F1B16] text-sm">{integration.name}</h3>
                  <p className="text-[#9B8F85] text-xs mt-1 leading-snug">{integration.description}</p>
                </div>
              </div>

              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
                style={{ background: `radial-gradient(circle at center, ${integration.color}, transparent)` }}
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-[#9B8F85] mt-10"
        >
          More integrations coming soon · <span className="text-[#C17817] font-semibold cursor-pointer hover:underline">Request one →</span>
        </motion.p>
      </div>
    </section>
  );
}
