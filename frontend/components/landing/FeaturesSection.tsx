'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, useInView, Variants } from 'framer-motion';
import { 
  Target, Calendar, Users, FolderClosed, MessageSquareCode, 
  BarChart3, ArrowRight, Sparkles, Check, Play, Send, 
  MousePointer, FileText, Download, ShieldAlert, CheckCircle 
} from 'lucide-react';

// Word-by-word reveal helper
function AnimatedHeading({ text, underlineProgress }: { text: string; underlineProgress: any }) {
  const words = text.split(' ');
  
  return (
    <div className="flex flex-col items-center space-y-4">
      <motion.h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1F1B16] text-center tracking-tight leading-tight">
        {words.map((word, idx) => (
          <motion.span
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.215, 0.610, 0.355, 1] }}
            className="inline-block mr-2 md:mr-3"
          >
            {word}
          </motion.span>
        ))}
      </motion.h2>
      
      {/* Scroll-tied Growing Gradient Underline */}
      <div className="relative w-48 h-1 overflow-hidden rounded-full bg-[#E8DDD2]">
        <motion.div
          style={{ scaleX: underlineProgress }}
          className="absolute inset-0 bg-gradient-to-r from-[#C17817] to-[#D89A3E] origin-left"
        />
      </div>
    </div>
  );
}

// Spotlight Card Wrapper to capture mouse coordinates and render a premium glowing border spotlight
function SpotlightCard({ 
  children, 
  className = 'flex flex-col justify-between', 
  spanClass = 'md:col-span-4' 
}: { 
  children: React.ReactNode; 
  className?: string;
  spanClass?: string;
}) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const cardAnimVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.96 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 70,
        damping: 15,
        mass: 0.8
      }
    }
  };

  return (
    <motion.div
      variants={cardAnimVariants}
      viewport={{ once: true, margin: '-50px' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative p-[1.5px] rounded-[24px] bg-[#E8DDD2]/65 overflow-hidden transition-shadow duration-500 hover:shadow-[0_20px_45px_rgba(193,120,23,0.08)] ${spanClass}`}
      style={{
        background: isHovered
          ? `radial-gradient(220px circle at ${coords.x}px ${coords.y}px, rgba(193, 120, 23, 0.45), rgba(232, 221, 210, 0.65) 80%)`
          : 'rgba(232, 221, 210, 0.65)'
      }}
    >
      <div className="relative bg-[#FDFBF8]/95 backdrop-blur-md rounded-[22.5px] p-8 h-full z-10 overflow-hidden group">
        {/* Spotlight internal overlay glow */}
        {isHovered && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-0"
            style={{
              background: `radial-gradient(320px circle at ${coords.x}px ${coords.y}px, rgba(216, 154, 62, 0.08), transparent 80%)`
            }}
          />
        )}
        {/* Sparkle decorative effect on hover */}
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.8, scale: 1 }}
            className="absolute top-4 right-4 text-[#D89A3E] z-10"
          >
            <Sparkles className="h-4 w-4 animate-spin-slow" />
          </motion.div>
        )}
        <div className={`relative z-10 h-full ${className}`}>
          {children}
        </div>
      </div>
    </motion.div>
  );
}

