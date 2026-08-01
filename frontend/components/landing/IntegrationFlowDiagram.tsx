'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAnimationFrame, motion } from 'framer-motion';
import {
  AuraLogoIcon,
  GmailIcon,
  GoogleCalendarIcon,
  SlackIcon,
  NotionIcon,
  GoogleMeetIcon,
  MicrosoftIcon,
  DropboxIcon,
  LinearIcon,
} from '@/components/icons/ServiceIcons';

const LEFT = [
  { key: 'gmail', label: 'Gmail', Icon: GmailIcon },
  { key: 'calendar', label: 'Calendar', Icon: GoogleCalendarIcon },
  { key: 'slack', label: 'Slack', Icon: SlackIcon },
  { key: 'notion', label: 'Notion', Icon: NotionIcon },
];

const RIGHT = [
  { key: 'meet', label: 'Meet', Icon: GoogleMeetIcon },
  { key: 'microsoft', label: 'Microsoft 365', Icon: MicrosoftIcon },
  { key: 'dropbox', label: 'Dropbox', Icon: DropboxIcon },
  { key: 'linear', label: 'Linear', Icon: LinearIcon },
];

type Point = { x: number; y: number };

function curve(a: Point, b: Point) {
  const midX = a.x + (b.x - a.x) / 2;
  return `M ${a.x} ${a.y} C ${midX} ${a.y}, ${midX} ${b.y}, ${b.x} ${b.y}`;
}

// A small dot that travels from its logo into the AURA hub on a continuous
// loop — fading in as it leaves the logo, fading out as it arrives at AURA,
// then resetting to do it again. Used for both the left and right columns so
// every connection reads the same direction: logo → AURA.
function FlowingDot({
  pathRef,
  duration,
  delay,
}: {
  pathRef: React.RefObject<SVGPathElement | null>;
  duration: number;
  delay: number;
}) {
  const dotRef = useRef<SVGCircleElement>(null);

  useAnimationFrame((t) => {
    const path = pathRef.current;
    const dot = dotRef.current;
    if (!path || !dot) return;

    const elapsed = t / 1000 + delay;
    const cycle = ((elapsed % duration) + duration) % duration;
    const progress = cycle / duration;

    const len = path.getTotalLength();
    if (!Number.isFinite(len) || len === 0) return;
    const { x, y } = path.getPointAtLength(progress * len);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;
    dot.setAttribute('cx', String(x));
    dot.setAttribute('cy', String(y));

    // fade in leaving the logo, fade out arriving at the hub
    const fadeIn = Math.min(1, progress / 0.15);
    const fadeOut = Math.min(1, (1 - progress) / 0.15);
    dot.style.opacity = String(Math.min(fadeIn, fadeOut));
  });

  return <circle ref={dotRef} r="4" fill="#C17817" style={{ filter: 'drop-shadow(0 0 4px rgba(193,120,23,0.7))' }} />;
}

