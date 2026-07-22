'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, animate, useAnimation } from 'framer-motion';
import Link from 'next/link';

/* --------------------------------- NAVBAR --------------------------------- */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-[#EAE3DA]' : 'bg-transparent'}`}>
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-full border-2 border-[#C17817] flex items-center justify-center">
            <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none">
              <circle cx="10" cy="10" r="7" stroke="#C17817" strokeWidth="1.5"/>
              <path d="M10 3C10 3 7 6.5 7 10C7 13.5 10 17 10 17" stroke="#C17817" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M10 3C10 3 13 6.5 13 10C13 13.5 10 17 10 17" stroke="#C17817" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M3 10H17" stroke="#C17817" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
            </svg>
          </div>
          <span className="text-[17px] font-bold text-[#1F1B16] tracking-wide">AURA</span>
        </a>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {['Features', 'Integrations', 'How it works', 'Resources'].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/\s+/g,'-')}`}
               className="px-4 py-2 text-[13.5px] font-medium text-[#4A3F35] hover:text-[#C17817] rounded-lg transition-colors">
              {l}
            </a>
          ))}
        </nav>

        {/* CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="px-4 py-2 text-[13px] font-semibold text-[#1F1B16] border border-[#DDD5C8] rounded-xl hover:bg-[#F5EFE6] transition-all">
            Log In
          </Link>
          <Link href="/signup" className="px-5 py-2.5 text-[13px] font-bold text-white bg-[#C17817] hover:bg-[#A86510] rounded-xl shadow-md shadow-[#C17817]/30 hover:shadow-lg hover:-translate-y-px transition-all">
            Get Started
          </Link>
        </div>

        <button className="md:hidden p-2 text-[#4A3F35]" onClick={() => setOpen(o => !o)}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {open ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/> : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>}
          </svg>
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}}
            className="md:hidden bg-white border-t border-[#EAE3DA] px-6 pb-4 flex flex-col gap-1">
            {['Features','Integrations','How it works','Resources'].map(l=>(
              <a key={l} href="#" className="py-2.5 text-sm font-medium text-[#4A3F35]" onClick={()=>setOpen(false)}>{l}</a>
            ))}
            <div className="flex gap-3 mt-2 pt-2 border-t border-[#EAE3DA]">
              <Link href="/login" className="flex-1 text-center py-2.5 text-sm font-semibold border border-[#DDD5C8] rounded-xl">Log In</Link>
              <Link href="/signup" className="flex-1 text-center py-2.5 text-sm font-bold text-white bg-[#C17817] rounded-xl">Get Started</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* --------------------------------- HERO --------------------------------- */
function Hero() {
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
            <button className="flex items-center gap-3 px-5 py-3.5 bg-white border border-[#DDD5C8] hover:border-[#C17817]/50 text-[#1F1B16] font-bold text-[14px] rounded-xl hover:bg-[#FDF4E7] hover:-translate-y-0.5 transition-all shadow-sm">
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
                <div className="w-6 h-6 rounded-full border border-[#C17817] flex items-center justify-center">
                  <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none">
                    <circle cx="8" cy="8" r="5.5" stroke="#C17817" strokeWidth="1.2"/>
                    <path d="M8 2.5C8 2.5 5.5 5 5.5 8S8 13.5 8 13.5" stroke="#C17817" strokeWidth="1.1" strokeLinecap="round"/>
                    <path d="M8 2.5C8 2.5 10.5 5 10.5 8S8 13.5 8 13.5" stroke="#C17817" strokeWidth="1.1" strokeLinecap="round"/>
                  </svg>
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
                  <h3 className="text-[13px] font-bold text-[#1F1B16]">Good morning, Bhargavi 🌟</h3>
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
                    <button className="text-[8px] text-[#C17817] font-semibold">View All Documents →</button>
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
    </section>
  );
}

/* ----------------------------- INTEGRATIONS ----------------------------- */
/* ----------------------------- INTEGRATIONS ----------------------------- */
const INTEGRATIONS = [
  { name:'Gmail', desc:'Stay on top of your emails effortlessly.', bg:'#FEF2F2', accent:'#EA4335', logo:(
    <svg viewBox="0 0 48 48" className="w-10 h-10"><path d="M6 8h36v32H6z" fill="#fff" rx="3"/><path d="M6 8l18 13L42 8" stroke="#EA4335" strokeWidth="2.5" fill="none"/><path d="M6 8h36l-18 13z" fill="#EA4335"/><rect x="6" y="8" width="36" height="32" rx="3" stroke="#EA4335" strokeWidth="1.5" fill="none"/></svg>
  )},
  { name:'Google Calendar', desc:'Never miss a meeting or deadline.', bg:'#EFF6FF', accent:'#4285F4', logo:(
    <svg viewBox="0 0 48 48" className="w-10 h-10"><rect x="4" y="8" width="40" height="36" rx="4" fill="#fff" stroke="#4285F4" strokeWidth="1.5"/><rect x="4" y="8" width="40" height="12" rx="4" fill="#4285F4"/><text x="24" y="36" textAnchor="middle" fill="#4285F4" fontSize="14" fontWeight="bold">31</text><line x1="14" y1="4" x2="14" y2="14" stroke="#4285F4" strokeWidth="2.5" strokeLinecap="round"/><line x1="34" y1="4" x2="34" y2="14" stroke="#4285F4" strokeWidth="2.5" strokeLinecap="round"/></svg>
  )},
  { name:'Notion', desc:'Organize your docs and ideas seamlessly.', bg:'#F9FAFB', accent:'#1F1B16', logo:(
    <svg viewBox="0 0 48 48" className="w-10 h-10"><rect x="4" y="4" width="40" height="40" rx="8" fill="#1F1B16"/><text x="24" y="31" textAnchor="middle" fill="white" fontSize="22" fontWeight="900">N</text></svg>
  )},
  { name:'Google Meet', desc:'Join or start meetings in one click.', bg:'#F0FDF4', accent:'#34A853', logo:(
    <svg viewBox="0 0 48 48" className="w-10 h-10"><rect x="4" y="12" width="28" height="24" rx="4" fill="#34A853"/><path d="M32 20l12-8v24l-12-8V20z" fill="#4285F4"/></svg>
  )},
];

function FloatingIcon({ index, hovered, children }: { index: number; hovered: boolean; children: React.ReactNode }) {
  const orbitIndex = index % 4;
  return (
    <div
      className={hovered ? "" : `animate-icon-orbit-${orbitIndex}`}
      style={{
        transform: hovered ? 'translate(0px, 0px)' : undefined,
        transition: hovered ? 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
}

function IntegrationCard({ int, index }: { int: typeof INTEGRATIONS[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      key={int.name}
      initial={{ opacity: 0, y: 30, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.1, type: 'spring' as const, stiffness: 80, damping: 14 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full"
    >
      {/* Floating Animation Wrapper for Resting Cards */}
      <div 
        className={hovered ? "" : "animate-float-card"}
        style={{ animationDelay: `${(index % 4) * 1.8}s` }}
      >
        <div 
          className="group relative flex flex-col items-center text-center p-8 rounded-[24px] cursor-pointer overflow-hidden transition-all duration-500"
          style={{
            transform: hovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
          }}
        >
          {/* Gradient Border Frame (Replaces basic dark border with luxury gold/champagne gradient) */}
          <div 
            className="absolute inset-0 rounded-[24px] p-[1.5px] bg-gradient-to-b from-[#F3ECE2] via-[#E8DCCB] to-[#F3ECE2] transition-all duration-500 group-hover:from-[#C17817] group-hover:via-[#E8A422] group-hover:to-[#C17817]"
            style={{
              boxShadow: hovered
                ? '0 24px 50px -12px rgba(193,120,23,0.22), 0 0 20px rgba(193,120,23,0.2), 0 12px 24px -8px rgba(31,27,22,0.06)'
                : '0 12px 32px -8px rgba(31,27,22,0.05), 0 2px 8px -2px rgba(0,0,0,0.02)',
            }}
          >
            <div className="w-full h-full bg-gradient-to-b from-white via-[#FDFDFB] to-[#F9F6F1] rounded-[22.5px]" />
          </div>

          {/* Top Accent Highlight Glow */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[2px] bg-gradient-to-r from-transparent via-[#C17817]/50 to-transparent transition-opacity duration-500"
            style={{ opacity: hovered ? 1 : 0.6 }}
          />

          {/* Website Theme Gradient Background Appearance on Hover */}
          <div
            className="absolute inset-0 rounded-[24px] pointer-events-none transition-opacity duration-500 bg-gradient-to-b from-[#FDF7EE] via-[#FDF3E5]/75 to-white"
            style={{ opacity: hovered ? 1 : 0 }}
          />

          {/* Ambient Glow Behind Card (Soft gold illumination at rest, radiant on hover) */}
          <div
            className="absolute -inset-2 rounded-[28px] pointer-events-none transition-all duration-500 blur-xl -z-10"
            style={{
              opacity: hovered ? 0.85 : 0.3,
              background: 'radial-gradient(circle at 50% 40%, rgba(193,120,23,0.25), rgba(232,164,34,0.12), transparent 70%)',
            }}
          />

          {/* Periodic Glass Reflection Sweep */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[24px] z-20">
            <div
              className={`absolute top-0 -bottom-20 left-0 w-[140px] bg-gradient-to-r from-transparent via-white/50 to-transparent ${hovered ? '' : 'animate-sweep'}`}
              style={{
                animationDelay: `${index * 2.2}s`,
                transform: hovered ? 'translateX(200%)' : undefined,
                transition: hovered ? 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : undefined,
              }}
            />
          </div>

          {/* Icon Container with Zoom & Glow */}
          <div 
            className="relative z-10 w-[76px] h-[76px] rounded-[20px] flex items-center justify-center mb-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all duration-500 group-hover:scale-110 group-hover:rotate-2 group-hover:shadow-lg"
            style={{ background: int.bg }}
          >
            <FloatingIcon index={index} hovered={hovered}>
              {int.logo}
            </FloatingIcon>

            {/* Soft Icon Ambient Glow */}
            <div 
              className="absolute inset-0 rounded-[20px] transition-opacity duration-500 pointer-events-none"
              style={{
                opacity: hovered ? 0.35 : 0.1,
                boxShadow: `0 0 20px ${int.accent || '#C17817'}`,
              }}
            />
          </div>

          {/* Title with Theme Accent color transition */}
          <h3 className="relative z-10 text-[16px] font-bold text-[#1F1B16] mb-1.5 transition-colors duration-300 group-hover:text-[#C17817]">
            {int.name}
          </h3>
          
          {/* Description */}
          <p className="relative z-10 text-[12.5px] text-[#8C8074] leading-snug max-w-[170px] transition-colors duration-300 group-hover:text-[#6B6258]">
            {int.desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function Integrations() {
  return (
    <section id="integrations" className="py-24 bg-[#FAFAF8] border-t border-[#EDE8E0]/60 relative overflow-hidden">
      {/* Background ambient grid pattern & radial blur */}
      <div className="absolute inset-0 pointer-events-none" style={{backgroundImage:'radial-gradient(#E8A422 1px, transparent 1px)',backgroundSize:'32px 32px', opacity: 0.03}} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[250px] bg-[#C17817]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1000px] mx-auto px-6 relative z-10">
        <motion.h2 initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.5}}
          className="text-center text-[26px] font-black text-[#1F1B16] mb-14 tracking-tight">
          All your tools. Connected seamlessly.
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {INTEGRATIONS.map((int, i) => (
            <IntegrationCard key={int.name} int={int} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ AI SECTION ------------------------------ */
function AISection() {
  return (
   <section id="features" className="py-6 bg-[#FAFAF8]">
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
  {label:'Connect your tools',desc:'One-click OAuth with all major apps.'},
  {label:'We sync your data securely',desc:'Real-time sync across all connected tools.'},
  {label:'AI organizes everything',desc:'Smart summaries and priority queues daily.'},
  {label:'You get clarity and get things done',desc:'Start every day with a clear action plan.'},
];
const STEP_ICONS = [
  // Link - Connect
  <svg key="link" className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="#C17817" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path className="neural-stroke" d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
    <path className="neural-stroke" d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
  </svg>,
  // Refresh - Sync
  <svg key="sync" className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="#C17817" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path className="neural-stroke" d="M23 4v6h-6"/>
    <path className="neural-stroke" d="M1 20v-6h6"/>
    <path className="neural-stroke" d="M3.51 9a9 9 0 0114.85-3.36L23 10"/>
    <path className="neural-stroke" d="M20.49 15a9 9 0 01-14.85 3.36L1 14"/>
  </svg>,
  // Star - AI
  <svg key="ai" className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="#C17817" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path className="neural-stroke" d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
  </svg>,
  // Check circle - Done
  <svg key="done" className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="#C17817" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path className="neural-stroke" d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
    <polyline className="neural-stroke" points="22 4 12 14.01 9 11.01"/>
  </svg>,
];

const STATS = [
  {icon:'⊞',num:4,suffix:'+',label:'Connected Apps'},
  {icon:'🔒',num:100,suffix:'%',label:'Secure & Private'},
  {icon:'☰',num:1,suffix:'',label:'Unified Dashboard'},
  {icon:'⟳',num:24,suffix:'/7',label:'Smart Sync'},
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
  const [pulseProgress, setPulseProgress] = useState(0);
  const [statsActive, setStatsActive] = useState(false);

  // Pulse timing: each step gets ~0.25 of the total duration
  const PULSE_DURATION = 2.0;
  const STEP_DELAY = 0.5;

  useEffect(() => {
    if (!sectionInView) return;
    // Start pulse animation
    const controls = animate(0, 1, {
      duration: PULSE_DURATION,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(v) { setPulseProgress(v); },
      onComplete() { setStatsActive(true); },
    });
    return () => controls.stop();
  }, [sectionInView]);

  return (
    <section id="how-it-works" ref={sectionRef} className="py-24 bg-[#FDFAF6]">
      <div className="max-w-[1000px] mx-auto px-6">
        <motion.h2 initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
          transition={{duration:0.5,ease:'easeOut'}}
          className="text-center text-[26px] font-black text-[#1F1B16] mb-16 tracking-tight">
          How AURA works
        </motion.h2>

        {/* Steps */}
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Connector line with golden pulse */}
          <div className="hidden md:block absolute top-[34px] left-[16%] right-[16%] h-0">
            {/* Base dashed line */}
            <div className="absolute inset-0 border-t border-dashed border-[#DDD5C8]"/>
            {/* Golden pulse traveling left to right */}
            <motion.div
              className="absolute top-[-2px] left-0 h-[5px] rounded-full"
              style={{
                width: `${Math.min(pulseProgress * 110, 100)}%`,
                background: 'linear-gradient(90deg, transparent 0%, #C17817 20%, #E8A422 50%, #C17817 80%, transparent 100%)',
                boxShadow: pulseProgress > 0 && pulseProgress < 1 ? '0 0 20px rgba(193,120,23,0.6), 0 0 40px rgba(193,120,23,0.3)' : 'none',
                transition: 'box-shadow 0.3s ease',
              }}
            />
            {/* Pulse head glow */}
            {pulseProgress > 0 && pulseProgress < 1 && (
              <div
                className="absolute top-[-6px] w-[17px] h-[17px] rounded-full pointer-events-none"
                style={{
                  left: `calc(${Math.min(pulseProgress * 110, 100)}% - 8px)`,
                  background: 'radial-gradient(circle, rgba(232,164,34,0.8) 0%, rgba(193,120,23,0.4) 40%, transparent 70%)',
                  filter: 'blur(2px)',
                }}
              />
            )}
          </div>

          {STEPS.map((s,i)=>{
            const stepThreshold = i / 4;
            const isActivated = pulseProgress > stepThreshold;
            const activationProgress = isActivated ? Math.min((pulseProgress - stepThreshold) * 4, 1) : 0;

            return (
              <motion.div key={s.label}
                className="flex flex-col items-center text-center group">
                {/* Icon container */}
                <motion.div
                  initial={{opacity:0,y:20,scale:0.8}}
                  animate={isActivated ? {opacity:1,y:0,scale:1} : {opacity:0,y:20,scale:0.8}}
                  transition={{duration:0.5,ease:[0.22,1,0.36,1]}}
                  whileHover={{scale:1.1,rotate:5}}
                  className={`w-[68px] h-[68px] rounded-[18px] flex items-center justify-center mb-4 shadow-sm relative z-10 transition-all duration-500 ${
                    isActivated
                      ? 'bg-[#FDF4E7] border border-[#EDD9A3] shadow-[0_0_20px_rgba(193,120,23,0.15)]'
                      : 'bg-[#F5F0E8]/60 border border-[#E5DED5] opacity-40'
                  }`}
                  style={{
                    animation: isActivated ? `neural-breathe 3s ease-in-out ${i * 0.3}s infinite` : 'none',
                  }}>
                  {/* Breathing glow overlay */}
                  {isActivated && (
                    <div className="absolute inset-0 rounded-[18px] pointer-events-none"
                      style={{
                        background: 'radial-gradient(circle at center, rgba(193,120,23,0.1), transparent 70%)',
                        animation: `neural-glow-pulse 3s ease-in-out ${i * 0.3}s infinite`,
                      }}
                    />
                  )}
                  {/* SVG with stroke draw animation */}
                  <div style={{
                    opacity: activationProgress,
                    transform: `scale(${0.5 + activationProgress * 0.5})`,
                    transition: 'transform 0.4s ease',
                  }}>
                    {STEP_ICONS[i]}
                  </div>
                </motion.div>

                {/* Text */}
                <motion.h3
                  initial={{opacity:0,y:10}}
                  animate={isActivated ? {opacity:1,y:0} : {opacity:0,y:10}}
                  transition={{duration:0.4,delay:0.1,ease:'easeOut'}}
                  className="text-[13px] font-bold text-[#1F1B16] mb-2 leading-snug">
                  {s.label}
                </motion.h3>
                <motion.p
                  initial={{opacity:0,y:10}}
                  animate={isActivated ? {opacity:1,y:0} : {opacity:0,y:10}}
                  transition={{duration:0.4,delay:0.2,ease:'easeOut'}}
                  className="text-[12px] text-[#9B8F85] leading-relaxed">
                  {s.desc}
                </motion.p>
              </motion.div>
            );
          })}
        </div>

        {/* Stats - activate after pulse completes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-20">
          {STATS.map((s,i)=>(
            <motion.div key={s.label}
              initial={{opacity:0,y:24,scale:0.96}}
              animate={statsActive ? {opacity:1,y:0,scale:1} : {opacity:0,y:24,scale:0.96}}
              transition={{delay:i*0.12,duration:0.5,ease:[0.22,1,0.36,1]}}
              whileHover={{y:-5,boxShadow:'0 16px 40px rgba(31,27,22,0.08)'}}
              className="bg-white rounded-[20px] p-6 border border-[#EDE8E0] shadow-sm hover:shadow-md flex items-center gap-4 transition-all duration-300 group">
              <motion.div
                whileHover={{scale:1.1,rotate:-5}}
                transition={{duration:0.3}}
                className="w-12 h-12 rounded-xl bg-[#FDF4E7] flex items-center justify-center text-2xl shrink-0 group-hover:shadow-md transition-shadow duration-300">
                {s.icon}
              </motion.div>
              <div>
                <AnimatedCounter target={s.num} suffix={s.suffix} start={statsActive} />
                <div className="text-[11px] text-[#9B8F85] font-medium mt-0.5">{s.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- TESTIMONIALS ----------------------------- */
const TESTIMONIALS = [
  {name:'Priya Sharma',role:'Product Designer',avatarColor:'#C17817',initials:'PS',quote:'"AURA completely changed how I manage my work. I love the clean interface — everything is exactly where I expect it to be."'},
  {name:'Rajesh Kumar',role:'Software Engineer',avatarColor:'#E8A422',initials:'RK',quote:'"The AI summary every morning saves me so much time. Very professional and well-designed portal. Highly recommended!"'},
  {name:'Ms. Anita Desai',role:'Project Manager',avatarColor:'#A86510',initials:'AD',quote:'"Managing my team and schedule used to take hours. Now the approval chain runs automatically and I get notified in real time."'},
  {name:'David L.',role:'Startup Founder',avatarColor:'#D4942A',initials:'DL',quote:'"Finally, a tool that brings everything together in one clean dashboard. The enquiry process was smooth and I got a reference number instantly."'},
  {name:'Sarah K.',role:'Freelancer',avatarColor:'#1F1B16',initials:'SK',quote:'"I love the seamless integration. Paying fees and checking announcements is so easy now. It just works flawlessly."'},
  {name:'Vikram M.',role:'Marketing Lead',avatarColor:'#6B6258',initials:'VM',quote:'"The best productivity tool I have used in years. It keeps my entire workflow organized without any unnecessary clutter."'},
];

function TestimonialCard({ t, i, isActive }: { t: typeof TESTIMONIALS[0]; i: number; isActive: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: (i % TESTIMONIALS.length) * 0.12 }}
      className="w-[85vw] md:w-[360px] lg:w-[378px] shrink-0"
    >
      <div className="h-full animate-float-card" style={{ animationDelay: `${(i % 3) * 2}s` }}>
        <div 
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="h-full w-full bg-white border-0 rounded-[22px] p-8 md:p-9 flex flex-col shadow-[0_16px_45px_rgba(31,27,22,0.08),_0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_70px_rgba(193,120,23,0.22),_0_12px_28px_rgba(31,27,22,0.08)] hover:-translate-y-[8px] hover:scale-[1.02] transition-all duration-500 relative group overflow-hidden cursor-default z-10"
        >
          {/* Full-Width Top Colored Accent Line with Website Theme Color (Exact match to reference image) */}
          <div 
            className="absolute top-0 inset-x-0 h-[4px] bg-gradient-to-r from-[#C17817] via-[#E8A422] to-[#C17817] rounded-t-[22px] transition-all duration-500 z-30"
            style={{
              boxShadow: hovered ? '0 2px 14px rgba(193,120,23,0.7)' : '0 1px 4px rgba(193,120,23,0.3)',
            }}
          />

          {/* Website Theme Gradient Background Fill Appearance on Hover (Exact match to reference image) */}
          <div 
            className="absolute inset-0 rounded-[22px] pointer-events-none transition-opacity duration-500 bg-gradient-to-b from-[#FDF7EE] via-[#FDF3E5]/75 to-white z-0"
            style={{ opacity: hovered ? 1 : 0 }} 
          />

          {/* Radiant Ambient Glow Behind Card on Hover */}
          <div
            className="absolute -inset-2 rounded-[26px] pointer-events-none transition-opacity duration-500 blur-xl -z-10"
            style={{
              opacity: hovered ? 0.8 : 0,
              background: 'radial-gradient(circle at 50% 30%, rgba(193,120,23,0.22), rgba(232,164,34,0.12), transparent 70%)',
            }}
          />

          {/* Animated Glass Reflection Sweep */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[22px] z-20">
            <div 
              className={`absolute top-0 -bottom-20 left-0 w-[150px] bg-gradient-to-r from-transparent via-white/50 to-transparent ${hovered ? '' : 'animate-sweep'}`}
              style={{
                animationDelay: `${(i % TESTIMONIALS.length) * 1.5}s`,
                transform: hovered ? 'translateX(200%)' : undefined,
                transition: hovered ? 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : undefined,
              }} 
            />
          </div>

          {/* Card Content Header */}
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="flex gap-1.5">
              {[...Array(5)].map((_, j) => (
                <svg key={j} className={`w-[18px] h-[18px] text-[#F59E0B] origin-center ${isActive ? 'animate-shimmer-star' : ''}`} style={isActive ? { animationDelay: `${j * 0.15}s` } : {}} viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <svg className="w-8 h-8 text-[#F3F4F6] transition-colors duration-500 group-hover:text-[#C17817]/35" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </div>
          
          {/* Review Text */}
          <p className="text-[14.5px] md:text-[15px] text-[#4B5563] leading-relaxed font-medium flex-1 relative z-10">
            {t.quote}
          </p>
          
          {/* Author Profile */}
          <div className="border-t border-[#F3F4F6] pt-5 mt-auto flex items-center gap-3.5 relative z-10">
            <div 
              className="w-11 h-11 rounded-[14px] flex items-center justify-center text-white text-[13px] font-bold shadow-sm transition-all duration-500 group-hover:scale-105 group-hover:ring-4 group-hover:ring-[#C17817]/25" 
              style={{backgroundColor: t.avatarColor}}
            >
              {t.initials}
            </div>
            <div>
              <div className="text-[14px] font-bold text-[#1F1B16] transition-colors duration-300 group-hover:text-[#C17817]">{t.name}</div>
              <div className="text-[12px] text-[#9B8F85] font-medium mt-0.5">{t.role}</div>
            </div>
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
    
    // Update dot safely using modulo
    const dotIndex = newIndex % TESTIMONIALS.length;
    setActiveDot(dotIndex < 0 ? TESTIMONIALS.length + dotIndex : dotIndex);

    const card = trackRef.current.children[0] as HTMLElement;
    const cardWidth = card.getBoundingClientRect().width;
    const gap = 32; // Assuming gap-8
    const stepWidth = cardWidth + gap;

    if (immediate) {
      controls.set({ x: -(stepWidth * newIndex) });
      isAnimating.current = false;
    } else {
      await controls.start({
        x: -(stepWidth * newIndex),
        transition: { duration: 1.0, ease: [0.25, 1, 0.36, 1] }
      });

      // Seamless snap if we exceed bounds
      if (indexRef.current >= TESTIMONIALS.length * 2) {
        indexRef.current -= TESTIMONIALS.length;
        controls.set({ x: -(stepWidth * indexRef.current) });
      } else if (indexRef.current <= 0) {
        indexRef.current += TESTIMONIALS.length;
        controls.set({ x: -(stepWidth * indexRef.current) });
      }
      isAnimating.current = false;
    }
  }, [controls]);

  // Initial position and window resize handler
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => slideTo(indexRef.current, true), 100);
    };
    
    // Set initial position
    slideTo(indexRef.current, true);
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
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
    <section className="py-40 md:py-48 bg-[#FDFAF6] relative overflow-hidden">
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
        @keyframes shimmer-star {
          0%, 100% { opacity: 1; transform: scale(1); filter: brightness(1); }
          50% { opacity: 0.6; transform: scale(1.15); filter: brightness(1.2); }
        }
        .animate-shimmer-star {
          animation: shimmer-star 2.5s ease-in-out infinite;
        }
      `}} />
      <div className="absolute inset-0 pointer-events-none" style={{backgroundImage:'radial-gradient(#E8A422 1px, transparent 1px)',backgroundSize:'32px 32px', opacity: 0.03}} />

      <div className="max-w-[1200px] mx-auto text-center mb-16 relative z-10 px-6">
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
          <h3 className="text-[12px] font-bold tracking-[0.2em] text-[#C17817] uppercase mb-4">
            Testimonials
          </h3>
          <h2 className="text-[36px] md:text-[48px] font-black text-[#1F1B16] tracking-tight mb-5">
            Loved by the <span className="bg-gradient-to-r from-[#C17817] to-[#D4942A] bg-clip-text text-transparent">AURA community</span>
          </h2>
          <p className="text-[16px] md:text-[18px] text-[#6B6258] font-medium max-w-[600px] mx-auto">
            Hear from professionals, teams, and individuals who use AURA every day.
          </p>
        </motion.div>
      </div>

      <div 
        className="w-full relative z-10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Main Carousel Track Container - precisely fits 3 cards on desktop */}
        <div className="max-w-[1200px] mx-auto overflow-hidden px-4 md:px-0">
          <motion.div
            ref={trackRef}
            animate={controls}
            className="flex gap-8 w-max"
          >
            {extendedItems.map((t, i) => {
              const isActive = (i % TESTIMONIALS.length) === activeDot;
              return <TestimonialCard key={i} t={t} i={i} isActive={isActive} />;
            })}
          </motion.div>
        </div>

        {/* Carousel Controls */}
        <div className="flex items-center justify-center gap-4 mt-14 relative z-20">
          <button 
            onClick={handlePrev} 
            className="w-10 h-10 rounded-[14px] border border-[#E5E7EB] flex items-center justify-center bg-white text-[#9B8F85] hover:text-[#C17817] hover:border-[#C17817]/40 hover:bg-[#FDF4E7] transition-all shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          </button>
          
          <div className="flex items-center gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button 
                key={i}
                onClick={() => slideTo(i + TESTIMONIALS.length)}
                className={`transition-all duration-500 rounded-full ${
                  activeDot === i 
                    ? 'w-6 h-2 bg-[#C17817]' 
                    : 'w-2 h-2 bg-[#E5E7EB] hover:bg-[#C17817]/50'
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>

          <button 
            onClick={handleNext} 
            className="w-10 h-10 rounded-[14px] border border-[#E5E7EB] flex items-center justify-center bg-white text-[#9B8F85] hover:text-[#C17817] hover:border-[#C17817]/40 hover:bg-[#FDF4E7] transition-all shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
          </button>

          <button 
            onClick={() => setIsPlaying(!isPlaying)} 
            className="w-10 h-10 rounded-[14px] border border-[#E5E7EB] flex items-center justify-center bg-white text-[#9B8F85] hover:text-[#C17817] hover:border-[#C17817]/40 hover:bg-[#FDF4E7] transition-all shadow-sm ml-2"
          >
            {isPlaying ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
            ) : (
              <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ CTA BANNER ------------------------------ */
function CTABanner() {
  return (
    <section className="py-10 bg-white">
      <div className="max-w-[1100px] mx-auto px-6">
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
          className="relative rounded-[28px] overflow-hidden bg-gradient-to-br from-[#1C1814] via-[#2A2018] to-[#1A1612] py-16 lg:py-20 px-10 text-center" style={{boxShadow:'0 24px 48px -12px rgba(28,24,20,0.25)'}}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-[#C17817]/15 rounded-full blur-3xl"/>
            <div className="absolute bottom-0 left-10 w-48 h-48 bg-[#E8A422]/8 rounded-full blur-3xl"/>
            <div className="absolute bottom-0 right-10 w-64 h-64 bg-[#C17817]/8 rounded-full blur-3xl"/>
            <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage:'radial-gradient(#E8A422 1px, transparent 1px)',backgroundSize:'24px 24px'}}/>
          </div>
          <div className="relative z-10">
            <h2 className="text-[34px] lg:text-[42px] font-black text-white mb-3 tracking-tight">Ready to simplify your workday?</h2>
            <p className="text-[14px] text-[#9B8F85] mb-8 max-w-md mx-auto">Bring Gmail, Calendar, Notion and Meet together in one intelligent workspace.</p>
            <Link href="/signup"
              className="inline-flex items-center gap-2.5 px-10 py-4 bg-[#C17817] hover:bg-[#A86510] text-white font-bold text-[14px] rounded-xl shadow-lg shadow-[#C17817]/40 hover:-translate-y-0.5 hover:shadow-xl transition-all">
              Start for Free
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
            <p className="text-[12px] text-[#6B6258] mt-3">No credit card required</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------- FOOTER -------------------------------- */
function Footer() {
  const col = (title: string, links: string[]) => (
    <div>
      <h4 className="text-[11px] font-bold text-[#1F1B16] mb-4 uppercase tracking-[0.1em]">{title}</h4>
      <ul className="space-y-2.5">
        {links.map(l=><li key={l}><a href="#" className="text-[13px] text-[#6B6258] hover:text-[#C17817] transition-colors">{l}</a></li>)}
      </ul>
    </div>
  );
  return (
    <footer id="resources" className="bg-[#FDFAF6] border-t border-[#EAE3DA]">
      <div className="max-w-[1200px] mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-10 pb-10 border-b border-[#EAE3DA]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full border-2 border-[#C17817] flex items-center justify-center">
                <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none">
                  <circle cx="10" cy="10" r="7" stroke="#C17817" strokeWidth="1.5"/>
                  <path d="M10 3C10 3 7 6.5 7 10C7 13.5 10 17 10 17" stroke="#C17817" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M10 3C10 3 13 6.5 13 10C13 13.5 10 17 10 17" stroke="#C17817" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-[17px] font-bold text-[#1F1B16]">AURA</span>
            </div>
            <p className="text-[13px] text-[#6B6258] leading-relaxed max-w-[200px]">Your all-in-one productivity hub, powered by AI.</p>
            <div className="flex gap-2 mt-5">
              {[
                <svg key="x" viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
                <svg key="y" viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2" fill="currentColor"/></svg>,
                <svg key="g" viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>,
                <svg key="i" viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8}><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>,
              ].map((svg,i)=>(
                <a key={i} href="#" className="w-8 h-8 rounded-xl bg-white border border-[#EAE3DA] flex items-center justify-center text-[#6B6258] hover:text-[#C17817] hover:border-[#C17817]/30 transition-all shadow-sm">
                  {svg}
                </a>
              ))}
            </div>
          </div>
          {col('Product',['Features','Integrations','Dashboard','Pricing'])}
          {col('Company',['About Us','Blog','Careers','Contact'])}
          {col('Resources',['Help Center','Privacy Policy','Terms of Service','Status'])}
          <div>
            <h4 className="text-[11px] font-bold text-[#1F1B16] mb-4 uppercase tracking-[0.1em]">Follow us</h4>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                {
                  l: 'Google',
                  href: '#',
                  icon: (
                    <svg viewBox="0 0 24 24" className="w-4 h-4">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                  )
                },
                {
                  l: 'Instagram',
                  href: '#',
                  icon: (
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#E1306C]" fill="none" stroke="currentColor" strokeWidth={2}>
                      <rect x="2" y="2" width="20" height="20" rx="5"/>
                      <circle cx="12" cy="12" r="4"/>
                      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor"/>
                    </svg>
                  )
                },
                {
                  l: 'LinkedIn',
                  href: '#',
                  icon: (
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#0077B5]">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                    </svg>
                  )
                },
                {
                  l: 'Telegram',
                  href: '#',
                  icon: (
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#0088cc]">
                      <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.562 8.161c-.18.717-.962 4.084-1.362 5.441-.168.575-.38.767-.584.785-.444.041-.781-.293-1.211-.575-.672-.441-1.05-.714-1.703-1.144-.755-.498-.266-.773.165-1.22.113-.117 2.074-1.902 2.112-2.064.005-.021.01-.1-.037-.142-.047-.043-.117-.028-.168-.017-.072.016-1.225.779-3.46 2.29-.327.225-.623.336-.888.33-.292-.007-.854-.166-1.272-.302-.513-.167-.92-.255-.884-.539.019-.147.221-.298.607-.452 2.378-1.035 3.965-1.719 4.761-2.051 2.268-.946 2.74-1.111 3.047-1.116.068 0 .22.016.318.096.083.068.112.16.123.226.012.072.026.242.015.375z"/>
                    </svg>
                  )
                }
              ].map(s => (
                <a 
                  key={s.l} 
                  href={s.href} 
                  title={s.l}
                  aria-label={s.l}
                  className="w-10 h-10 rounded-xl bg-white border-0 flex items-center justify-center transition-all duration-500 shadow-[0_4px_14px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_25px_rgba(193,120,23,0.2)] hover:-translate-y-1 group"
                >
                  <span className="transition-transform duration-500 cubic-bezier(0.34,1.56,0.64,1) group-hover:scale-130 group-hover:rotate-[15deg]">
                    {s.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-[#9B8F85]">© 2025 AURA by Kalvr. All rights reserved.</p>
          <div className="flex gap-5">
            {['Privacy','Terms','Cookies'].map(l=><a key={l} href="#" className="text-[12px] text-[#9B8F85] hover:text-[#C17817] transition-colors">{l}</a>)}
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
        <Integrations/>
        <AISection/>
        <HowItWorks/>
        <Testimonials/>
        <CTABanner/>
      </main>
      <Footer/>
    </div>
  );
}
