'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, animate, useAnimation, useAnimationFrame } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/landing/Navbar';
import AIAssistantWidget from '@/components/landing/AIAssistantWidget';
import IntegrationFlowDiagram from '@/components/landing/IntegrationFlowDiagram';
import IntegrationsOrbitSection from '@/components/landing/IntegrationsOrbitSection';
import { AuraLogoIcon } from '@/components/icons/ServiceIcons';
import { Link2, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';

/* --------------------------------- HERO --------------------------------- */
function Hero() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#FDFAF6] via-[#FDF8F2] to-[#F8F3EC] flex items-center pt-16 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 w-full py-16 lg:py-24 grid lg:grid-cols-[0.9fr_1.2fr] gap-10 lg:gap-14 items-center">

        {/* Left */}
        <div className="flex flex-col gap-7">
          {/* Badge */}
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.5}}
            className="inline-flex items-center gap-2 w-fit bg-[#FDF4E7] border border-[#EDD9A3] rounded-full px-4 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C17817] animate-pulse"/>
            <span className="text-[11px] font-bold text-[#C17817] uppercase tracking-[0.12em]">AI-Powered Productivity</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6,delay:0.08}}
            className="text-[46px] lg:text-[58px] xl:text-[64px] font-black text-[#1F1B16] leading-[1.08] tracking-[-1.5px]">
            The all-in-one<br/>workspace that<br/>
            <em className="not-italic bg-gradient-to-r from-[#C17817] to-[#D4942A] bg-clip-text text-transparent" style={{fontFamily:'Georgia,"Times New Roman",serif',fontStyle:'italic'}}>works for you.</em>
          </motion.h1>

          {/* Subtext */}
          <motion.p initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:0.16}}
            className="text-[15px] text-[#6B6258] leading-[1.7] max-w-[400px]">
            Bring Gmail, Calendar, Notion and Meet together in one intelligent dashboard. Let AI handle the clutter so you can focus on what matters.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:0.22}}
            className="flex flex-wrap items-center gap-4">
            <Link href="/signup"
              className="flex items-center gap-2.5 px-7 py-3.5 bg-[#C17817] hover:bg-[#A86510] text-white font-bold text-[14px] rounded-xl shadow-lg shadow-[#C17817]/30 hover:-translate-y-0.5 hover:shadow-xl transition-all">
              Start for Free
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
            <button
              onClick={() => setIsDemoOpen(true)}
              className="flex items-center gap-3 px-5 py-3.5 bg-white border border-[#DDD5C8] hover:border-[#C17817]/50 text-[#1F1B16] font-bold text-[14px] rounded-xl hover:bg-[#FDF4E7] hover:-translate-y-0.5 transition-all shadow-sm"
            >
              <span className="w-8 h-8 rounded-full bg-[#C17817] flex items-center justify-center shrink-0">
                <svg className="w-3 h-3 text-white translate-x-0.5" viewBox="0 0 12 12" fill="currentColor"><path d="M2 1.5l9 4.5-9 4.5V1.5z"/></svg>
              </span>
              Watch Demo
            </button>
          </motion.div>

          {/* Trust */}
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.3}}
            className="flex flex-wrap gap-6 pt-1">
            {[
              {icon:'🔒',label:'Secure OAuth Login'},
              {icon:'✓',label:'Google Trusted'},
              {icon:'🛡',label:'Your data is always safe'},
            ].map(b=>(
              <div key={b.label} className="flex items-center gap-2">
                <span className="text-[#C17817] text-sm">{b.icon}</span>
                <span className="text-[12px] text-[#6B6258] font-medium">{b.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — Dashboard Mockup */}
        <motion.div initial={{opacity:0,x:40,rotate:2}} animate={{opacity:1,x:0,rotate:0}} transition={{duration:0.9,delay:0.15}}
          className="relative hidden lg:block" style={{perspective:'1200px'}}>
          <div className="absolute -inset-10 bg-gradient-to-br from-[#F0DFB8]/30 via-[#F5E9D0]/20 to-transparent rounded-3xl blur-3xl pointer-events-none"/>
          <motion.div animate={{y:[0,-6,0]}} transition={{duration:7,repeat:Infinity,ease:'easeInOut'}}
            className="relative bg-white rounded-[22px] overflow-hidden" style={{boxShadow:'0 25px 60px -15px rgba(31,27,22,0.18), 0 10px 20px -8px rgba(193,120,23,0.08)',border:'1px solid #E8E0D5',transform:'rotateY(-2deg) rotateX(1deg)'}}>

            {/* Topbar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#F0EBE3] bg-white">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 flex items-center justify-center">
                  <AuraLogoIcon className="w-full h-full text-[#C17817]" />
                </div>
                <span className="text-[13px] font-bold text-[#1F1B16]">AURA</span>
              </div>
              <div className="flex items-center gap-2 bg-[#F8F4EF] rounded-full px-3 py-1.5 flex-1 mx-4 max-w-[200px]">
                <svg className="w-3 h-3 text-[#9B8F85] shrink-0" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4"/><path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                <span className="text-[11px] text-[#9B8F85]">Search anything...</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#E8C98A] text-[9px] font-bold text-[#7A4A00] flex items-center justify-center">B</div>
              </div>
            </div>

            {/* Main content */}
            <div className="flex">
              {/* Sidebar */}
              <div className="w-[110px] shrink-0 border-r border-[#F0EBE3] bg-[#FDFBF8] py-3 px-2">
                {[
                  {icon:'⊞',label:'Home',active:true},
                  {icon:'✉',label:'Inbox'},
                  {icon:'📅',label:'Calendar'},
                  {icon:'✓',label:'Tasks'},
                  {icon:'📝',label:'Notes'},
                  {icon:'👥',label:'Meetings'},
                  {icon:'📄',label:'Documents'},
                  {icon:'📊',label:'Analytics'},
                  {icon:'⚙',label:'Settings'},
                ].map(item=>(
                  <div key={item.label} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg mb-0.5 ${item.active ? 'bg-[#C17817]/10 text-[#C17817]' : 'text-[#9B8F85] hover:bg-[#F0EBE3]'}`}>
                    <span className="text-[11px]">{item.icon}</span>
                    <span className="text-[10px] font-medium">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Dashboard panels */}
              <div className="flex-1 p-4 bg-white overflow-hidden">
                {/* Greeting */}
                <div className="mb-4">
                  <h3 className="text-[13px] font-bold text-[#1F1B16]">Good morning, User 🌟</h3>
                  <p className="text-[10px] text-[#9B8F85]">Here&apos;s what&apos;s happening today.</p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {/* AI Digest */}
                  <div className="bg-[#FDFBF8] rounded-xl p-3 border border-[#F0EBE3]">
                    <div className="text-[9px] font-bold text-[#4A3F35] mb-1.5">AI Daily Digest</div>
                    <div className="space-y-1 mb-2">
                      {['3 new emails','2 empty tasks','Project team meeting'].map(t=>(
                        <div key={t} className="flex items-center gap-1">
                          <div className="w-1 h-1 rounded-full bg-[#C17817] shrink-0"/>
                          <span className="text-[8.5px] text-[#6B6258] truncate">{t}</span>
                        </div>
                      ))}
                    </div>
                    <button className="w-full text-[8.5px] font-bold text-white bg-[#C17817] py-1 rounded-md">View Digest</button>
                  </div>

                  {/* Schedule */}
                  <div className="bg-[#FDFBF8] rounded-xl p-3 border border-[#F0EBE3]">
                    <div className="text-[9px] font-bold text-[#4A3F35] mb-1.5">Today&apos;s Schedule</div>
                    <div className="space-y-1.5">
                      {[{t:'10:00 AM',l:'Project Standup',c:'#C17817'},{t:'12:30 PM',l:'Lunch – Team Charlotte',c:'#22C55E'},{t:'3:00 PM',l:'Design Review + G-Meet',c:'#3B82F6'}].map(e=>(
                        <div key={e.l} className="flex gap-1.5 items-center">
                          <div className="w-0.5 h-6 rounded-full shrink-0" style={{background:e.c}}/>
                          <div>
                            <div className="text-[7.5px] text-[#9B8F85]">{e.t}</div>
                            <div className="text-[8px] font-semibold text-[#4A3F35] leading-tight">{e.l}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="mt-2 w-full text-[8px] text-[#C17817] font-semibold">View Calendar →</button>
                  </div>

                  {/* Upcoming Meeting */}
                  <div className="bg-[#1F1B16] rounded-xl p-3 text-white">
                    <div className="text-[9px] font-bold mb-0.5">Upcoming Meeting</div>
                    <div className="text-[7.5px] text-[#9B8F85] mb-2">Design Review<br/>4:00 PM – 5:00 PM</div>
                    <div className="flex -space-x-1 mb-2">
                      {['#C17817','#3B82F6','#22C55E','#E8A422'].map(c=>(
                        <div key={c} className="w-4 h-4 rounded-full border border-[#1F1B16]" style={{background:c}}/>
                      ))}
                    </div>
                    <button className="w-full text-[8.5px] font-bold text-[#1F1B16] bg-[#E8A422] py-1 rounded-md">Join Meeting</button>
                  </div>

                  {/* Recent Emails */}
                  <div className="bg-[#FDFBF8] rounded-xl p-3 border border-[#F0EBE3]">
                    <div className="text-[9px] font-bold text-[#4A3F35] mb-1.5">Recent Emails</div>
                    {[{from:'Priya Sharma',sub:'New design files…',time:'8:01 AM'},{from:'Rahul Updates',sub:'Design feedback…',time:'7:45 AM'},{from:'Nitro CSS',sub:'Respond now…',time:'6:30 AM'}].map(e=>(
                      <div key={e.from} className="flex items-start gap-1.5 mb-1.5">
                        <div className="w-4 h-4 rounded-full bg-[#E8C98A] text-[6px] font-bold text-[#7A4A00] flex items-center justify-center shrink-0">{e.from[0]}</div>
                        <div className="min-w-0">
                          <div className="text-[8px] font-semibold text-[#1F1B16] truncate">{e.from}</div>
                          <div className="text-[7.5px] text-[#9B8F85] truncate">{e.sub}</div>
                        </div>
                      </div>
                    ))}
                    <button className="text-[8px] text-[#C17817] font-semibold">View Inbox →</button>
                  </div>

                  {/* Tasks */}
                  <div className="bg-[#FDFBF8] rounded-xl p-3 border border-[#F0EBE3]">
                    <div className="text-[9px] font-bold text-[#4A3F35] mb-1.5">Tasks</div>
                    {[{l:'Complete landing page',p:'High',done:true},{l:'Review PR auth flow',p:'Medium',done:false},{l:'Prepare for startup',p:'Low',done:false}].map(t=>(
                      <div key={t.l} className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <div className={`w-3 h-3 rounded-full border flex items-center justify-center shrink-0 ${t.done ? 'bg-[#22C55E] border-[#22C55E]':'border-[#D5CCC3]'}`}>
                            {t.done && <div className="w-1.5 h-1.5 bg-white rounded-full"/>}
                          </div>
                          <span className={`text-[8px] truncate ${t.done ? 'line-through text-[#B5ABA3]':'text-[#4A3F35]'}`}>{t.l}</span>
                        </div>
                        <span className={`text-[7px] font-bold px-1 py-0.5 rounded-full shrink-0 ml-1 ${t.p==='High'?'bg-[#FEE2E2] text-[#EF4444]':t.p==='Medium'?'bg-[#FEF3C7] text-[#D97706]':'bg-[#DCFCE7] text-[#16A34A]'}`}>{t.p}</span>
                      </div>
                    ))}
                    <button className="text-[8px] text-[#C17817] font-semibold">View All Tasks →</button>
                  </div>

                  {/* Recent Docs */}
                  <div className="bg-[#FDFBF8] rounded-xl p-3 border border-[#F0EBE3]">
                    <div className="text-[9px] font-bold text-[#4A3F35] mb-1.5">Recent Documents</div>
                    {[{name:'Project Brief',date:'Jul 18'},{'name':'Meeting Notes','date':'Jul 17'},{'name':'Design Specs','date':'Jul 15'}].map(d=>(
                      <div key={d.name} className="flex items-center gap-1.5 mb-1.5">
                        <div className="w-4 h-5 bg-[#EDF4FF] rounded flex items-center justify-center shrink-0">
                          <svg className="w-2.5 h-2.5 text-[#3B82F6]" viewBox="0 0 12 14" fill="none"><rect x="1" y="1" width="10" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M3 4h6M3 7h6M3 10h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                        </div>
                        <div>
                          <div className="text-[8px] font-semibold text-[#4A3F35]">{d.name}</div>
                          <div className="text-[7.5px] text-[#9B8F85]">Updated {d.date}</div>
                        </div>
                      </div>
                    ))}
                    
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Decorative wheat/plant accents */}
          <div className="absolute -right-6 top-6 w-20 h-28 opacity-20 pointer-events-none">
            <svg viewBox="0 0 80 120" fill="none" className="w-full h-full">
              <path d="M40 120 Q40 60 40 20" stroke="#C17817" strokeWidth="2"/>
              <path d="M40 80 Q20 70 15 50" stroke="#C17817" strokeWidth="1.5" fill="none"/>
              <path d="M40 60 Q60 50 65 30" stroke="#C17817" strokeWidth="1.5" fill="none"/>
              <ellipse cx="12" cy="46" rx="10" ry="6" fill="#C17817" opacity="0.35" transform="rotate(-30 12 46)"/>
              <ellipse cx="67" cy="26" rx="10" ry="6" fill="#C17817" opacity="0.35" transform="rotate(30 67 26)"/>
            </svg>
          </div>
          <div className="absolute -left-4 bottom-12 w-16 h-24 opacity-15 pointer-events-none rotate-180">
            <svg viewBox="0 0 80 120" fill="none" className="w-full h-full">
              <path d="M40 120 Q40 60 40 20" stroke="#C17817" strokeWidth="2"/>
              <path d="M40 80 Q20 70 15 50" stroke="#C17817" strokeWidth="1.5" fill="none"/>
              <ellipse cx="12" cy="46" rx="10" ry="6" fill="#C17817" opacity="0.35" transform="rotate(-30 12 46)"/>
            </svg>
          </div>
        </motion.div>
      </div>

      {/* Demo Video Modal */}
      <AnimatePresence>
        {isDemoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDemoOpen(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 md:p-10"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl bg-white rounded-2xl overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FDF4E7] border border-[#EDD9A3] flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-[#C17817] translate-x-0.5" viewBox="0 0 12 12" fill="currentColor"><path d="M2 1.5l9 4.5-9 4.5V1.5z"/></svg>
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-[#1F1B16]">AURA – Product Demo</h3>
                    <p className="text-[12.5px] text-[#9B8F85]">See how AURA can simplify your workflow</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDemoOpen(false)}
                  aria-label="Close demo video"
                  className="flex items-center justify-center w-8 h-8 rounded-full text-[#9B8F85] hover:bg-[#F5F0E8] hover:text-[#1F1B16] transition-colors shrink-0"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M6 6l12 12M18 6L6 18"/>
                  </svg>
                </button>
              </div>

              {/* Video */}
              <div className="px-6">
                <video src="/videos/demo.mp4" controls autoPlay className="w-full aspect-video rounded-xl bg-black" />
              </div>

              {/* Footer */}
              <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 mt-5 border-t border-[#F0EBE3]">
                <div className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[#C17817]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                  <span className="text-[12.5px] font-medium text-[#6B6258]">Loved by teams around the world</span>
                  <div className="flex -space-x-2 ml-1">
                    {['#C17817', '#E8A422', '#A86510'].map((c) => (
                      <div key={c} className="w-6 h-6 rounded-full border-2 border-white" style={{ background: c }} />
                    ))}
                    <div className="w-6 h-6 rounded-full border-2 border-white bg-[#F5F0E8] flex items-center justify-center text-[8px] font-bold text-[#6B6258]">
                      +2K
                    </div>
                  </div>
                </div>
                <Link
                  href="/signup"
                  className="px-5 py-2.5 text-[13px] font-bold text-[#C17817] border border-[#C17817] rounded-xl hover:bg-[#FDF4E7] transition-all"
                >
                  Get Started Free
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ----------------------------- TRUSTED BY ----------------------------- */
function TrustedByLogo({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-gray-900 fill-current">
      {children}
    </span>
  );
}

const TRUSTED_BY_LOGOS = [
  // Group 1
  [
    <TrustedByLogo key="browserbase">
      <svg viewBox="0 0 28 28" className="h-7 w-7 shrink-0">
        <rect width="28" height="28" rx="6" className="fill-gray-900" />
        <text x="14" y="19" textAnchor="middle" fontSize="14" fontWeight="700" fill="#ffffff" fontFamily="sans-serif">B</text>
      </svg>
      <span className="text-[17px] font-bold tracking-tight">Browserbase</span>
    </TrustedByLogo>,
    <TrustedByLogo key="acme">
      <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l9 18H3z" />
      </svg>
      <span className="text-[17px] font-bold tracking-tight">Acme</span>
    </TrustedByLogo>,
    <TrustedByLogo key="stratus">
      <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="currentColor">
        <path d="M7 17a5 5 0 0 1 .5-9.98A6 6 0 0 1 19 9.5 4.5 4.5 0 0 1 18.5 17H7z" />
      </svg>
      <span className="text-[17px] font-bold tracking-tight">Stratus</span>
    </TrustedByLogo>,
  ],
  // Group 2
  [
    <TrustedByLogo key="braintrust">
      <span className="text-[20px] font-extrabold lowercase tracking-tight">braintrust</span>
    </TrustedByLogo>,
    <TrustedByLogo key="globex">
      <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.6 4 6 4 9s-1.5 6.4-4 9c-2.5-2.6-4-6-4-9s1.5-6.4 4-9z" />
      </svg>
      <span className="text-[17px] font-bold tracking-tight">Globex</span>
    </TrustedByLogo>,
    <TrustedByLogo key="initech">
      <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="currentColor">
        <rect x="3" y="3" width="8" height="8" rx="1.5" />
        <rect x="13" y="13" width="8" height="8" rx="1.5" />
        <rect x="13" y="3" width="8" height="8" rx="1.5" opacity="0.35" />
      </svg>
      <span className="text-[17px] font-bold tracking-tight">Initech</span>
    </TrustedByLogo>,
  ],
  // Group 3
  [
    <TrustedByLogo key="higgsfield">
      <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 15c2.5-5 4.5-5 6.5 0s4.5 5 6.5 0 4.5-5 6.5 0" />
      </svg>
      <span className="text-[17px] font-bold tracking-tight">Higgsfield</span>
    </TrustedByLogo>,
    <TrustedByLogo key="soylent">
      <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="currentColor">
        <path d="M12 2l4 6h-3v6h4l-5 8-5-8h4V8H8z" />
      </svg>
      <span className="text-[17px] font-bold tracking-tight">Soylent</span>
    </TrustedByLogo>,
    <TrustedByLogo key="umbrella">
      <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M3 12a9 9 0 0 1 18 0z" fill="currentColor" stroke="none" />
        <path d="M12 12v8a2 2 0 0 1-4 0" />
        <path d="M12 3v2" />
      </svg>
      <span className="text-[17px] font-bold tracking-tight">Umbrella</span>
    </TrustedByLogo>,
  ],
  // Group 4
  [
    <TrustedByLogo key="consensus">
      <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M20 12a8 8 0 1 1-2.93-6.16" strokeLinecap="round" />
        <path d="M20 4v5h-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="text-[17px] font-bold tracking-tight">Consensus</span>
    </TrustedByLogo>,
    <TrustedByLogo key="vandelay">
      <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="currentColor">
        <path d="M4 20V9l8-6 8 6v11h-6v-6H10v6z" />
      </svg>
      <span className="text-[17px] font-bold tracking-tight">Vandelay</span>
    </TrustedByLogo>,
    <TrustedByLogo key="hooli">
      <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M12 21c4.5-4 7-7.7 7-11a7 7 0 1 0-14 0c0 3.3 2.5 7 7 11z" />
        <circle cx="12" cy="10" r="2.5" fill="currentColor" stroke="none" />
      </svg>
      <span className="text-[17px] font-bold tracking-tight">Hooli</span>
    </TrustedByLogo>,
  ],
];

const TRUSTED_BY_DURATIONS = ['14s', '18s', '16s', '20s'];

function TrustedByColumn({ logos, duration }: { logos: React.ReactNode[]; duration: string }) {
  return (
    <div className="relative h-full overflow-hidden">
      <div
        className="animate-logo-slide-pause flex flex-col"
        style={{ animationDuration: duration }}
      >
        {[...logos, logos[0]].map((logo, i) => (
          <div key={i} className="flex items-center justify-center h-[104px] shrink-0">
            {logo}
          </div>
        ))}
      </div>
      {/* Fade masks so logos scroll in/out softly */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-white to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-white to-transparent" />
    </div>
  );
}

function TrustedBy() {
  return (
    <section className="w-full bg-white border-y border-gray-200">
      <div className="max-w-[1400px] w-full mx-auto grid grid-cols-2 md:grid-cols-[minmax(280px,1.5fr)_repeat(4,1fr)] h-auto md:h-[104px]">
        {/* Left — text column */}
        <div className="col-span-2 md:col-span-1 flex items-center justify-center px-6 md:px-8 py-8 md:py-0 border-b md:border-b-0 border-gray-200 md:border-r">
          <p className="text-sm font-normal text-gray-900 leading-relaxed text-center text-balance max-w-[240px]">
            Trusted by fast-growing companies around the world.
          </p>
        </div>

        {/* Logo columns */}
        {TRUSTED_BY_LOGOS.map((group, i) => (
          <div
            key={i}
            className={`hidden md:block h-[104px] ${
              i < TRUSTED_BY_LOGOS.length - 1 ? 'border-r border-gray-200' : ''
            }`}
          >
            <TrustedByColumn logos={group} duration={TRUSTED_BY_DURATIONS[i]} />
          </div>
        ))}

        {/* Mobile fallback — static grid of all logos */}
        <div className="col-span-2 grid grid-cols-2 gap-y-6 py-8 md:hidden">
          {TRUSTED_BY_LOGOS.flat().map((logo, i) => (
            <div key={i} className="flex items-center justify-center">
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ AI SECTION ------------------------------ */
function AISection() {
  return (
   <section id="features" className="py-6 bg-[#FAFAF8]"  data-navbar-theme="dark">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
          
          className="relative rounded-[28px] overflow-hidden bg-gradient-to-br from-[#1C1814] via-[#201C16] to-[#181410] min-h-[460px] flex items-center" style={{boxShadow:'0 30px 60px -20px rgba(28,24,20,0.35)'}}>

          {/* bg effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#C17817]/10 rounded-full blur-[80px]"/>
            <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage:'radial-gradient(#E8A422 1px, transparent 1px)',backgroundSize:'22px 22px'}}/>
          </div>

          <div className="relative z-10 w-full grid lg:grid-cols-[1.1fr_1fr] gap-0 items-center p-10 lg:p-16">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[#C17817]/15 border border-[#C17817]/25 rounded-full px-4 py-1.5 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8A422] animate-pulse"/>
                <span className="text-[11px] font-bold text-[#E8A422] uppercase tracking-[0.12em]">AI That Understands You</span>
              </div>
              <h2 className="text-[40px] lg:text-[50px] font-black text-white leading-[1.08] tracking-[-1.5px] mb-5">
                Clarity every morning.<br/>
                <span className="text-[#E8A422]">Focus all day.</span>
              </h2>
              <p className="text-[14px] text-[#9B8F85] leading-[1.7] mb-8 max-w-[380px]">
                AURA scans your data and delivers a personalized summary so you know exactly what matters.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {['Email summaries','Meeting reminders','Priority tasks','Smart suggestions','Calendar overview','Actionable insights'].map(f=>(
                  <div key={f} className="flex items-center gap-2.5">
                    <div className="w-4.5 h-4.5 rounded-full bg-[#C17817]/20 border border-[#C17817]/30 flex items-center justify-center shrink-0" style={{width:18,height:18}}>
                      <svg className="w-2.5 h-2.5 text-[#E8A422]" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <span className="text-[12.5px] text-[#C8BFB5]">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Orb + cards */}
            <div className="relative flex items-center justify-center h-[340px]">
              {/* Glow */}
              <motion.div animate={{scale:[1,1.12,1],opacity:[0.5,0.9,0.5]}} transition={{duration:4,repeat:Infinity,ease:'easeInOut'}}
                className="absolute w-52 h-52 rounded-full bg-gradient-radial from-[#E8A422]/25 to-transparent blur-3xl pointer-events-none"/>
              {/* Orbit rings */}
              <motion.div animate={{rotate:360}} transition={{duration:28,repeat:Infinity,ease:'linear'}}
                className="absolute w-52 h-52 rounded-full border border-[#C17817]/20 border-dashed"/>
              <motion.div animate={{rotate:-360}} transition={{duration:18,repeat:Infinity,ease:'linear'}}
                className="absolute w-36 h-36 rounded-full border border-[#E8A422]/15 border-dashed"/>
              {/* Center orb */}
              <div className="relative z-10 w-[120px] h-[120px] rounded-full bg-gradient-to-br from-[#C17817] via-[#E8A422] to-[#A86510] flex flex-col items-center justify-center" style={{boxShadow:'0 0 80px rgba(193,120,23,0.5), 0 0 160px rgba(232,164,34,0.2), inset 0 -4px 12px rgba(0,0,0,0.15)'}}>
                <svg className="w-9 h-9 text-white mb-1" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                <span className="text-[9px] font-bold text-white/80 tracking-widest">AURA AI</span>
              </div>

              {/* Floating card — Focus Time */}
              <motion.div animate={{y:[0,-12,0]}} transition={{duration:4,repeat:Infinity,ease:'easeInOut'}}
                className="absolute top-4 right-0 bg-[#242016] border border-[#333]/60 rounded-2xl p-4 w-44 shadow-xl">
                <div className="text-[9.5px] text-[#9B8F85] font-medium mb-1">Focus Time</div>
                <div className="text-[18px] font-black text-white">2h 30m</div>
                <div className="text-[9px] text-[#C17817] mb-2">Recommended deep work</div>
                <div className="flex gap-0.5 items-end h-7">
                  {[35,60,45,80,55,90,70].map((h,i)=>(
                    <div key={i} className="flex-1 rounded-sm" style={{height:`${h}%`,background:'linear-gradient(to top, #C17817, #E8A422)'}}/>
                  ))}
                </div>
              </motion.div>

              {/* Floating card — Priority */}
              <motion.div animate={{y:[0,12,0]}} transition={{duration:5,repeat:Infinity,ease:'easeInOut',delay:1.5}}
                className="absolute bottom-4 right-0 bg-[#242016] border border-[#333]/60 rounded-2xl p-4 w-52 shadow-xl">
                <div className="text-[9.5px] text-[#9B8F85] font-medium mb-2">Top Priority</div>
                {[{l:'Design system update',c:'#EF4444',p:'High'},{l:'Review project proposal',c:'#F59E0B',p:'Medium'},{l:'Prepare for design review',c:'#22C55E',p:'Low'}].map(t=>(
                  <div key={t.l} className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] text-[#C8BFB5] truncate mr-2">{t.l}</span>
                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full shrink-0" style={{background:t.c+'22',color:t.c}}>{t.p}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ----------------------------- HOW IT WORKS ----------------------------- */
const STEPS = [
  { label: 'Connect your tools', desc: 'One-click OAuth with all major apps and services.' },
  { label: 'We sync your data securely', desc: 'Real-time sync across all your connected tools.' },
  { label: 'AI organizes everything', desc: 'Smart summaries and priority queues daily.' },
  { label: 'You get clarity and get things done', desc: 'Start every day with a clear action plan.' },
];
const STEP_ICONS = [
  // Link
  <Link2 key="link" className="w-6 h-6 text-[#C99A3D]" strokeWidth={1.8} />,
  // Sync
  <RefreshCw key="sync" className="w-6 h-6 text-[#C99A3D]" strokeWidth={1.8} />,
  // Sparkles
  <Sparkles key="ai" className="w-6 h-6 text-[#C99A3D]" strokeWidth={1.8} />,
  // CheckCircle2
  <CheckCircle2 key="done" className="w-6 h-6 text-[#C99A3D]" strokeWidth={1.8} />,
];

const STATS = [
  {icon:'⊞',num:4,suffix:'+',label:'Connected Apps',desc:'All your favorite tools in one place.'},
  {icon:'🔒',num:100,suffix:'%',label:'Secure & Private',desc:'Enterprise-grade security and encryption.'},
  {icon:'☰',num:1,suffix:'',label:'Unified Dashboard',desc:'Everything you need, organized for you.'},
  {icon:'⟳',num:24,suffix:'/7',label:'Smart Sync',desc:"Real-time updates so you're always ready."},
];

function AnimatedCounter({ target, suffix = '', start }: { target: number; suffix?: string; start: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    const controls = animate(0, target, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(v) { setCount(Math.round(v)); },
    });
    return () => controls.stop();
  }, [start, target]);

  return <div className="text-[24px] font-black text-[#1F1B16] leading-none">{count}{suffix}</div>;
}

function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const sectionInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [statsActive, setStatsActive] = useState(false);

  // sectionInView only ever flips false → true (viewport `once: true`), so
  // this is safe to derive during render instead of an effect that calls
  // setState synchronously.
  if (sectionInView && !statsActive) {
    setStatsActive(true);
  }


  return (
    <section id="how-it-works" ref={sectionRef} className="py-28 bg-gradient-to-b from-[#FDFAF6] via-white to-[#FDFAF6] relative overflow-hidden">
      {/* Inject custom style tag for card shine sweep animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes cardShine {
          0% { left: -100%; }
          100% { left: 150%; }
        }
        .card-shine-effect::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: skewX(-25deg);
          transition: none;
        }
        .card-shine-effect:hover::after {
          animation: cardShine 0.85s ease-in-out;
        }
      `}} />

      {/* Floating Background Particles */}
      {[...Array(4)].map((_, idx) => (
        <motion.div
          key={idx}
          className="absolute w-2 h-2 rounded-full bg-[#D4A017]/25 blur-[1px] pointer-events-none hidden md:block"
          style={{
            top: `${20 + idx * 22}%`,
            left: `${15 + idx * 23}%`,
          }}
          animate={{
            y: [0, -15, 0],
            x: [0, idx % 2 === 0 ? 10 : -10, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 6 + idx * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: idx * 0.5,
          }}
        />
      ))}

      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-radial from-[#D4A017]/8 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{backgroundImage:'radial-gradient(#D4A017 1px, transparent 1px)',backgroundSize:'28px 28px'}} />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4.5 py-1.5 rounded-full bg-[#FDF6EC] border border-[#E8C98A]/40 text-[#D4A017] text-[11px] font-bold uppercase tracking-widest mb-5">
            How AURA works
          </span>
          <h2 className="text-[28px] md:text-[36px] font-black text-[#1F1B16] tracking-tight mb-4">
            Your productivity, powered by AI in <span className="bg-gradient-to-r from-[#D4A017] to-[#E8A422] bg-clip-text text-transparent">4 simple steps</span>
          </h2>
          <p className="text-[#6B6258] text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Connect your apps, organize your work, and let AURA handle the busy work.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="relative">
          
          {/* Desktop Straight Horizontal Timeline */}
          <motion.svg 
            className="hidden md:block absolute top-[44px] left-0 w-full h-[80px] pointer-events-none overflow-visible z-20" 
            viewBox="0 0 1000 80" 
            fill="none"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <defs>
              {/* Linear gradient that fades out at both ends */}
              <linearGradient id="single-wave-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#C99A3D" stopOpacity="0" />
                <stop offset="10%" stopColor="#C99A3D" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#F3C96B" stopOpacity="0.8" />
                <stop offset="90%" stopColor="#C99A3D" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#C99A3D" stopOpacity="0" />
              </linearGradient>

              {/* Linear gradient for the flowing/traveling light pulse */}
              <linearGradient id="pulse-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#C99A3D" stopOpacity="0" />
                <stop offset="50%" stopColor="#FFF" stopOpacity="1" />
                <stop offset="100%" stopColor="#C99A3D" stopOpacity="0" />
              </linearGradient>
              
              {/* Stacking context mask to hide lines/dots inside the icon circles */}
              <mask id="timeline-mask" maskUnits="userSpaceOnUse">
                <rect x="-100" y="-100" width="1200" height="280" fill="white" />
                <circle cx="125" cy="40" r="30" fill="black" />
                <circle cx="375" cy="40" r="30" fill="black" />
                <circle cx="625" cy="40" r="30" fill="black" />
                <circle cx="875" cy="40" r="30" fill="black" />
              </mask>
            </defs>

            {/* Clean, thin horizontal straight line (masked to skip icon wrapper interiors) */}
            <line 
              x1="65" 
              y1="40" 
              x2="935" 
              y2="40" 
              stroke="url(#single-wave-grad)" 
              strokeWidth="1.2" 
              mask="url(#timeline-mask)"
            />

            {/* Traveling Light Pulse Line (masked to skip icon wrapper interiors) */}
            <motion.line 
              x1="65" 
              y1="40" 
              x2="935" 
              y2="40" 
              stroke="url(#pulse-grad)" 
              strokeWidth="1.8" 
              strokeLinecap="round"
              strokeDasharray="80 300"
              mask="url(#timeline-mask)"
              animate={{ strokeDashoffset: [380, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
          </motion.svg>


          {/* Mobile Vertical Timeline Line */}
          <div className="block md:hidden absolute left-[34px] top-12 bottom-12 w-0.5 border-l border-dashed border-[#EDD9A3] z-0" />

          {/* Grid Container */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {STEPS.map((s, i) => {
              return (
                <motion.div 
                  key={s.label}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative bg-white border border-[#F1F1F1] rounded-[20px] p-6 flex flex-col items-center text-center shadow-[0_10px_30px_rgba(0,0,0,0.02)] transition-all duration-500 ease-out hover:-translate-y-2.5 hover:border-[#C99A3D]/30 hover:shadow-[0_20px_45px_rgba(201,154,61,0.12),0_0_20px_rgba(201,154,61,0.02)] card-shine-effect select-none overflow-hidden h-full flex-1"
                >
                  {/* Subtle inner radial gold glow that fades in on hover */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,154,61,0.05),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />

                  {/* Top Accent Line on Hover */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4A017] to-[#C17817] scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100 z-20" />

                  {/* Step Number Badge with breathing scale animation */}
                  <motion.div 
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                    className="absolute top-6 left-6 w-8 h-8 rounded-full border border-[#C99A3D]/40 bg-white flex items-center justify-center text-[12px] font-bold text-[#C99A3D] shadow-sm select-none transition-all duration-500 ease-out group-hover:border-[#C99A3D] group-hover:bg-[#FFFDF9] group-hover:scale-105 z-10"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </motion.div>

                  {/* Icon Wrapper with floating bobbing animation & rotate on hover */}
                  <motion.div 
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                    className="w-[58px] h-[58px] rounded-full bg-gradient-to-br from-[#FFF9F0] to-[#FDF0D5] border border-[#EDD9A3]/85 flex items-center justify-center mt-4 mb-5 relative z-10 transition-all duration-500 ease-out group-hover:scale-110 group-hover:shadow-[0_8px_25px_rgba(201,154,61,0.25)] group-hover:border-[#C99A3D]"
                  >
                    <div className="transform transition-transform duration-500 group-hover:rotate-6">
                      {STEP_ICONS[i]}
                    </div>
                  </motion.div>

                  {/* Text Details */}
                  <h3 className="text-[17px] font-bold text-[#111] mb-2.5 leading-snug tracking-tight relative z-10 group-hover:text-[#C17817] transition-all duration-500 ease-out group-hover:-translate-y-1">
                    {s.label}
                  </h3>
                  <p className="text-[13.5px] text-[#777] leading-[1.6] font-normal relative z-10 transition-all duration-500 ease-out group-hover:-translate-y-0.5 group-hover:text-[#5B5248]">
                    {s.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Integrations Flow Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mt-20"
        >
          <IntegrationFlowDiagram />
        </motion.div>

        {/* Stats Column Section (Glassmorphic Redesign) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 relative z-10">
          {STATS.map((s, i) => (
            <motion.div 
              key={s.label}
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white/70 backdrop-blur-md rounded-[24px] p-6 border border-[#EDE8E0] shadow-sm transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_15px_35px_rgba(201,154,61,0.1),0_0_15px_rgba(201,154,61,0.03)] hover:border-[#C99A3D]/30 group relative overflow-hidden"
            >
              {/* Subtle inner radial gold glow that fades in on hover */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,154,61,0.08),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />
              
              {/* Top Accent Line on Hover */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4A017] to-[#C17817] scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100 z-20" />

              <div className="flex items-center gap-4 relative z-10">
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                  className="w-12 h-12 rounded-xl bg-[#FDF4E7] border border-[#EDD9A3]/50 flex items-center justify-center text-2xl shrink-0 transition-all duration-500 ease-out group-hover:scale-110 group-hover:-rotate-3 group-hover:shadow-[0_8px_20px_rgba(201,154,61,0.22)] group-hover:border-[#C99A3D]/70 group-hover:bg-[#FFFDF9]"
                >
                  <span className="text-xl text-[#D4A017] leading-none select-none">{s.icon}</span>
                </motion.div>
                <div className="transition-all duration-500 ease-out group-hover:translate-x-1">
                  <AnimatedCounter target={s.num} suffix={s.suffix} start={statsActive} />
                  <div className="text-[13px] font-extrabold text-[#1F1B16] mt-0.5 tracking-tight group-hover:text-[#C17817] transition-colors duration-300">{s.label}</div>
                </div>
              </div>
              <p className="text-[12.5px] text-[#6B6258] mt-3 leading-relaxed font-medium relative z-10 transition-all duration-500 ease-out group-hover:translate-x-0.5">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- TESTIMONIALS ----------------------------- */
const TESTIMONIALS = [
  {name:'Priya Sharma',role:'Product Designer',avatarColor:'#C97A0A',initials:'PS',quote:'"AURA completely changed how I manage my work. I love the clean interface — everything is exactly where I expect it to be."'},
  {name:'Rajesh Kumar',role:'Software Engineer',avatarColor:'#D89B1D',initials:'RK',quote:'"The AI summary every morning saves me so much time. Very professional and well-designed portal. Highly recommended!"'},
  {name:'Ms. Anita Desai',role:'Project Manager',avatarColor:'#A86510',initials:'AD',quote:'"Managing my team and schedule used to take hours. Now the approval chain runs automatically and I get notified in real time."'},
  {name:'David L.',role:'Startup Founder',avatarColor:'#D4942A',initials:'DL',quote:'"Finally, a tool that brings everything together in one clean dashboard. The enquiry process was smooth and I got a reference number instantly."'},
  {name:'Sarah K.',role:'Freelancer',avatarColor:'#1F1B16',initials:'SK',quote:'"I love the seamless integration. Paying fees and checking announcements is so easy now. It just works flawlessly."'},
  {name:'Vikram M.',role:'Marketing Lead',avatarColor:'#6B6258',initials:'VM',quote:'"The best productivity tool I have used in years. It keeps my entire workflow organized without any unnecessary clutter."'},
];

// Sample points along the background arc's quadratic bezier so the glowing
// dots can be animated across it via keyframes, sidestepping CSS
// offset-path (still spotty in Safari).
function sampleQuadraticCurve(p0: [number, number], p1: [number, number], p2: [number, number], steps: number) {
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    pts.push({
      x: (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t ** 2 * p2[0],
      y: (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t ** 2 * p2[1],
    });
  }
  return pts;
}
const CURVE_POINTS = sampleQuadraticCurve([40, 78], [600, -8], [1160, 78], 40);
const CURVE_XS = CURVE_POINTS.map(p => p.x);
const CURVE_YS = CURVE_POINTS.map(p => p.y);

function FloatingCurveDot({ delay, radius, color }: { delay: number; radius: number; color: string }) {
  return (
    <motion.circle
      r={radius}
      fill={color}
      style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      initial={{ cx: CURVE_XS[0], cy: CURVE_YS[0], opacity: 0 }}
      animate={{ cx: CURVE_XS, cy: CURVE_YS, opacity: [0, 1, 1, 1, 0] }}
      transition={{ duration: 10, repeat: Infinity, ease: 'linear', delay }}
    />
  );
}

// Exactly 3 complete cards on screen at once: the center card pops up in
// scale, the two neighbors stay at their natural (unshrunk) size but sit
// lower in the stack and dimmed, and anything beyond that is invisible —
// no partial/clipped edge cards.
function cardTier(distance: number) {
  if (distance === 0) return { scale: 1.06, opacity: 1, y: -16, zIndex: 30, shadow: '0 30px 60px rgba(230,170,40,0.25), 0 18px 30px rgba(17,17,17,0.12)' };
  if (distance === 1) return { scale: 1, opacity: 0.6, y: 0, zIndex: 10, shadow: '0 20px 25px -5px rgba(17,17,17,0.1), 0 8px 10px -6px rgba(17,17,17,0.1)' };
  return { scale: 1, opacity: 0, y: 0, zIndex: 0, shadow: 'none' };
}

function TestimonialCard({ t, distance }: { t: typeof TESTIMONIALS[0]; distance: number }) {
  const isActive = distance === 0;
  const tier = cardTier(distance);

  return (
    <motion.div
      initial={false}
      animate={{ scale: tier.scale, opacity: tier.opacity, y: tier.y, boxShadow: tier.shadow }}
      whileHover={isActive ? { y: tier.y - 6 } : undefined}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      style={{ zIndex: tier.zIndex, willChange: 'transform, opacity, box-shadow' }}
      className={`w-[85vw] sm:w-[380px] md:w-[260px] lg:w-[320px] xl:w-[340px] shrink-0 transform-gpu rounded-3xl ${isActive ? '' : 'pointer-events-none'}`}
    >
      <div className={`relative h-full bg-white rounded-3xl border p-8 flex flex-col overflow-hidden ${isActive ? 'border-[#D89B1D]/35' : 'border-neutral-200'}`}>
        {/* Soft gold glow, active card only */}
        {isActive && (
          <div
            className="absolute -inset-6 -z-10 rounded-[40px] blur-2xl pointer-events-none"
            style={{ background: 'radial-gradient(circle at 50% 30%, rgba(216,155,29,0.28), rgba(243,201,107,0.12), transparent 70%)' }}
          />
        )}

        <div className="flex items-start justify-between mb-6">
          <div className="flex gap-1">
            {[...Array(5)].map((_, j) => (
              <svg key={j} className="w-[18px] h-[18px] text-[#D89B1D]" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <svg className="w-9 h-9 text-neutral-100" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>

        <p className="text-[15px] text-neutral-700 leading-relaxed font-medium flex-1">
          {t.quote}
        </p>

        <div className="border-t border-neutral-100 pt-5 mt-6 flex items-center gap-3.5">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-white text-[13px] font-bold shadow-sm shrink-0"
            style={{ backgroundColor: t.avatarColor }}
          >
            {t.initials}
          </div>
          <div>
            <div className="text-[14px] font-bold text-[#111111]">{t.name}</div>
            <div className="text-[12px] text-[#6B7280] font-medium mt-0.5">{t.role}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Testimonials() {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeDot, setActiveDot] = useState(0);
  const [activeIndex, setActiveIndex] = useState(TESTIMONIALS.length);

  const controls = useAnimation();
  const trackRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(TESTIMONIALS.length);
  const isAnimating = useRef(false);

  // We need 3 sets to allow looping backward and forward seamlessly.
  const extendedItems = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];

  const slideTo = useCallback(async (newIndex: number, immediate = false) => {
    if (!trackRef.current) return;

    isAnimating.current = true;
    indexRef.current = newIndex;
    setActiveIndex(newIndex);

    // Update dot safely using modulo
    const dotIndex = newIndex % TESTIMONIALS.length;
    setActiveDot(dotIndex < 0 ? TESTIMONIALS.length + dotIndex : dotIndex);

    const card = trackRef.current.children[0] as HTMLElement;
    const cardWidth = card.getBoundingClientRect().width;
    const gap = 32; // Assuming gap-8
    const stepWidth = cardWidth + gap;

    // Center the active card in the viewport instead of flush-left, so its
    // neighbors peek in symmetrically on both sides.
    const viewportWidth = trackRef.current.parentElement?.getBoundingClientRect().width ?? cardWidth;
    const centerOffset = (viewportWidth - cardWidth) / 2;

    if (immediate) {
      controls.set({ x: centerOffset - stepWidth * newIndex });
      isAnimating.current = false;
    } else {
      await controls.start({
        x: centerOffset - stepWidth * newIndex,
        transition: { duration: 0.8, ease: 'easeInOut' }
      });

      // Seamless snap if we exceed bounds
      if (indexRef.current >= TESTIMONIALS.length * 2) {
        indexRef.current -= TESTIMONIALS.length;
        setActiveIndex(indexRef.current);
        controls.set({ x: centerOffset - stepWidth * indexRef.current });
      } else if (indexRef.current <= 0) {
        indexRef.current += TESTIMONIALS.length;
        setActiveIndex(indexRef.current);
        controls.set({ x: centerOffset - stepWidth * indexRef.current });
      }
      isAnimating.current = false;
    }
  }, [controls]);

  // Keep the active card centered whenever the viewport's actual rendered size
  // changes for any reason (window resize, font load, hot-reload layout settle, etc.)
  // — a plain `resize` listener only fires on window dimension changes, which misses
  // internal layout shifts, so we watch the container element itself instead.
  useEffect(() => {
    const viewportEl = trackRef.current?.parentElement;
    if (!viewportEl) return;

    let timeout: NodeJS.Timeout;
    const recenter = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => slideTo(indexRef.current, true), 100);
    };

    slideTo(indexRef.current, true);

    const observer = new ResizeObserver(recenter);
    observer.observe(viewportEl);
    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [slideTo]);

  // Autoplay interval
  useEffect(() => {
    if (!isPlaying || isHovered) return;

    const timer = setInterval(() => {
      if (!isAnimating.current) {
        slideTo(indexRef.current + 1);
      }
    }, 4000); // 4 seconds pause

    return () => clearInterval(timer);
  }, [isPlaying, isHovered, slideTo]);

  const handleNext = () => {
    if (!isAnimating.current) slideTo(indexRef.current + 1);
  };
  const handlePrev = () => {
    if (!isAnimating.current) slideTo(indexRef.current - 1);
  };

  return (
    <section className="py-16 md:py-20 bg-[#FFFDF9] relative overflow-hidden">
      {/* Shared with the Integrations section's cards above — keeping these two
          keyframe sets defined here since Testimonials always renders on the page. */}
      <style dangerouslySetInnerHTML={{__html:`
        @keyframes float-card {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-float-card {
          animation: float-card 9s ease-in-out infinite;
        }
        @keyframes sweep-reflection {
          0% { transform: translateX(-300px) skewX(-20deg); }
          15%, 100% { transform: translateX(800px) skewX(-20deg); }
        }
        .animate-sweep {
          animation: sweep-reflection 11s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}} />
      <div className="absolute inset-0 pointer-events-none" style={{backgroundImage:'radial-gradient(#D89B1D 1px, transparent 1px)',backgroundSize:'32px 32px', opacity: 0.03}} />

      <div className="max-w-[1200px] mx-auto text-center mb-16 relative z-10 px-6">
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
          <h3 className="text-[12px] font-bold tracking-[0.2em] text-[#D89B1D] uppercase mb-4">
            Testimonials
          </h3>
          <h2 className="text-[36px] md:text-[48px] font-black text-[#111111] tracking-tight mb-5">
            Loved by the <span className="bg-gradient-to-r from-[#F3C96B] to-[#C97A0A] bg-clip-text text-transparent">AURA community</span>
          </h2>
          <p className="text-[16px] md:text-[18px] text-[#6B7280] font-medium max-w-full md:whitespace-nowrap mx-auto">
            Hear from professionals, teams, and individuals who use AURA every day.
          </p>
        </motion.div>
      </div>

      <div
        className="w-full relative z-10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="w-[94vw] max-w-[1200px] mx-auto relative">
          {/* Very soft radial gradient glow seated behind the center card */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[420px] pointer-events-none -z-10"
            style={{ background: 'radial-gradient(circle, rgba(243,201,107,0.18), rgba(201,122,10,0.07) 45%, transparent 75%)', filter: 'blur(50px)' }}
          />

          {/* Decorative arc connecting the side dot markers, arching behind the cards,
              with three glowing dots drifting endlessly along the curve. */}
          <svg
            className="absolute inset-x-0 -top-10 w-full h-28 pointer-events-none hidden md:block overflow-visible"
            viewBox="0 0 1200 90"
            fill="none"
            aria-hidden="true"
          >
            <path d="M 40 78 Q 600 -8 1160 78" stroke="#D89B1D" strokeWidth="1.5" opacity="0.25" />
            <circle cx="40" cy="78" r="4" fill="#C97A0A" className="animate-pulse" />
            <circle cx="600" cy="2" r="3" fill="#D89B1D" opacity="0.7" className="animate-pulse" style={{ animationDelay: '0.6s' }} />
            <circle cx="1160" cy="78" r="4" fill="#C97A0A" className="animate-pulse" style={{ animationDelay: '1.2s' }} />
            <FloatingCurveDot delay={0} radius={3.5} color="#F3C96B" />
            <FloatingCurveDot delay={3.3} radius={3} color="#D89B1D" />
            <FloatingCurveDot delay={6.6} radius={3.5} color="#C97A0A" />
          </svg>

          {/* Peek Carousel Viewport - exactly 3 complete cards: popped-up center, two same-size dimmed neighbors.
              Extra vertical padding gives the scaled-up, lifted center card room to breathe so it never
              clips against this wrapper's overflow-hidden edge. */}
          <div className="overflow-hidden relative z-10 pt-12 pb-6 -mt-12">
            <motion.div
              ref={trackRef}
              animate={controls}
              className="flex gap-8 w-max transform-gpu"
              style={{ willChange: 'transform' }}
            >
              {extendedItems.map((t, i) => (
                <TestimonialCard key={i} t={t} distance={Math.abs(i - activeIndex)} />
              ))}
            </motion.div>
          </div>

          {/* Prev/Next - floating glass circles that breathe gently at rest */}
          <motion.button
            onClick={handlePrev}
            aria-label="Previous testimonial"
            animate={{ scale: [1, 1.035, 1] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
            className="hidden md:flex absolute -left-2 lg:-left-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full items-center justify-center bg-white/80 backdrop-blur-md border border-white/60 text-neutral-500 hover:text-[#C97A0A] hover:bg-white shadow-[0_10px_30px_rgba(17,17,17,0.12)] transition-colors z-30 transform-gpu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          </motion.button>
          <motion.button
            onClick={handleNext}
            aria-label="Next testimonial"
            animate={{ scale: [1, 1.035, 1] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: 1.7 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
            className="hidden md:flex absolute -right-2 lg:-right-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full items-center justify-center bg-white/80 backdrop-blur-md border border-white/60 text-neutral-500 hover:text-[#C97A0A] hover:bg-white shadow-[0_10px_30px_rgba(17,17,17,0.12)] transition-colors z-30 transform-gpu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
          </motion.button>
        </div>

        {/* Dots, then a standalone Play/Pause pill beneath */}
        <div className="flex flex-col items-center gap-5 mt-6 relative z-20">
          <div className="flex items-center gap-2">
            {TESTIMONIALS.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => slideTo(i + TESTIMONIALS.length)}
                animate={{ width: activeDot === i ? 32 : 8 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className={`h-2 rounded-full transform-gpu ${
                  activeDot === i ? 'bg-gradient-to-r from-[#F3C96B] to-[#C97A0A]' : 'bg-neutral-300 hover:bg-[#D89B1D]/50'
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#6B7280] hover:text-[#C97A0A] transition-colors shadow-[0_10px_24px_rgba(17,17,17,0.08)] text-[13px] font-semibold"
          >
            {isPlaying ? (
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
            ) : (
              <svg className="w-3.5 h-3.5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            )}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ CTA BANNER ------------------------------ */
function CTABanner() {
  return (
    <section id="final-cta" className="py-16 bg-[#FDFAF6] relative overflow-hidden" data-navbar-theme="dark">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          whileHover={{ y: -4 }}
          className="relative rounded-[36px] overflow-hidden bg-gradient-to-br from-[#1C1814] via-[#2D231A] to-[#14110E] py-20 px-10 text-center border border-[#C17817]/20 shadow-[0_30px_60px_rgba(20,17,14,0.35)]"
        >
          {/* Inject style tag for shine and floating animations */}
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes shine {
              0% { left: -100%; }
              100% { left: 150%; }
            }
            .shine-effect::after {
              content: '';
              position: absolute;
              top: 0;
              left: -100%;
              width: 50%;
              height: 100%;
              background: linear-gradient(
                to right,
                rgba(255, 255, 255, 0) 0%,
                rgba(255, 255, 255, 0.4) 50%,
                rgba(255, 255, 255, 0) 100%
              );
              transform: skewX(-25deg);
              transition: none;
            }
            .shine-effect:hover::after {
              animation: shine 0.85s ease-in-out;
            }
            
            @keyframes glowPulse {
              0%, 100% { opacity: 0.15; transform: translate(-50%, -50%) scale(1); }
              50% { opacity: 0.25; transform: translate(-50%, -50%) scale(1.1); }
            }
            .glow-backdrop {
              animation: glowPulse 8s ease-in-out infinite;
            }
          `}} />

          {/* Background glowing effects */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Pulsing center glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[550px] h-[300px] bg-[#C17817]/20 rounded-full blur-3xl glow-backdrop" />
            
            {/* Left and Right side glows */}
            <motion.div 
              animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-10 left-10 w-60 h-60 bg-[#E8A422]/10 rounded-full blur-3xl" 
            />
            <motion.div 
              animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 right-10 w-72 h-72 bg-[#C17817]/10 rounded-full blur-3xl" 
            />
            
            {/* Luxurious dot grid */}
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#E8A422 1.2px, transparent 1.2px)', backgroundSize: '28px 28px' }} />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-[36px] md:text-[46px] font-black text-white mb-4 tracking-tight leading-tight"
            >
              Ready to simplify your workday?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-[#B5A89C] text-[15px] md:text-[16px] mb-10 max-w-lg mx-auto leading-relaxed"
            >
              Bring Gmail, Calendar, Notion and Meet together in one intelligent workspace.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col items-center gap-3.5"
            >
              <Link href="/signup"
                className="shine-effect relative overflow-hidden inline-flex items-center gap-2.5 px-10 py-4.5 bg-gradient-to-r from-[#C17817] via-[#D4942A] to-[#E8A422] hover:from-[#A86510] hover:to-[#C17817] text-white font-bold text-[15px] rounded-2xl shadow-xl shadow-[#C17817]/35 hover:shadow-[0_20px_35px_rgba(193,120,23,0.5)] hover:-translate-y-1 transition-all duration-300 active:translate-y-0"
              >
                <span>Start for Free</span>
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8H13M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <p className="text-[12px] font-medium text-[#8F8173] tracking-wide">No credit card required</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------- FOOTER -------------------------------- */
function Footer() {
  const col = (title: string, links: { name: string; href: string }[]) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="flex flex-col gap-5"
    >
      <div className="flex flex-col gap-2">
        <h4 className="text-[11px] font-bold text-[#1F1B16] uppercase tracking-[0.15em]">{title}</h4>
        <div className="w-6 h-0.5 bg-[#C17817]/40" />
      </div>
      <ul className="space-y-3.5">
        {links.map(l => (
          <li key={l.name}>
            <a href={l.href} className="text-[13.5px] text-[#6B6258] hover:text-[#C17817] transition-all duration-200 hover:pl-1 flex items-center">
              <span className="w-1 h-1 bg-[#C17817] rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity" />
              {l.name}
            </a>
          </li>
        ))}
      </ul>
    </motion.div>
  );

  return (
    <footer id="resources" className="bg-[#FDFBF7] border-t border-[#F0EBE0] relative overflow-hidden">
      {/* Absolute Glow Background Decoration */}
      <div className="absolute top-0 right-1/4 w-[350px] h-[350px] bg-[#C17817]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[250px] h-[250px] bg-[#E8A422]/3 rounded-full blur-3xl pointer-events-none" />

      {/* Large low-opacity AURA watermark in the bottom-right */}
      <div className="absolute -bottom-[110px] -right-[85px] md:-bottom-[150px] md:-right-[120px] w-[400px] h-[400px] md:w-[500px] md:h-[500px] text-[#C17817] opacity-[0.05] lg:opacity-[0.06] pointer-events-none select-none">
        <AuraLogoIcon className="w-full h-full stroke-[1.5px]" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 pt-20 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1fr_1.2fr] gap-12 md:gap-8 pb-16 border-b border-[#F0EBE0]">
          
          {/* Brand & Socials on the left */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-3">
              <AuraLogoIcon className="w-11 h-11 text-[#C17817]" />
              <span className="text-[20px] font-black tracking-tight text-[#1F1B16]">AURA</span>
            </div>
            
            <p className="text-[13.5px] text-[#6B6258] leading-relaxed max-w-[260px]">
              Your all-in-one productivity hub,<br />
              powered by <span className="text-[#C17817] font-bold">AI.</span>
            </p>
            
            {/* Social Icons row */}
            <div className="flex gap-2.5">
              {[
                { name: 'X', icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>, href: '#' },
                { name: 'LinkedIn', icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2" fill="currentColor"/></svg>, href: 'https://www.linkedin.com/company/kalnet-technology/posts/?feedView=all' },
                { name: 'GitHub', icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>, href: 'https://github.com/adityajagtap2704/AURA_FULLSTACK' },
                { name: 'Instagram', icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8}><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>, href: 'https://www.instagram.com/kalnet_global/' },
              ].map((s, idx) => (
                <motion.a
                  key={s.name}
                  href={s.href}
                  target={s.href === '#' ? undefined : '_blank'}
                  rel={s.href === '#' ? undefined : 'noopener noreferrer'}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 rounded-[12px] bg-white border border-[#F0EBE0] flex items-center justify-center text-[#1F1B16] hover:text-[#C17817] hover:border-[#C17817]/30 transition-all shadow-sm hover:shadow-md"
                  aria-label={s.name}
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Product Column */}
          {col('Product', [
            { name: 'Features', href: '#features' },
            { name: 'Integrations', href: '#integrations' },
            { name: 'Dashboard', href: '/dashboard' },
            { name: 'Pricing', href: '#' }
          ])}

          {/* Company Column */}
          {col('Company', [
            { name: 'About Us', href: '#' },
            { name: 'Blog', href: '#' },
            { name: 'Careers', href: '#' },
            { name: 'Contact', href: '#' }
          ])}

          {/* Resources Column */}
          {col('Resources', [
            { name: 'Help Center', href: '#' },
            { name: 'Privacy Policy', href: '/privacy' },
            { name: 'Terms of Service', href: '/terms' },
            { name: 'Status', href: '#' }
          ])}

          {/* Follow Us Column - 2x2 grid of modern card integrations */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-2">
              <h4 className="text-[11px] font-bold text-[#1F1B16] uppercase tracking-[0.15em]">Follow us</h4>
              <div className="w-6 h-0.5 bg-[#C17817]/40" />
            </div>
            <div className="grid grid-cols-2 gap-3 max-w-[180px]">
              {[
                {
                  name: 'Google',
                  href: 'https://www.google.com/search?q=what+is+kalnet&sca_esv=a64f8b6be24e5a42&sxsrf=APpeQnsQ1H7ZdogTGTh6kes2HUTExNVo_Q%3A1785578547673&ei=M8RtaoTTKK-dseMPuaP64A0&ved=0ahUKEwjEuLW4lv-VAxWvTmwGHbmRHtwQ4dUDCBA&uact=5&oq=what+is+kalnet&gs_lp=Egxnd3Mtd2l6LXNlcnAiDndoYXQgaXMga2FsbmV0MgUQIRifBTIFECEYnwUyBRAhGJ8FSNMpULMJWIEhcA94AJABAJgBaqABaqoBAzAuMbgBA8gBAPgBAZgCD6ACb8ICChAAGEcY1gQYsAPCAgsQABiABBixAxiDAcICDhAAGIAEGIoFGI0GGLEDwgIREC4YgAQYsQMYgwEYxwEY0QPCAggQABiABBixA8ICERAuGIAEGIoFGJECGMcBGK8BwgILEAAYgAQYigUYkQLCAg4QABiABBiKBRixAxiDAcICBRAAGIAEwgIgEC4YgAQYigUYkQIYxwEYrwEYlwUY3AQY3gQY4ATYAQHCAhEQLhiABBiKBRiRAhjHARjRA8ICEBAAGIAEGIoFGLEDGIMBGArCAgkQABiABBgKGAvCAgYQABgWGB7CAggQABiABBiiBMICBRAAGO8FmAMAiAYBkAYDugYGCAEQARgUkgcCMTWgB8MBsgcAuAcAwgcIMC4xLjEyLjLIB1qACAE&sclient=gws-wiz-serp',
                  icon: (
                    <svg viewBox="0 0 24 24" className="w-5 h-5">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                  )
                },
                {
                  name: 'Instagram',
                  href: 'https://www.instagram.com/kalnet_global/',
                  icon: (
                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#E1306C]" fill="none" stroke="currentColor" strokeWidth={2}>
                      <rect x="2" y="2" width="20" height="20" rx="5"/>
                      <circle cx="12" cy="12" r="4"/>
                      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor"/>
                    </svg>
                  )
                },
                {
                  name: 'LinkedIn',
                  href: 'https://www.linkedin.com/company/kalnet-technology/posts/?feedView=all',
                  icon: (
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#0077B5]">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                    </svg>
                  )
                },
                {
                  name: 'Telegram',
                  href: '#',
                  icon: (
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#0088cc]">
                      <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.562 8.161c-.18.717-.962 4.084-1.362 5.441-.168.575-.38.767-.584.785-.444.041-.781-.293-1.211-.575-.672-.441-1.05-.714-1.703-1.144-.755-.498-.266-.773.165-1.22.113-.117 2.074-1.902 2.112-2.064.005-.021.01-.1-.037-.142-.047-.043-.117-.028-.168-.017-.072.016-1.225.779-3.46 2.29-.327.225-.623.336-.888.33-.292-.007-.854-.166-1.272-.302-.513-.167-.92-.255-.884-.539.019-.147.221-.298.607-.452 2.378-1.035 3.965-1.719 4.761-2.051 2.268-.946 2.74-1.111 3.047-1.116.068 0 .22.016.318.096.083.068.112.16.123.226.012.072.026.242.015.375z"/>
                    </svg>
                  )
                }
              ].map(s => (
                <motion.a
                  key={s.name}
                  href={s.href}
                  target={s.href === '#' ? undefined : '_blank'}
                  rel={s.href === '#' ? undefined : 'noopener noreferrer'}
                  title={s.name}
                  aria-label={s.name}
                  whileHover={{ scale: 1.08, y: -2 }}
                  className="w-12 h-12 rounded-[18px] bg-white border border-[#F0EBE0] flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md hover:border-[#C17817]/25"
                >
                  <span>
                    {s.icon}
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#9B8F85]">
            © 2026 AURA by Kalnet. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-[#9B8F85] hover:text-[#C17817] transition-colors relative group">
              Privacy
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C17817] group-hover:w-full transition-all duration-300" />
            </a>
            <a href="#" className="text-xs text-[#9B8F85] hover:text-[#C17817] transition-colors relative group">
              Terms
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C17817] group-hover:w-full transition-all duration-300" />
            </a>
            <a href="#" className="text-xs text-[#9B8F85] hover:text-[#C17817] transition-colors relative group">
              Cookies
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C17817] group-hover:w-full transition-all duration-300" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* --------------------------------- PAGE --------------------------------- */
export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => { if (!loading && user) router.replace('/dashboard'); }, [user, loading, router]);

  if (loading) return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#FDFAF6]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#C17817] border-t-transparent"/>
        <p className="text-[12px] font-bold text-[#6B6258] uppercase tracking-wider animate-pulse">Initializing AURA...</p>
      </div>
    </div>
  );
  if (user) return null;

  return (
    <div className="bg-[#FDFAF6] text-[#1F1B16] min-h-screen font-sans selection:bg-[#C17817]/20">
      <Navbar/>
      <main>
        <Hero/>
        <TrustedBy/>
        <IntegrationsOrbitSection/>
        <AISection/>
        <HowItWorks/>
        <Testimonials/>
        <CTABanner/>
      </main>
      <Footer/>
      <AIAssistantWidget/>
    </div>
  );
}
