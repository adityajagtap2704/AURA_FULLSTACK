'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, Calendar, CheckSquare, BarChart, Send, Check } from 'lucide-react';

export default function DashboardPreview() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Hook scroll progress on this section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  // Transform values for parallax effect
  const yDashboard = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const yWidgetLeftTop = useTransform(scrollYProgress, [0, 1], [80, -140]);
  const yWidgetRightTop = useTransform(scrollYProgress, [0, 1], [120, -220]);
  const yWidgetRightBottom = useTransform(scrollYProgress, [0, 1], [60, -110]);
  const yWidgetLeftBottom = useTransform(scrollYProgress, [0, 1], [100, -180]);

  return (
    <section
      id="dashboard-preview"
      ref={sectionRef}
      className="py-32 bg-[#F7F2EC]/40 relative overflow-hidden flex flex-col items-center"
    >
      {/* Soft background accents */}
      <div className="absolute top-[30%] right-[-5%] w-[40%] h-[40%] bg-[#D89A3E]/5 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-5%] w-[40%] h-[40%] bg-[#C17817]/5 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="text-[11px] font-bold text-[#C17817] uppercase tracking-widest bg-[#F3E3C9] px-3.5 py-1.5 rounded-full">
            Product Tour
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F1B16] tracking-tight">
            Your command center for daily focus
          </h2>
          <p className="text-sm text-[#6B6258] leading-relaxed max-w-2xl mx-auto">
            Experience a gorgeous workspace that adapts to your focus. View calendars, tasks, chats, and files side-by-side with zero clutter.
          </p>
        </div>

        {/* Dashboard Parallax Container */}
        <div className="relative max-w-5xl mx-auto min-h-[450px] sm:min-h-[580px] lg:min-h-[660px]">
          
          {/* 1. Main Dashboard Mockup Viewport */}
          <motion.div
            style={{ y: yDashboard }}
            className="w-full bg-[#FDFBF8] rounded-[2.5rem] border border-[#E8DDD2] shadow-[0_30px_70px_rgba(31,27,22,0.1)] overflow-hidden"
          >
            {/* Browser Header Bar */}
            <div className="bg-[#F7F2EC] border-b border-[#E8DDD2] px-6 py-4 flex items-center justify-between">
              {/* Browser Dots */}
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#E58C8C]" />
                <div className="w-3 h-3 rounded-full bg-[#E5C78C]" />
                <div className="w-3 h-3 rounded-full bg-[#8CE59E]" />
              </div>
              {/* Browser Address Bar */}
              <div className="bg-white/80 border border-[#E8DDD2] text-[#6B6258] text-[10px] font-medium tracking-wide px-12 py-1.5 rounded-xl w-1/2 text-center select-none shadow-inner">
                app.aura.space/dashboard
              </div>
              {/* Empty space to balance */}
              <div className="w-12" />
            </div>

            {/* Application Inside Layout */}
            <div className="grid grid-cols-12 h-[350px] sm:h-[480px] lg:h-[540px]">
              
              {/* Sidebar Panel */}
              <div className="col-span-3 border-r border-[#E8DDD2] bg-[#F7F2EC]/30 p-4 space-y-6 hidden sm:block">
                {/* Brand */}
                <div className="flex items-center gap-2 px-2">
                  <div className="h-6 w-6 text-[#C17817]">
                    <svg viewBox="0 0 100 100" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="3">
                      <circle cx="50" cy="50" r="44" />
                      <line x1="15" y1="50" x2="85" y2="50" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-[#1F1B16] tracking-wider">AURA</span>
                </div>
                {/* Sidebar Navigation */}
                <nav className="space-y-1">
                  {[
                    { label: 'Inbox', active: false },
                    { label: 'Tasks', active: true },
                    { label: 'Calendar', active: false },
                    { label: 'Documents', active: false },
                    { label: 'Analytics', active: false },
                    { label: 'Settings', active: false },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`px-3 py-2 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                        item.active
                          ? 'bg-[#C17817] text-white shadow-sm'
                          : 'text-[#6B6258] hover:bg-[#F7F2EC] hover:text-[#1F1B16]'
                      }`}
                    >
                      {item.label}
                    </div>
                  ))}
                </nav>
              </div>

              {/* Main Content Area */}
              <div className="col-span-12 sm:col-span-9 p-6 overflow-hidden flex flex-col gap-6">
                {/* Header Welcome */}
                <div className="flex justify-between items-center border-b border-[#E8DDD2]/50 pb-4">
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-[#1F1B16] tracking-tight">Focus Dashboard</h4>
                    <p className="text-[10px] text-[#6B6258]">Welcome back, Madhan Mohan</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-[#C17817] bg-[#F3E3C9] px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Pro Trial
                    </span>
                  </div>
                </div>

                {/* Dashboard Widgets Row */}
                <div className="grid grid-cols-12 gap-4 flex-1 overflow-hidden">
                  
                  {/* Tasks Column */}
                  <div className="col-span-12 lg:col-span-7 bg-[#FFFFFF] border border-[#E8DDD2] rounded-2xl p-4 flex flex-col h-full overflow-hidden shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold text-[#1F1B16]">Active Checklist</span>
                      <span className="text-[9px] text-[#C17817] font-bold cursor-pointer hover:underline">View all</span>
                    </div>
                    <div className="space-y-2 flex-1 overflow-y-auto pr-1">
                      {[
                        { title: 'Refactor core landing page layout', done: true },
                        { title: 'Connect Supabase edge listeners', done: true },
                        { title: 'Integrate Notion task synchronizer', done: false },
                        { title: 'Configure Redis BullMQ workers', done: false },
                        { title: 'Schedule weekly planning synchro-call', done: false },
                      ].map((task, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 p-2 rounded-xl bg-[#F7F2EC]/40 border border-[#E8DDD2]/30 hover:bg-[#F7F2EC]/60 transition-colors">
                          <div className={`h-4.5 w-4.5 rounded border flex items-center justify-center cursor-pointer shrink-0 transition-colors ${
                            task.done ? 'bg-[#C17817] border-[#C17817] text-white' : 'border-[#E8DDD2] bg-white'
                          }`}>
                            {task.done && <Check className="h-3 w-3 stroke-[3]" />}
                          </div>
                          <span className={`text-[10px] font-medium leading-none ${
                            task.done ? 'line-through text-[#6B6258]/60' : 'text-[#1F1B16]'
                          }`}>
                            {task.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right mini panel */}
                  <div className="col-span-12 lg:col-span-5 flex flex-col gap-4 h-full">
                    {/* Time blocking */}
                    <div className="bg-[#FFFFFF] border border-[#E8DDD2] rounded-2xl p-4 shadow-sm flex-1">
                      <span className="text-xs font-bold text-[#1F1B16] block mb-2">Today's Schedule</span>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between border-l-2 border-[#C17817] pl-2 py-0.5">
                          <span className="text-[9px] font-semibold text-[#1F1B16] block">UI/UX Flow Review</span>
                          <span className="text-[8px] text-[#6B6258]">09:30 AM</span>
                        </div>
                        <div className="flex items-center justify-between border-l-2 border-[#D89A3E] pl-2 py-0.5">
                          <span className="text-[9px] font-semibold text-[#1F1B16] block">Notion Sync Checkup</span>
                          <span className="text-[8px] text-[#6B6258]">11:00 AM</span>
                        </div>
                        <div className="flex items-center justify-between border-l-2 border-[#E8DDD2] pl-2 py-0.5">
                          <span className="text-[9px] font-semibold text-[#1F1B16]/60 block">Lunch & Walk</span>
                          <span className="text-[8px] text-[#6B6258]/60">01:00 PM</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </motion.div>

          {/* 2. Floating Widget: AI Summary (Top Left) */}
          <motion.div
            style={{ y: yWidgetLeftTop }}
            className="absolute left-[-20px] top-[10%] w-[180px] sm:w-[240px] glass rounded-3xl p-5 border border-[#E8DDD2] shadow-lg z-20 pointer-events-none hidden sm:block"
          >
            <div className="flex items-center gap-2 text-[#C17817] mb-2.5">
              <Sparkles className="h-4.5 w-4.5 animate-pulse" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider">AI Daily Brief</span>
            </div>
            <p className="text-[10px] text-[#6B6258] leading-relaxed">
              "You have <strong>3 key meetings</strong> today. Notion tasks regarding API sync should be prioritized to unlock the dev team."
            </p>
          </motion.div>

          {/* 3. Floating Widget: Analytics Graph (Top Right) */}
          <motion.div
            style={{ y: yWidgetRightTop }}
            className="absolute right-[-30px] top-[-20px] w-[160px] sm:w-[220px] bg-[#FDFBF7] rounded-3xl p-4 border border-[#E8DDD2] shadow-xl z-20 pointer-events-none hidden sm:block"
          >
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-[10px] font-extrabold text-[#1F1B16] uppercase tracking-wider">Focus metrics</span>
              <BarChart className="h-4 w-4 text-[#C17817]" />
            </div>
            {/* Visual graph layout */}
            <div className="flex items-end justify-between h-14 pt-2">
              {[40, 65, 50, 85, 70, 95, 80].map((h, i) => (
                <div key={i} className="w-3 rounded-t-sm bg-[#F7F2EC] relative h-full">
                  <div
                    style={{ height: `${h}%` }}
                    className="absolute bottom-0 left-0 right-0 rounded-t-sm bg-gradient-to-t from-[#C17817] to-[#D89A3E]"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[7px] text-[#6B6258] font-bold mt-1.5 uppercase tracking-wide">
              <span>Mon</span>
              <span>Wed</span>
              <span>Sun</span>
            </div>
          </motion.div>

          {/* 4. Floating Widget: Quick AI Chat (Bottom Right) */}
          <motion.div
            style={{ y: yWidgetRightBottom }}
            className="absolute right-[-10px] bottom-[30px] w-[180px] sm:w-[240px] glass rounded-3xl p-4 border border-[#E8DDD2] shadow-lg z-20 pointer-events-none hidden sm:block"
          >
            <div className="space-y-3">
              <div className="bg-[#C17817]/10 text-[#C17817] text-[9px] font-medium p-2.5 rounded-2xl rounded-tr-sm self-start max-w-[90%]">
                Summarize calendar invites for tomorrow.
              </div>
              <div className="bg-white text-[#1F1B16] text-[9px] font-medium p-2.5 rounded-2xl rounded-tl-sm border border-[#E8DDD2] self-end max-w-[90%] flex items-start gap-1.5">
                <Sparkles className="h-3 w-3 text-[#C17817] shrink-0 mt-0.5" />
                <span>Found 2 invites: Sprint sync at 10 AM, Clients review at 3 PM.</span>
              </div>
            </div>
          </motion.div>

          {/* 5. Floating Widget: Success Notification (Bottom Left) */}
          <motion.div
            style={{ y: yWidgetLeftBottom }}
            className="absolute left-[-30px] bottom-[40px] bg-[#FFFFFF] rounded-2xl p-3 border border-[#E8DDD2] shadow-md z-20 flex items-center gap-3 pointer-events-none hidden sm:flex"
          >
            <div className="h-6 w-6 rounded-full bg-[#22C55E]/10 text-[#22C55E] flex items-center justify-center shrink-0">
              <Check className="h-3.5 w-3.5 stroke-[3]" />
            </div>
            <div className="space-y-0.5 pr-2">
              <span className="text-[9px] font-bold text-[#1F1B16] block leading-none">Task Completed</span>
              <span className="text-[7.5px] text-[#6B6258] block leading-none">Notion tasks synced</span>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
