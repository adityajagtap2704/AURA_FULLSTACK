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
          {['Features', 'Integrations', 'How it works', 'Pricing', 'Resources'].map(l => (
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
            {['Features','Integrations','How it works','Pricing','Resources'].map(l=>(
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
const INTEGRATIONS = [
  { name:'Gmail', desc:'Stay on top of your emails effortlessly.', bg:'#FEF2F2', logo:(
    <svg viewBox="0 0 48 48" className="w-10 h-10"><path d="M6 8h36v32H6z" fill="#fff" rx="3"/><path d="M6 8l18 13L42 8" stroke="#EA4335" strokeWidth="2.5" fill="none"/><path d="M6 8h36l-18 13z" fill="#EA4335"/><rect x="6" y="8" width="36" height="32" rx="3" stroke="#EA4335" strokeWidth="1.5" fill="none"/></svg>
  )},
  { name:'Google Calendar', desc:'Never miss a meeting or deadline.', bg:'#EFF6FF', logo:(
    <svg viewBox="0 0 48 48" className="w-10 h-10"><rect x="4" y="8" width="40" height="36" rx="4" fill="#fff" stroke="#4285F4" strokeWidth="1.5"/><rect x="4" y="8" width="40" height="12" rx="4" fill="#4285F4"/><text x="24" y="36" textAnchor="middle" fill="#4285F4" fontSize="14" fontWeight="bold">31</text><line x1="14" y1="4" x2="14" y2="14" stroke="#4285F4" strokeWidth="2.5" strokeLinecap="round"/><line x1="34" y1="4" x2="34" y2="14" stroke="#4285F4" strokeWidth="2.5" strokeLinecap="round"/></svg>
  )},
  { name:'Notion', desc:'Organize your docs and ideas seamlessly.', bg:'#F9FAFB', logo:(
    <svg viewBox="0 0 48 48" className="w-10 h-10"><rect x="4" y="4" width="40" height="40" rx="8" fill="#1F1B16"/><text x="24" y="31" textAnchor="middle" fill="white" fontSize="22" fontWeight="900">N</text></svg>
  )},
  { name:'Google Meet', desc:'Join or start meetings in one click.', bg:'#F0FDF4', logo:(
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
      className="group relative flex flex-col items-center text-center p-8 bg-white rounded-[20px] border border-[#EDE8E0] cursor-pointer"
      style={{
        boxShadow: hovered
          ? '0 20px 50px -12px rgba(31,27,22,0.12), 0 8px 20px -8px rgba(31,27,22,0.06)'
          : '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
        transform: hovered ? 'translateY(-7px)' : 'translateY(0)',
        transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.5s ease, border-color 0.4s ease',
        borderColor: hovered ? 'transparent' : undefined,
      }}
    >
      {/* Glass reflection sweep on hover */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden rounded-[20px]"
        style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.3s ease' }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.6) 45%, rgba(255,255,255,0.3) 50%, transparent 55%)',
            transform: hovered ? 'translateX(200%)' : 'translateX(-100%)',
            transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        />
      </div>

      {/* Subtle hover glow */}
      <div
        className="absolute inset-0 rounded-[20px] pointer-events-none transition-opacity duration-500"
        style={{
          opacity: hovered ? 1 : 0,
          background: 'radial-gradient(circle at 50% 30%, rgba(193,120,23,0.05), transparent 70%)',
        }}
      />

      {/* Icon container with orbit animation */}
      <div className="relative w-[72px] h-[72px] rounded-[18px] flex items-center justify-center mb-5 shadow-sm overflow-visible"
        style={{ background: int.bg }}>
        <FloatingIcon index={index} hovered={hovered}>
          {int.logo}
        </FloatingIcon>
      </div>

      <h3 className="relative text-[15px] font-bold text-[#1F1B16] mb-1.5">{int.name}</h3>
      <p className="relative text-[12px] text-[#9B8F85] leading-snug max-w-[160px]">{int.desc}</p>
    </motion.div>
  );
}

function Integrations() {
  return (
    <section id="integrations" className="py-24 bg-[#FAFAF8] border-t border-[#EDE8E0]/60">
      <div className="max-w-[1000px] mx-auto px-6">
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
    <section className="py-6 bg-[#FAFAF8]">
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
  {name:'Ananya R.',role:'Product Designer',avatar:'👩🏽',quote:'"AURA completely changed how I manage my work. Everything is in one place now!"'},
  {name:'Rohit S.',role:'Software Engineer',avatar:'👨🏾',quote:'"The AI summary every morning saves me so much time. Super helpful and incredibly smart."'},
  {name:'Neha P.',role:'Project Manager',avatar:'👩🏻',quote:'"Finally, a tool that brings everything together in one clean dashboard. Highly recommended!"'},
];

function AvatarFloat({ index, avatar }: { index: number; avatar: string }) {
  const i = index % 3;
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`w-10 h-10 rounded-full bg-gradient-to-br from-[#FDF4E7] to-[#F0DDB4] border border-[#E8D5B0] flex items-center justify-center text-xl shrink-0 cursor-default select-none shadow-sm ${hovered ? "" : `animate-av-float-${i}`}`}
      style={{
        transform: hovered ? 'translate(0px,0px)' : undefined,
        transition: hovered ? 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)' : 'none',
        willChange: 'transform',
      }}
    >
      {avatar}
    </div>
  );
}

function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1000px] mx-auto px-6">
        <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center mb-14">
          <h2 className="text-[26px] font-black text-[#1F1B16] tracking-tight">Loved by productivity enthusiasts</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t,i)=>(
            <motion.div key={t.name} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.1}}
              whileHover={{y:-5,boxShadow:'0 16px 40px rgba(31,27,22,0.08)'}}
              className="bg-[#FDFBF8] border border-[#EDE8E0] rounded-[20px] p-7 flex flex-col gap-4 transition-all duration-300 shadow-sm">
              <div className="flex gap-1">
                {Array.from({length:5}).map((_,j)=>(
                  <svg key={j} className="w-4 h-4" viewBox="0 0 16 16" fill="#E8A422"><path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1L2 5.3l4.2-.7L8 1z"/></svg>
                ))}
              </div>
              <p className="text-[13.5px] text-[#4A3F35] leading-[1.65] font-medium flex-1">{t.quote}</p>
              <div className="flex items-center gap-3 pt-3 border-t border-[#F0EBE3]">
                <AvatarFloat index={i} avatar={t.avatar} />
                <div>
                  <div className="text-[13px] font-bold text-[#1F1B16]">{t.name}</div>
                  <div className="text-[11px] text-[#9B8F85]">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
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
    <footer className="bg-[#FDFAF6] border-t border-[#EAE3DA]">
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
            <div className="grid grid-cols-2 gap-2">
              {[{l:'Twitter',c:'#1DA1F2'},{l:'LinkedIn',c:'#0077B5'},{l:'GitHub',c:'#24292F'},{l:'Instagram',c:'#E1306C'}].map(s=>(
                <a key={s.l} href="#" className="w-9 h-9 rounded-xl bg-white border border-[#EAE3DA] flex items-center justify-center text-[11px] font-bold text-[#6B6258] hover:text-[#C17817] hover:border-[#C17817]/30 transition-all shadow-sm">
                  {s.l[0]}
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