export default function IntegrationFlowDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const leftDotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const rightDotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  // Plain memoized arrays (not refs themselves) so indexing them for the
  // `pathRef` prop below isn't a `.current` read during render — only the
  // inner ref objects' `.current` gets set, and only via callback refs.
  const leftPathRefs = useMemo<React.RefObject<SVGPathElement | null>[]>(() => LEFT.map(() => ({ current: null })), []);
  const rightPathRefs = useMemo<React.RefObject<SVGPathElement | null>[]>(() => RIGHT.map(() => ({ current: null })), []);

  const [size, setSize] = useState({ width: 0, height: 0 });
  const [leftPaths, setLeftPaths] = useState<string[]>(LEFT.map(() => ''));
  const [rightPaths, setRightPaths] = useState<string[]>(RIGHT.map(() => ''));

  useEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      const center = centerRef.current;
      if (!container || !center) return;

      const containerRect = container.getBoundingClientRect();
      setSize({ width: containerRect.width, height: containerRect.height });

      const centerRect = center.getBoundingClientRect();
      const centerPoint: Point = {
        x: centerRect.left + centerRect.width / 2 - containerRect.left,
        y: centerRect.top + centerRect.height / 2 - containerRect.top,
      };

      setLeftPaths(
        leftDotRefs.current.map((dot) => {
          if (!dot) return '';
          const r = dot.getBoundingClientRect();
          const p: Point = { x: r.left + r.width / 2 - containerRect.left, y: r.top + r.height / 2 - containerRect.top };
          return curve(p, centerPoint);
        })
      );
      setRightPaths(
        rightDotRefs.current.map((dot) => {
          if (!dot) return '';
          const r = dot.getBoundingClientRect();
          const p: Point = { x: r.left + r.width / 2 - containerRect.left, y: r.top + r.height / 2 - containerRect.top };
          return curve(p, centerPoint);
        })
      );
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative hidden lg:block rounded-[28px] border border-[#F0EBE3] bg-gradient-to-b from-[#FDFBF8] to-[#FCF6EA] px-16 py-14 overflow-hidden"
    >
      {/* connecting curves + flowing dots */}
      <svg className="absolute inset-0 pointer-events-none" width={size.width} height={size.height} viewBox={`0 0 ${size.width} ${size.height}`}>
        {LEFT.map((item, i) => (
          <motion.path
            key={`left-line-${item.key}`}
            ref={(el) => { leftPathRefs[i].current = el; }}
            d={leftPaths[i]}
            stroke="#E8C98A"
            strokeWidth="1.5"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.6 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: i * 0.15 }}
          />
        ))}
        {RIGHT.map((item, i) => (
          <motion.path
            key={`right-line-${item.key}`}
            ref={(el) => { rightPathRefs[i].current = el; }}
            d={rightPaths[i]}
            stroke="#E8C98A"
            strokeWidth="1.5"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.6 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: i * 0.15 }}
          />
        ))}
        {leftPaths.every(Boolean) &&
          LEFT.map((item, i) => (
            <FlowingDot
              key={`left-dot-${item.key}`}
              pathRef={leftPathRefs[i]}
              duration={2.5}
              delay={i * 0.5}
            />
          ))}
        {rightPaths.every(Boolean) &&
          RIGHT.map((item, i) => (
            <FlowingDot
              key={`right-dot-${item.key}`}
              pathRef={rightPathRefs[i]}
              duration={2.5}
              delay={i * 0.5}
            />
          ))}
      </svg>

      {/* content grid */}
      <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-10">
        {/* left column */}
        <div className="flex flex-col gap-9">
          {LEFT.map((item, i) => (
            <div key={item.key} className="flex items-center gap-3">
              <motion.div 
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
              >
                <div 
                  className="w-14 h-14 rounded-xl bg-white border border-[#F0EBE3] shadow-sm flex items-center justify-center shrink-0 transition-all duration-300 hover:scale-110 hover:shadow-md hover:border-[#E8D5B5] group cursor-pointer"
                >
                  <item.Icon className="w-8 h-8 group-hover:rotate-3 transition-transform duration-300" />
                </div>
                <span className="text-sm font-bold text-[#4A3F35] w-[110px] shrink-0">{item.label}</span>
              </motion.div>
              <motion.span
                ref={(el) => { leftDotRefs.current[i] = el; }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="w-2 h-2 rounded-full bg-[#C17817] shrink-0 shadow-[0_0_8px_rgba(193,120,23,0.6)]"
              />
            </div>
          ))}
        </div>

        {/* center logo */}
        <motion.div 
          ref={centerRef} 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-[232px] h-[232px] flex items-center justify-center shrink-0"
        >
          <motion.div animate={{ scale: [1, 1.05, 1], opacity: [0.7, 0.4, 0.7] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FBEBCF]/70 to-transparent" />
          <motion.div animate={{ scale: [1, 1.1, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute inset-[18px] rounded-full border border-[#F0DDBB]" />
          <motion.div animate={{ scale: [1, 1.15, 1], opacity: [1, 0.3, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute inset-[34px] rounded-full border border-[#F0DDBB]" />
          
          <div 
            className="absolute inset-[50px] rounded-full bg-white border border-[#E8D5B5] shadow-[0_8px_30px_rgba(193,120,23,0.15)] flex flex-col items-center justify-center gap-1.5 transition-all duration-500 hover:scale-105 hover:shadow-[0_15px_45px_rgba(193,120,23,0.25)] hover:border-[#C17817] cursor-pointer group"
          >
            <AuraLogoIcon className="w-11 h-11 text-[#C17817] group-hover:scale-110 transition-transform duration-500" />
            <span className="text-lg font-black tracking-wide text-[#C17817]">AURA</span>
          </div>
        </motion.div>

        {/* right column */}
        <div className="flex flex-col gap-9">
          {RIGHT.map((item, i) => (
            <div key={item.key} className="flex items-center gap-3 justify-end">
              <motion.span
                ref={(el) => { rightDotRefs.current[i] = el; }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="w-2 h-2 rounded-full bg-[#C17817] shadow-[0_0_8px_rgba(193,120,23,0.6)] shrink-0"
              />
              <motion.div 
                className="flex items-center gap-3 justify-end"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
              >
                <span className="text-sm font-bold text-[#4A3F35] w-[110px] shrink-0 text-right">{item.label}</span>
                <div 
                  className="w-14 h-14 rounded-xl bg-white border border-[#F0EBE3] shadow-sm flex items-center justify-center shrink-0 transition-all duration-300 hover:scale-110 hover:shadow-md hover:border-[#E8D5B5] group cursor-pointer"
                >
                  <item.Icon className="w-8 h-8 group-hover:-rotate-3 transition-transform duration-300" />
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