// Icon Wrapper that floats continuously and spins/glows on card hover
function FloatingIcon({ 
  icon: Icon, 
  colorClass = 'from-[#C17817]/10 to-[#D89A3E]/10' 
}: { 
  icon: any; 
  colorClass?: string;
}) {
  return (
    <motion.div
      animate={{ y: [0, -5, 0] }}
      transition={{
        repeat: Infinity,
        duration: 3.5,
        ease: 'easeInOut'
      }}
      className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${colorClass} text-[#C17817] flex items-center justify-center border border-[#E8DDD2]/35 shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-[#C17817]/15 group-hover:shadow-md`}
    >
      <Icon className="h-5.5 w-5.5 transition-all duration-300 group-hover:text-[#D89A3E]" />
    </motion.div>
  );
}

// Read more link with sliding chevron arrow
function ReadMore() {
  return (
    <div className="flex items-center gap-1 text-xs font-bold text-[#C17817] mt-6 select-none cursor-pointer group/link">
      <span>Explore feature</span>
      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
    </div>
  );
}

const focusHoursData = [
  { day: 'Mon', hours: 3.2, percent: (3.2 / 6.0) * 100 },
  { day: 'Tue', hours: 5.4, percent: (5.4 / 6.0) * 100 },
  { day: 'Wed', hours: 2.1, percent: (2.1 / 6.0) * 100 },
  { day: 'Thu', hours: 4.8, percent: (4.8 / 6.0) * 100 },
  { day: 'Fri', hours: 6.0, percent: (6.0 / 6.0) * 100 },
  { day: 'Sat', hours: 1.5, percent: (1.5 / 6.0) * 100 },
  { day: 'Sun', hours: 3.9, percent: (3.9 / 6.0) * 100 },
];

function BarItem({ 
  item, 
  index
}: { 
  item: typeof focusHoursData[number]; 
  index: number; 
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full bg-[#FFFFFF]/60 border border-[#E8DDD2]/35 rounded-2xl relative h-full flex flex-col justify-end group/bar cursor-pointer shadow-sm transition-all duration-300 hover:border-[#1F1B16]/30 hover:bg-white"
    >
      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.9, x: '-50%' }}
            animate={{ opacity: 1, y: -10, scale: 1, x: '-50%' }}
            exit={{ opacity: 0, y: -4, scale: 0.9, x: '-50%' }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute top-[-38px] left-1/2 bg-[#1F1B16] text-[#FDFBF8] text-[9px] font-bold py-1.5 px-2.5 rounded-xl shadow-md whitespace-nowrap z-30 pointer-events-none"
          >
            <span>{item.day}: <strong>{item.hours} hrs</strong></span>
            <div className="absolute bottom-[-3px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#1F1B16] rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Growing Bar */}
      <motion.div
        initial={{ height: 0 }}
        whileInView={{ height: `${item.percent}%` }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{
          type: 'spring',
          stiffness: 75,
          damping: 15,
          delay: 0.2 + index * 0.08 // staggered by 80ms
        }}
        className="w-full bg-gradient-to-t from-[#1F1B16] to-[#1F1B16]/75 rounded-t-[10px] relative transition-all duration-300 group-hover/bar:brightness-125"
      />
    </div>
  );
}

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const isChartInView = useInView(chartRef, { once: true, margin: '-40px' });

  // Global mouse coordinates for parallax drift blobs
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 100 };
  const driftX = useSpring(useTransform(mouseX, [0, 1600], [-35, 35]), springConfig);
  const driftY = useSpring(useTransform(mouseY, [0, 900], [-35, 35]), springConfig);

  const handleGlobalMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  // Scroll tracking to feed growing underline progress
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center']
  });

  const underlineWidth = useTransform(scrollYProgress, [0.1, 0.8], [0, 1]);

  // Mini-Visual State trackers for interactive layouts
  const [taskStep, setTaskStep] = useState(0);
  const [chatMessageIdx, setChatMessageIdx] = useState(0);

  // Auto layout loops
  useEffect(() => {
    const taskInterval = setInterval(() => {
      setTaskStep((prev) => (prev + 1) % 3);
    }, 4500);

    const chatInterval = setInterval(() => {
      setChatMessageIdx((prev) => (prev + 1) % 3);
    }, 3800);

    return () => {
      clearInterval(taskInterval);
      clearInterval(chatInterval);
    };
  }, []);

  // Card 1: Tasks visual reordering board
  const taskBoards = [
    [
      { id: '1', title: 'Prepare Client Brief', priority: 'High', color: 'bg-red-50 text-red-600 border-red-100', checked: false },
      { id: '2', title: 'Sync Notion API events', priority: 'Medium', color: 'bg-amber-50 text-[#C17817] border-amber-100', checked: false },
      { id: '3', title: 'Refactor landing grid', priority: 'Low', color: 'bg-gray-50 text-gray-500 border-gray-100', checked: false }
    ],
    [
      { id: '2', title: 'Sync Notion API events', priority: 'High', color: 'bg-[#C17817]/10 text-[#C17817] border-[#C17817]/20', checked: true },
      { id: '1', title: 'Prepare Client Brief', priority: 'Medium', color: 'bg-amber-50 text-[#C17817] border-[#C17817]/20', checked: false },
      { id: '3', title: 'Refactor landing grid', priority: 'Low', color: 'bg-gray-50 text-gray-500 border-gray-100', checked: false }
    ],
    [
      { id: '3', title: 'Refactor landing grid', priority: 'High', color: 'bg-green-50 text-green-600 border-green-100', checked: true },
      { id: '2', title: 'Sync Notion API events', priority: 'Medium', color: 'bg-[#C17817]/10 text-[#C17817] border-[#C17817]/20', checked: true },
      { id: '1', title: 'Prepare Client Brief', priority: 'Low', color: 'bg-gray-50 text-gray-500 border-gray-100', checked: true }
    ]
  ];

  return (
    <section
      id="features"
      ref={sectionRef}
      onMouseMove={handleGlobalMouseMove}
      className="py-28 bg-[#FDFBF8] relative overflow-hidden flex flex-col items-center selection:bg-[#C17817]/25"
    >
      {/* Parallax drifting warm ambient gradient blobs */}
      <motion.div
        style={{ x: driftX, y: driftY }}
        className="absolute top-[15%] left-[-15%] w-[45%] h-[40%] bg-[#D89A3E]/6 blur-[150px] rounded-full pointer-events-none z-0"
      />
      <motion.div
        style={{ x: useTransform(driftX, (v) => -v), y: useTransform(driftY, (v) => -v) }}
        className="absolute bottom-[10%] right-[-15%] w-[45%] h-[40%] bg-[#C17817]/6 blur-[150px] rounded-full pointer-events-none z-0"
      />

      {/* Decorative subtle background particles */}
      <div className="absolute top-[40%] left-[25%] w-2 h-2 rounded-full bg-[#C17817]/25 blur-[1px] animate-pulse pointer-events-none hidden lg:block" />
      <div className="absolute top-[65%] right-[20%] w-3 h-3 rounded-full bg-[#D89A3E]/20 blur-[1px] animate-pulse pointer-events-none hidden lg:block" />
      <div className="absolute bottom-[20%] left-[15%] w-2.5 h-2.5 rounded-full bg-[#C17817]/15 blur-[1px] pointer-events-none hidden lg:block" />

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10 space-y-20">
        
        {/* Animated Heading Section */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[10px] font-bold text-[#C17817] uppercase tracking-widest bg-[#F3E3C9] px-4 py-1.5 rounded-full inline-block"
          >
            Core features
          </motion.span>
          
          <AnimatedHeading 
            text="Everything you need, unified" 
            underlineProgress={underlineWidth}
          />
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-xs sm:text-sm text-[#6B6258] leading-relaxed"
          >
            No more jumping between browser tabs. AURA consolidates your critical productivity tools into one fast, fluid, and beautifully designed interface.
          </motion.p>
        </div>

        {/* Bento Grid Layout (12 columns) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          transition={{ staggerChildren: 0.12 }}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch"
        >
          
          {/* CARD 1: AI Task Management (col-span-7) */}
          <SpotlightCard spanClass="md:col-span-7" className="flex flex-col md:flex-row items-stretch justify-between gap-6">
            <div className="w-full md:w-5/12 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <FloatingIcon icon={Target} colorClass="from-[#C17817]/10 to-[#D89A3E]/10" />
                <h3 className="text-xl font-bold text-[#1F1B16] tracking-tight">AI Task Management</h3>
                <p className="text-xs text-[#6B6258] leading-relaxed">
                  Smart prioritization that automatically groups tasks, sets realistic deadlines, and adapts to your rhythm.
                </p>
              </div>
              <ReadMore />
            </div>

            {/* Visual Panel: Layout-changing auto priorities */}
            <div className="w-full md:w-7/12 bg-[#F7F2EC]/40 rounded-2xl p-4 border border-[#E8DDD2]/45 flex flex-col justify-center gap-3.5 relative overflow-hidden shadow-inner">
              <div className="absolute top-2 right-2 flex items-center gap-1 text-[8px] font-bold text-[#C17817]/70 bg-white/70 px-2 py-0.5 rounded-full shadow-sm">
                <Sparkles className="h-2.5 w-2.5 animate-pulse" />
                <span>AI Prioritizing...</span>
              </div>
              
              <AnimatePresence mode="popLayout">
                {taskBoards[taskStep].map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                    className={`flex items-center justify-between p-3 rounded-xl border bg-white shadow-sm ${
                      task.checked ? 'opacity-70' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`h-4.5 w-4.5 rounded border flex items-center justify-center transition-colors ${
                        task.checked ? 'bg-[#C17817] border-[#C17817] text-white' : 'border-[#E8DDD2]'
                      }`}>
                        {task.checked && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                      <span className={`text-[10px] font-bold ${
                        task.checked ? 'line-through text-[#6B6258]' : 'text-[#1F1B16]'
                      }`}>
                        {task.title}
                      </span>
                    </div>
                    <span className={`text-[8px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide leading-none ${task.color}`}>
                      {task.priority}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </SpotlightCard>

          {/* CARD 2: Smart Calendar (col-span-5) */}
          <SpotlightCard spanClass="md:col-span-5" className="flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <FloatingIcon icon={Calendar} colorClass="from-[#C17817]/15 to-[#D89A3E]/5" />
              <h3 className="text-xl font-bold text-[#1F1B16] tracking-tight">Smart Calendar</h3>
              <p className="text-xs text-[#6B6258] leading-relaxed">
                Unified time blocking that schedules meetings, tasks, and habits seamlessly without scheduling conflicts.
              </p>
            </div>

            {/* Visual Panel: Timeline Grid block */}
            <div className="bg-[#F7F2EC]/40 rounded-2xl p-4 border border-[#E8DDD2]/45 space-y-2.5 shadow-inner">
              <div className="flex items-center justify-between border-b border-[#E8DDD2]/40 pb-2 mb-2">
                <span className="text-[9px] font-bold text-[#6B6258]/70 uppercase tracking-wider">Today's Agenda</span>
                <span className="text-[8px] font-bold text-[#C17817] uppercase tracking-wide">3 events</span>
              </div>
              <div className="relative border-l-2 border-[#C17817]/25 pl-3 py-0.5">
                <div className="absolute left-[-5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#C17817] shadow-sm border border-white" />
                <span className="text-[9px] font-bold text-[#1F1B16] block">UI/UX Sprint Review</span>
                <span className="text-[8px] text-[#6B6258]">09:30 AM - 10:30 AM</span>
              </div>
              <div className="relative border-l-2 border-[#D89A3E]/20 pl-3 py-1.5 bg-[#FFFFFF]/60 rounded-r-xl border border-dashed border-[#D89A3E]/30">
                <div className="absolute left-[-5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#D89A3E] border border-white animate-ping" />
                <div className="absolute left-[-5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#D89A3E] border border-white" />
                <span className="text-[9px] font-extrabold text-[#C17817] flex items-center gap-1">
                  <Sparkles className="h-3 w-3 animate-pulse" />
                  Auto-Scheduled: Core Sync
                </span>
                <span className="text-[8px] text-[#6B6258]">11:00 AM - 11:30 AM</span>
              </div>
              <div className="relative border-l-2 border-[#6B6258]/20 pl-3 py-0.5">
                <div className="absolute left-[-5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#6B6258]/40 border border-white" />
                <span className="text-[9px] font-bold text-[#1F1B16]/70 block">Clients Feedback Call</span>
                <span className="text-[8px] text-[#6B6258]/70">01:30 PM - 02:15 PM</span>
              </div>
            </div>

            <ReadMore />
          </SpotlightCard>

          {/* CARD 3: Team Collaboration (col-span-4) */}
          <SpotlightCard spanClass="md:col-span-4" className="flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <FloatingIcon icon={Users} colorClass="from-[#D89A3E]/15 to-[#C17817]/5" />
              <h3 className="text-xl font-bold text-[#1F1B16] tracking-tight">Team Collaboration</h3>
              <p className="text-xs text-[#6B6258] leading-relaxed">
                Shared workspaces, live cursor presence, comments, and project boards designed to keep everyone synced.
              </p>
            </div>

            {/* Visual Panel: Static user cursors */}
            <div className="bg-[#F7F2EC]/40 rounded-2xl p-5 border border-[#E8DDD2]/45 h-36 flex flex-col justify-center relative overflow-hidden shadow-inner select-none">
              <div className="bg-white border border-[#E8DDD2] p-3 rounded-xl shadow-sm text-center space-y-1">
                <span className="text-[9px] font-bold text-[#1F1B16] block">AURA Project board</span>
                <div className="h-1 w-16 bg-[#F3E3C9] rounded-full mx-auto" />
              </div>
              
              {/* Cursor 1: Sarah */}
              <div
                className="absolute flex items-center gap-1 cursor-default z-10"
                style={{ top: '35%', left: '20%' }}
              >
                <MousePointer className="h-4.5 w-4.5 text-[#C17817] fill-[#C17817]" />
                <span className="text-[7.5px] font-bold text-white bg-[#C17817] px-2 py-0.5 rounded-md shadow-md uppercase tracking-wider">
                  Sarah
                </span>
              </div>

              {/* Cursor 2: Liam */}
              <div
                className="absolute flex items-center gap-1 cursor-default z-10"
                style={{ bottom: '25%', right: '25%' }}
              >
                <MousePointer className="h-4.5 w-4.5 text-[#D89A3E] fill-[#D89A3E]" />
                <span className="text-[7.5px] font-bold text-white bg-[#D89A3E] px-2 py-0.5 rounded-md shadow-md uppercase tracking-wider">
                  Liam
                </span>
              </div>
            </div>

            <ReadMore />
          </SpotlightCard>

          {/* CARD 4: File Management (col-span-4) */}
          <SpotlightCard spanClass="md:col-span-4" className="flex-col gap-6">
            <div className="space-y-4">
              <FloatingIcon icon={FolderClosed} colorClass="from-[#C17817]/10 to-[#D89A3E]/10" />
              <h3 className="text-xl font-bold text-[#1F1B16] tracking-tight">File Management</h3>
              <p className="text-xs text-[#6B6258] leading-relaxed">
                Aggregates all your workspace documents, notes, and local files into one accessible, tags-based library.
              </p>
            </div>

            {/* Visual Panel: Organized file list */}
            <div className="bg-[#F7F2EC]/40 rounded-2xl p-4 border border-[#E8DDD2]/45 space-y-2 h-36 flex flex-col justify-center overflow-hidden shadow-inner">
              {[
                { name: '📁 Q3_Roadmap.pdf', size: '1.4 MB', tag: 'Notion' },
                { name: '📊 Focus_Stats.xlsx', size: '420 KB', tag: 'Local' },
                { name: '📄 Product_Specs.md', size: '22 KB', tag: 'Docs' }
              ].map((file, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#E8DDD2]/50 shadow-sm hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[9.5px] font-bold text-[#1F1B16] truncate max-w-[110px]">{file.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[8px] font-bold text-[#6B6258]/60 leading-none">{file.size}</span>
                    <span className="text-[7px] font-extrabold text-[#C17817] bg-[#F3E3C9]/70 px-1.5 py-0.5 rounded leading-none uppercase">
                      {file.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <ReadMore />
          </SpotlightCard>

          {/* CARD 5: AI Chat Assistant (col-span-4) */}
          <SpotlightCard spanClass="md:col-span-4" className="flex-col gap-6">
            <div className="space-y-4">
              <FloatingIcon icon={MessageSquareCode} colorClass="from-[#C17817]/15 to-[#D89A3E]/5" />
              <h3 className="text-xl font-bold text-[#1F1B16] tracking-tight">AI Chat Assistant</h3>
              <p className="text-xs text-[#6B6258] leading-relaxed">
                A helper right in your workspace. Ask questions, draft summaries, and command tasks using natural language.
              </p>
            </div>

            {/* Visual Panel: Dynamic Chat Thread simulation */}
            <div className="bg-[#F7F2EC]/40 rounded-2xl p-4 border border-[#E8DDD2]/45 h-36 flex flex-col justify-between overflow-hidden shadow-inner">
              <div className="space-y-2.5 overflow-y-auto flex-1 flex flex-col">
                {chatMessageIdx >= 0 && (
                  <div className="bg-[#C17817]/10 text-[#C17817] text-[8.5px] font-semibold px-3 py-2 rounded-xl rounded-tr-sm self-end max-w-[90%] shadow-sm">
                    Find my schedule gap.
                  </div>
                )}
                {chatMessageIdx >= 1 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white text-[#1F1B16] text-[8.5px] font-medium px-3 py-2 rounded-xl rounded-tl-sm border border-[#E8DDD2]/75 self-start max-w-[90%] flex gap-1 shadow-sm"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-[#C17817] shrink-0 mt-0.5" />
                    <span>Free slot found at 11:00 AM. Sweep Inbox scheduled!</span>
                  </motion.div>
                )}
              </div>
              <div className="flex gap-2 border-t border-[#E8DDD2]/50 pt-2.5 mt-2 bg-transparent">
                <div className="bg-white border border-[#E8DDD2] rounded-xl px-2.5 py-1.5 text-[8.5px] text-[#6B6258]/50 flex-1 select-none">
                  Message assistant...
                </div>
                <div className="h-7 w-7 rounded-xl bg-[#C17817] text-white flex items-center justify-center shrink-0">
                  <Send className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>

            <ReadMore />
          </SpotlightCard>

          {/* CARD 6: Productivity Analytics (col-span-12) */}
          <SpotlightCard spanClass="md:col-span-12" className="flex-col md:flex-row gap-8 items-stretch">
            <div className="md:w-5/12 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <FloatingIcon icon={BarChart3} colorClass="from-[#D89A3E]/15 to-[#C17817]/5" />
                <h3 className="text-2xl font-bold text-[#1F1B16] tracking-tight">Productivity Analytics</h3>
                <p className="text-xs sm:text-sm text-[#6B6258] leading-relaxed">
                  Insightful graphs reporting focus hours, completion rates, and bottlenecks, keeping you optimized.
                </p>
              </div>
              
              {/* Dual metric sub-panels */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#F7F2EC] p-3 rounded-2xl border border-[#E8DDD2]/60">
                  <span className="text-[8px] font-bold text-[#6B6258] uppercase tracking-wider block">Efficiency Score</span>
                  <span className="text-lg font-black text-[#C17817]">87%</span>
                </div>
                <div className="bg-[#F7F2EC] p-3 rounded-2xl border border-[#E8DDD2]/60">
                  <span className="text-[8px] font-bold text-[#6B6258] uppercase tracking-wider block">Time Saved</span>
                  <span className="text-lg font-black text-[#D89A3E]">4.2 hrs</span>
                </div>
              </div>

              <ReadMore />
            </div>

            {/* Visual Panel: Animated focus graph chart */}
            <div ref={chartRef} className="md:w-7/12 bg-[#F7F2EC]/40 rounded-3xl p-6 border border-[#E8DDD2]/45 flex flex-col justify-between gap-4 shadow-inner relative overflow-hidden min-h-[220px]">
              <div className="flex justify-between items-center border-b border-[#E8DDD2]/30 pb-3">
                <span className="text-[9px] font-extrabold text-[#1F1B16] uppercase tracking-wider">Weekly focus hours</span>
                <span className="text-[8.5px] font-bold text-[#C17817] bg-white border border-[#E8DDD2] px-2.5 py-1 rounded-lg">Last 7 days</span>
              </div>
              
              <div className="flex-1 flex justify-between gap-3.5 h-36 pt-6 select-none relative">
                {focusHoursData.map((item, i) => (
                  <BarItem
                    key={i}
                    item={item}
                    index={i}
                  />
                ))}
              </div>
              
              <div className="flex justify-between gap-3.5 text-[8px] text-[#6B6258] font-bold uppercase tracking-wider">
                {focusHoursData.map((item) => (
                  <span key={item.day} className="w-full text-center">{item.day}</span>
                ))}
              </div>
            </div>
          </SpotlightCard>

        </motion.div>

      </div>
    </section>
  );
}
