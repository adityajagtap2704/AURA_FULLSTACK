'use client';
import { useEffect, useRef, useState } from 'react';

type Tile = {
  name: string;
  x: number;
  y: number;
  tilt: number;
  amp: number;
  rot: number;
  duration: number;
  delay: number;
  glow: string;
  icon: keyof typeof ICONS;
};

const HUB = { x: 50, y: 36 };

// Spread further out from the hub than the source file (which packed tiles
// tight enough to nearly touch the hub's glow) — scaled out from HUB per-axis,
// more horizontally than vertically since the hub sits above stage-center.
const TILES: Tile[] = [
  { name: 'Gmail', x: 50.6, y: 8.7, tilt: -8, amp: 7, rot: 1.6, duration: 4.6, delay: 0.28, glow: 'rgba(234,67,53,0.35)', icon: 'gmail' },
  { name: 'Google Calendar', x: 71.9, y: 16.6, tilt: 9, amp: 6, rot: -1.4, duration: 5.4, delay: 0.36, glow: 'rgba(66,133,244,0.32)', icon: 'calendar' },
  { name: 'Notion', x: 80.6, y: 36.5, tilt: 13, amp: 7, rot: -1.8, duration: 4.2, delay: 0.44, glow: 'rgba(255,255,255,0.22)', icon: 'notion' },
  { name: 'Dropbox', x: 72.5, y: 56, tilt: 10, amp: 8, rot: -2, duration: 5.8, delay: 0.52, glow: 'rgba(0,97,254,0.3)', icon: 'dropbox' },
  { name: 'Google Meet', x: 50, y: 63.8, tilt: -5, amp: 6, rot: 1.2, duration: 3.8, delay: 0.6, glow: 'rgba(0,172,71,0.3)', icon: 'meet' },
  { name: 'Linear', x: 27.5, y: 56.5, tilt: 6, amp: 7, rot: -1.3, duration: 5.2, delay: 0.68, glow: 'rgba(94,106,210,0.32)', icon: 'linear' },
  { name: 'Microsoft 365', x: 19.4, y: 36, tilt: -9, amp: 6, rot: 1.5, duration: 4.4, delay: 0.76, glow: 'rgba(242,160,61,0.28)', icon: 'microsoft' },
  { name: 'Slack', x: 28.1, y: 16.1, tilt: -14, amp: 8, rot: 2, duration: 5, delay: 0.84, glow: 'rgba(242,160,61,0.3)', icon: 'slack' },
];

const SPARKS = [
  { x: 45, y: 38, d: 2.6 }, { x: 49, y: 30, d: 3.4 }, { x: 53, y: 44, d: 4.1 },
  { x: 47, y: 56, d: 3 }, { x: 52, y: 62, d: 3.8 }, { x: 56, y: 34, d: 4.6 }, { x: 43, y: 52, d: 3.2 },
];

const ICONS = {
  gmail: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 49.4 512 399.42"><g fill="none" fill-rule="evenodd"><g fill-rule="nonzero"><path fill="#4285f4" d="M34.91 448.818h81.454V251L0 163.727V413.91c0 19.287 15.622 34.91 34.91 34.91z"/><path fill="#34a853" d="M395.636 448.818h81.455c19.287 0 34.909-15.622 34.909-34.909V163.727L395.636 251z"/><path fill="#fbbc04" d="M395.636 99.727V251L512 163.727v-46.545c0-43.142-49.25-67.782-83.782-41.891z"/></g><path fill="#ea4335" d="M116.364 251V99.727L256 204.455 395.636 99.727V251L256 355.727z"/><path fill="#c5221f" fill-rule="nonzero" d="M0 117.182v46.545L116.364 251V99.727L83.782 75.291C49.25 49.4 0 74.04 0 117.18z"/></g></svg>`,
  calendar: `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_5072_3766)"><path d="M390.736 121.264H121.264V390.736H390.736V121.264Z" fill="white"/><path d="M390.736 512L512 390.736L451.368 380.392L390.736 390.736L379.67 446.196L390.736 512Z" fill="#EA4335"/><path d="M0 390.736V471.578C0 493.912 18.088 512 40.42 512H121.264L133.714 451.368L121.264 390.736L55.198 380.392L0 390.736Z" fill="#188038"/><path d="M512 121.264V40.42C512 18.088 493.912 0 471.58 0H390.736C383.36 30.072 379.671 52.2027 379.67 66.392C379.67 80.58 383.359 98.8707 390.736 121.264C417.556 128.944 437.767 132.784 451.368 132.784C464.969 132.784 485.18 128.945 512 121.264Z" fill="#1967D2"/><path d="M512 121.264H390.736V390.736H512V121.264Z" fill="#FBBC04"/><path d="M390.736 390.736H121.264V512H390.736V390.736Z" fill="#34A853"/><path d="M390.736 0H40.422C18.088 0 0 18.088 0 40.42V390.736H121.264V121.264H390.736V0Z" fill="#4285F4"/><path d="M176.54 330.308C166.468 323.504 159.494 313.568 155.688 300.428L179.066 290.796C181.186 298.88 184.891 305.145 190.182 309.592C195.436 314.038 201.836 316.228 209.314 316.228C216.959 316.228 223.527 313.903 229.018 309.254C234.51 304.606 237.272 298.678 237.272 291.504C237.272 284.16 234.375 278.164 228.582 273.516C222.788 268.868 215.512 266.544 206.822 266.544H193.314V243.404H205.44C212.917 243.404 219.216 241.382 224.336 237.338C229.456 233.298 232.016 227.772 232.016 220.732C232.016 214.468 229.726 209.482 225.146 205.744C220.566 202.004 214.77 200.118 207.73 200.118C200.858 200.118 195.402 201.938 191.36 205.608C187.319 209.289 184.282 213.937 182.534 219.116L159.394 209.482C162.458 200.792 168.084 193.112 176.336 186.476C184.588 179.84 195.132 176.506 207.932 176.506C217.398 176.506 225.92 178.326 233.466 181.996C241.01 185.668 246.938 190.754 251.216 197.222C255.496 203.722 257.616 210.998 257.616 219.082C257.616 227.334 255.63 234.308 251.656 240.034C247.682 245.76 242.796 250.138 237.002 253.204V254.584C244.483 257.669 250.982 262.735 255.798 269.238C260.682 275.806 263.142 283.654 263.142 292.818C263.142 301.978 260.816 310.164 256.168 317.338C251.52 324.514 245.088 330.172 236.934 334.282C228.75 338.392 219.554 340.482 209.348 340.482C197.524 340.514 186.612 337.112 176.54 330.308ZM320.132 214.298L294.466 232.858L281.632 213.39L327.678 180.176H345.328V336.842H320.132V214.298Z" fill="#4285F4"/></g><defs><clipPath id="clip0_5072_3766"><rect width="512" height="512" fill="white"/></clipPath></defs></svg>`,
  notion: `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="268" preserveAspectRatio="xMidYMid" viewBox="0 0 256 268"><path fill="#FFF" d="M16.092 11.538 164.09.608c18.179-1.56 22.85-.508 34.28 7.801l47.243 33.282C253.406 47.414 256 48.975 256 55.207v182.527c0 11.439-4.155 18.205-18.696 19.24L65.44 267.378c-10.913.517-16.11-1.043-21.825-8.327L8.826 213.814C2.586 205.487 0 199.254 0 191.97V29.726c0-9.352 4.155-17.153 16.092-18.188Z"/><path d="M164.09.608 16.092 11.538C4.155 12.573 0 20.374 0 29.726v162.245c0 7.284 2.585 13.516 8.826 21.843l34.789 45.237c5.715 7.284 10.912 8.844 21.825 8.327l171.864-10.404c14.532-1.035 18.696-7.801 18.696-19.24V55.207c0-5.911-2.336-7.614-9.21-12.66l-1.185-.856L198.37 8.409C186.94.1 182.27-.952 164.09.608ZM69.327 52.22c-14.033.945-17.216 1.159-25.186-5.323L23.876 30.778c-2.06-2.086-1.026-4.69 4.163-5.207l142.274-10.395c11.947-1.043 18.17 3.12 22.842 6.758l24.401 17.68c1.043.525 3.638 3.637.517 3.637L71.146 52.095l-1.819.125Zm-16.36 183.954V81.222c0-6.767 2.077-9.887 8.3-10.413L230.02 60.93c5.724-.517 8.31 3.12 8.31 9.879v153.917c0 6.767-1.044 12.49-10.387 13.008l-161.487 9.361c-9.343.517-13.489-2.594-13.489-10.921ZM212.377 89.53c1.034 4.681 0 9.362-4.681 9.897l-7.783 1.542v114.404c-6.758 3.637-12.981 5.715-18.18 5.715-8.308 0-10.386-2.604-16.609-10.396l-50.898-80.079v77.476l16.1 3.646s0 9.362-12.989 9.362l-35.814 2.077c-1.043-2.086 0-7.284 3.63-8.318l9.351-2.595V109.823l-12.98-1.052c-1.044-4.68 1.55-11.439 8.826-11.965l38.426-2.585 52.958 81.113v-71.76l-13.498-1.552c-1.043-5.733 3.111-9.896 8.3-10.404l35.84-2.087Z"/></svg>`,
  dropbox: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 128 128"><path fill="#0061FE" d="M0 0h128v128H0z"/><path fill="#F7F5F2" d="M43.7 32 23.404 44.75 43.701 57.5 64 44.75 84.3 57.5l20.298-12.75L84.299 32 64.002 44.75 43.7 32Zm0 51L23.404 70.25 43.701 57.5 64 70.25 43.702 83Zm20.302-12.75L84.299 57.5l20.298 12.75L84.299 83 64.002 70.25Zm0 29.75L43.7 87.25 64 74.5l20.3 12.75L64.002 100Z"/></svg>`,
  meet: `<svg width="622" height="512" viewBox="0 0 622 512" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_5072_3775)"><path d="M351.419 255.568L411.978 324.79L493.418 376.827L507.584 256.005L493.418 137.908L410.418 183.621L351.419 255.568Z" fill="#00832D"/><path d="M0.00283051 365.583V468.541C0.00283051 492.049 19.0851 511.136 42.5983 511.136H145.556L166.876 433.344L145.556 365.583L74.9198 344.263L0.00283051 365.583Z" fill="#0066DA"/><path d="M145.556 -7.62939e-06L0.00283051 145.554L74.9247 166.822L145.556 145.554L166.488 78.7145L145.556 -7.62939e-06Z" fill="#E94235"/><path d="M0.00526047 365.629H145.556V145.551H0.00526047V365.629Z" fill="#2684FC"/><path d="M586.398 61.6293L493.416 137.91V376.827L586.782 453.404C600.758 464.352 621.204 454.374 621.204 436.607V78.0861C621.204 60.1224 600.271 50.193 586.396 61.6317" fill="#00AC47"/><path d="M351.419 255.568V365.583H145.556V511.136H450.825C474.338 511.136 493.418 492.049 493.418 468.541V376.827L351.419 255.568Z" fill="#00AC47"/><path d="M450.825 -7.62939e-06H145.556V145.554H351.419V255.568L493.42 137.905V42.5979C493.42 19.0847 474.338 0.00241891 450.825 0.00241891" fill="#FFBA00"/></g><defs><clipPath id="clip0_5072_3775"><rect width="621.2" height="512" fill="white"/></clipPath></defs></svg>`,
  linear: `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" fill="none" viewBox="0 0 100 100"><path fill="#5E6AD2" d="M1.225 61.523c-.222-.949.908-1.546 1.597-.857l36.512 36.512c.69.69.092 1.82-.857 1.597-18.425-4.323-32.93-18.827-37.252-37.252ZM.002 46.889a.99.99 0 0 0 .29.76L52.35 99.71c.201.2.478.307.76.29 2.37-.149 4.695-.46 6.963-.927.765-.157 1.03-1.096.478-1.648L2.576 39.448c-.552-.551-1.491-.286-1.648.479a50.067 50.067 0 0 0-.926 6.962ZM4.21 29.705a.988.988 0 0 0 .208 1.1l64.776 64.776c.289.29.726.375 1.1.208a49.908 49.908 0 0 0 5.185-2.684.981.981 0 0 0 .183-1.54L8.436 24.336a.981.981 0 0 0-1.541.183 49.896 49.896 0 0 0-2.684 5.185Zm8.448-11.631a.986.986 0 0 1-.045-1.354C21.78 6.46 35.111 0 49.952 0 77.592 0 100 22.407 100 50.048c0 14.84-6.46 28.172-16.72 37.338a.986.986 0 0 1-1.354-.045L12.659 18.074Z"/></svg>`,
  microsoft: `<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" width="256" height="256" preserveAspectRatio="xMidYMid"><path fill="#F1511B" d="M121.666 121.666H0V0h121.666z"/><path fill="#80CC28" d="M256 121.666H134.335V0H256z"/><path fill="#00ADEF" d="M121.663 256.002H0V134.336h121.663z"/><path fill="#FBBC09" d="M256 256.002H134.335V134.336H256z"/></svg>`,
  slack: `<svg enable-background="new 0 0 2447.6 2452.5" viewBox="0 0 2447.6 2452.5" xmlns="http://www.w3.org/2000/svg"><g clip-rule="evenodd" fill-rule="evenodd"><path d="m897.4 0c-135.3.1-244.8 109.9-244.7 245.2-.1 135.3 109.5 245.1 244.8 245.2h244.8v-245.1c.1-135.3-109.5-245.1-244.9-245.3.1 0 .1 0 0 0m0 654h-652.6c-135.3.1-244.9 109.9-244.8 245.2-.2 135.3 109.4 245.1 244.7 245.3h652.7c135.3-.1 244.9-109.9 244.8-245.2.1-135.4-109.5-245.2-244.8-245.3z" fill="#36c5f0"/><path d="m2447.6 899.2c.1-135.3-109.5-245.1-244.8-245.2-135.3.1-244.9 109.9-244.8 245.2v245.3h244.8c135.3-.1 244.9-109.9 244.8-245.3zm-652.7 0v-654c.1-135.2-109.4-245-244.7-245.2-135.3.1-244.9 109.9-244.8 245.2v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.3z" fill="#2eb67d"/><path d="m1550.1 2452.5c135.3-.1 244.9-109.9 244.8-245.2.1-135.3-109.5-245.1-244.8-245.2h-244.8v245.2c-.1 135.2 109.5 245 244.8 245.2zm0-654.1h652.7c135.3-.1 244.9-109.9 244.8-245.2.2-135.3-109.4-245.1-244.7-245.3h-652.7c-135.3.1-244.9 109.9-244.8 245.2-.1 135.4 109.4 245.2 244.7 245.3z" fill="#ecb22e"/><path d="m0 1553.2c-.1 135.3 109.5 245.1 244.8 245.2 135.3-.1 244.9-109.9 244.8-245.2v-245.2h-244.8c-135.3.1-244.9 109.9-244.8 245.2zm652.7 0v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.2v-653.9c.2-135.3-109.4-245.1-244.7-245.3-135.4 0-244.9 109.8-244.8 245.1 0 0 0 .1 0 0" fill="#e01e5a"/></g></svg>`,
  aura: `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="AURA"><circle cx="32" cy="32" r="29" stroke="#d98324" stroke-width="2.2"/><circle cx="32" cy="25.5" r="5.2" stroke="#f2a03d" stroke-width="2.2"/><g stroke="#f2a03d" stroke-width="2.2" stroke-linecap="round"><path d="M32 13.4v3.4"/><path d="M43.1 25.5h-3.4"/><path d="M24.3 25.5h-3.4"/><path d="M39.9 17.6l-2.4 2.4"/><path d="M24.1 17.6l2.4 2.4"/></g><g stroke="#d98324" stroke-width="2.2" stroke-linecap="round"><path d="M11 38.5c3.5-2.6 7-2.6 10.5 0s7 2.6 10.5 0 7-2.6 10.5 0 7 2.6 10.5 0"/><path d="M13 46.5c3.2-2.4 6.3-2.4 9.5 0s6.3 2.4 9.5 0 6.3-2.4 9.5 0 6.3 2.4 9.5 0"/><path d="M19 54c2.6-1.9 5.2-1.9 7.8 0s5.2 1.9 7.8 0 5.2-1.9 7.8 0"/></g></svg>`,
};

type CSSVars = React.CSSProperties & Record<string, string | number>;

export default function IntegrationsOrbitSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const v = visible ? ' visible' : '';

  return (
    <section className="aura-section" ref={sectionRef}>
      <div className="aura-container">
        <div className="aura-heading">
          <span className={`aura-badge${v}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            Integrations
          </span>
          <h2 className={`aura-title${v}`}>
            All your tools. <span className="accent">Connected</span> seamlessly.
          </h2>
          <p className={`aura-description${v}`}>
            Bring your favorite tools together and streamline your workflow like never before.
          </p>
        </div>

        <div className="aura-stage">
          <div className={`aura-haze${v}`} />

          <div className="aura-scene">
          <svg className={`aura-wires${v}`} viewBox="0 0 100 100" preserveAspectRatio="none">
            {TILES.map((tile, i) => (
              <line
                key={tile.name}
                x1={HUB.x}
                y1={HUB.y}
                x2={tile.x}
                y2={tile.y}
                stroke="#f2a03d"
                strokeWidth="0.18"
                strokeLinecap="round"
                strokeDasharray="1.2 3"
                opacity="0.3"
                style={{ animation: `orbit-wire-flow ${3 + i * 0.35}s linear infinite` }}
              />
            ))}
          </svg>

          <div>
            {TILES.map((tile) => (
              <div key={tile.name} className="aura-tile" style={{ left: `${tile.x}%`, top: `${tile.y}%` }}>
                <div style={{ animation: `orbit-rise 1s cubic-bezier(0.22,1,0.36,1) ${tile.delay}s both` }}>
                  <div
                    style={
                      {
                        '--amp': tile.amp,
                        '--rot': tile.rot,
                        animation: `orbit-float ${tile.duration}s ease-in-out ${tile.delay + 1}s infinite`,
                      } as CSSVars
                    }
                  >
                    <div
                      className="aura-tile-glow"
                      style={{ background: `radial-gradient(50% 50% at 50% 55%, ${tile.glow}, transparent 72%)` }}
                    />
                    <div
                      className="aura-tile-inner"
                      style={{ transform: `rotate(${tile.tilt}deg)` }}
                      dangerouslySetInnerHTML={{ __html: ICONS[tile.icon] }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="aura-hub" style={{ left: '50%', top: '36%' }}>
            <div style={{ animation: 'orbit-hub-in 1.1s cubic-bezier(0.22,1,0.36,1) 0.05s both' }}>
              <div style={{ animation: 'orbit-hub-float 6s ease-in-out 1.1s infinite' }}>
                <div
                  style={{
                    pointerEvents: 'none',
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    background: 'radial-gradient(50% 50% at 50% 50%, rgba(242,160,61,0.55), transparent 70%)',
                    filter: 'blur(20px)',
                    transform: 'scale(1.7)',
                  }}
                />
                <div className="aura-hub-container" dangerouslySetInnerHTML={{ __html: ICONS.aura }} />
              </div>
            </div>
          </div>

          <div className="aura-effects">
            <div className={`aura-light-cone${v}`} />
            <div className={`aura-core${v}`} />
            <div className={`aura-disc${v}`}>
              <div className="aura-disc-haze" />
              <div className="aura-disc-surface" />
              <div className="aura-disc-rim" />
              <div>
                {SPARKS.map((s, i) => (
                  <div
                    key={i}
                    className="aura-sparkle"
                    style={{ left: `${s.x}%`, top: `${s.y}%`, animation: `orbit-spark ${s.d}s ease-in-out ${i * 0.25}s infinite` }}
                  />
                ))}
              </div>
            </div>
            <div className={`aura-reflection${v}`} />
          </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes orbit-rise {
          from { opacity: 0; transform: translateY(70px) scale(0.7); filter: blur(8px); }
          60%  { opacity: 1; }
          to   { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes orbit-float {
          0%, 100% { transform: translateY(calc(var(--amp) * 1px)) rotate(calc(var(--rot) * 1deg)); }
          50%      { transform: translateY(calc(var(--amp) * -1px)) rotate(calc(var(--rot) * -1deg)); }
        }
        @keyframes orbit-disc-in {
          from { opacity: 0; transform: translateX(-50%) scaleX(0.35) scaleY(0.15); }
          to   { opacity: 1; transform: translateX(-50%) scaleX(1) scaleY(1); }
        }
        @keyframes orbit-beam-pulse {
          0%, 100% { opacity: 0.7; transform: translateX(-50%) scaleY(1); }
          50%      { opacity: 1; transform: translateX(-50%) scaleY(1.06); }
        }
        @keyframes orbit-halo-pulse {
          0%, 100% { opacity: 0.55; }
          50%      { opacity: 0.9; }
        }
        @keyframes orbit-spark {
          0%, 100% { opacity: 0.15; transform: translateY(0); }
          50%      { opacity: 0.9; transform: translateY(-6px); }
        }
        @keyframes orbit-hub-in {
          from { opacity: 0; transform: translateY(46px) scale(0.55); filter: blur(10px); }
          to   { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes orbit-hub-float {
          0%, 100% { transform: translateY(-4px); }
          50%      { transform: translateY(4px); }
        }
        @keyframes orbit-scene-float {
          0%, 100% { transform: translateY(-10px); }
          50%      { transform: translateY(10px); }
        }
        @keyframes orbit-hub-ring {
          0%   { opacity: 0.5; transform: scale(1); }
          70%  { opacity: 0; transform: scale(1.55); }
          100% { opacity: 0; transform: scale(1.55); }
        }
        @keyframes orbit-wire-flow {
          from { stroke-dashoffset: 40; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes orbit-text-in {
          from { opacity: 0; transform: translateY(28px); filter: blur(5px); }
          to   { opacity: 1; transform: translateY(0); filter: blur(0); }
        }

        .aura-section { position: relative; width: 100%; overflow: hidden; background-color: #FDFAF6; padding: 80px 24px; }
        .aura-container { position: relative; margin-left: auto; margin-right: auto; max-width: 76rem; }
        .aura-heading { margin-left: auto; margin-right: auto; max-width: 48rem; text-align: center; }
        .aura-badge {
          display: inline-flex; align-items: center; gap: 8px; border-radius: 9999px;
          border: 1px solid rgba(232, 201, 138, 0.5); background-color: #FDF6EC;
          padding: 6px 14px; font-size: 14px; font-weight: 500; color: #C17817;
        }
        .aura-badge.visible { animation: orbit-text-in 0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .aura-title {
          margin-top: 20px; font-size: 36px; font-weight: bold; line-height: 1.15;
          letter-spacing: -0.02em; color: #1F1B16;
        }
        .aura-title.visible { animation: orbit-text-in 0.8s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
        .aura-title :global(.accent) { color: #C17817; }
        .aura-description {
          margin-left: auto; margin-right: auto; margin-top: 16px; max-width: 32rem;
          line-height: 1.625; color: #6B6258;
        }
        .aura-description.visible { animation: orbit-text-in 0.8s cubic-bezier(0.22,1,0.36,1) 0.18s both; }
        .aura-stage {
          position: relative; margin-left: auto; margin-right: auto; margin-top: 48px;
          aspect-ratio: 73 / 62; width: 100%; max-width: 860px;
        }
        .aura-scene {
          position: absolute; inset: 0;
          animation: orbit-scene-float 7s ease-in-out infinite;
        }
        .aura-haze {
          pointer-events: none; position: absolute; left: 50%; top: 10%; height: 70%; width: 80%;
          transform: translateX(-50%); border-radius: 50%;
          background: radial-gradient(50% 50% at 50% 70%, rgba(242,160,61,0.16), transparent 70%);
          filter: blur(30px); opacity: 0; transition: opacity 1.4s ease 0.35s;
        }
        .aura-haze.visible { opacity: 1; }
        .aura-wires {
          pointer-events: none; position: absolute; inset: 0; height: 100%; width: 100%;
          opacity: 0; transition: opacity 1.2s ease 0.9s;
        }
        .aura-wires.visible { opacity: 1; }
        .aura-tile { position: absolute; width: 8.2%; transform: translate(-50%, -50%); }
        .aura-tile :global(.aura-tile-inner) {
          position: relative; display: grid; place-items: center; aspect-ratio: 1; width: 100%;
          border-radius: 26%; border: 1px solid #F0EBE3;
          background-color: #ffffff; box-shadow: 0 16px 32px -14px rgba(31, 27, 22, 0.18), 0 2px 8px -2px rgba(31,27,22,0.05);
          transition: transform 0.5s, border-color 0.5s, box-shadow 0.5s; cursor: pointer;
          overflow: hidden;
        }
        .aura-tile :global(.aura-tile-inner:hover) {
          transform: scale(1.1); border-color: rgba(193, 120, 23, 0.5);
          box-shadow: 0 0 32px -6px rgba(193, 120, 23, 0.35);
        }
        .aura-tile-glow {
          pointer-events: none; position: absolute; inset: 0; border-radius: 28%;
          filter: blur(14px); transform: scale(1.35); opacity: 0.5;
        }
        .aura-tile :global(.aura-tile-inner) :global(img),
        .aura-tile :global(.aura-tile-inner) :global(svg) {
          height: 45%; width: 45%; object-fit: contain;
          filter: drop-shadow(0 2px 6px rgba(31, 27, 22, 0.12));
        }
        .aura-hub { position: absolute; width: 13.5%; transform: translate(-50%, -50%); }
        .aura-hub :global(.aura-hub-container) {
          position: relative; display: grid; place-items: center; aspect-ratio: 1; width: 100%;
          border-radius: 26%; border: 1px solid rgba(193, 120, 23, 0.45); background-color: #ffffff;
          box-shadow: 0 20px 45px -16px rgba(31,27,22,0.18), 0 0 40px -8px rgba(193,120,23,0.35);
          background-image: linear-gradient(155deg, rgba(193,120,23,0.14), rgba(193,120,23,0) 60%);
        }
        .aura-hub :global(.aura-hub-container) :global(img),
        .aura-hub :global(.aura-hub-container) :global(svg) { height: 58%; width: 58%; object-fit: contain; }
        .aura-effects { pointer-events: none; position: absolute; inset: 0; }
        .aura-light-cone {
          position: absolute; left: 50%; top: 78%; height: 40%; width: 62%; transform: translateX(-50%);
          background: radial-gradient(38% 78% at 50% 0%, rgba(242,160,61,0.30), rgba(217,131,36,0.10) 55%, transparent 80%);
          filter: blur(26px); opacity: 0; transition: opacity 5s ease-in-out 0.9s;
        }
        .aura-light-cone.visible { animation: orbit-beam-pulse 5s ease-in-out 0.9s infinite; opacity: 1; }
        .aura-core {
          position: absolute; left: 50%; top: 86%; height: 22%; width: 30%; transform: translateX(-50%);
          border-radius: 50%;
          background: radial-gradient(50% 50% at 50% 50%, rgba(255,236,206,0.40), rgba(242,160,61,0.14) 55%, transparent 78%);
          filter: blur(26px); opacity: 0; transition: opacity 5s ease-in-out 0.9s;
        }
        .aura-core.visible { animation: orbit-halo-pulse 5s ease-in-out 0.9s infinite; opacity: 1; }
        .aura-disc {
          position: absolute; left: 50%; top: 75%; height: 9.6%; width: 100%;
          opacity: 0; transition: opacity 1.1s cubic-bezier(0.22,1,0.36,1) 0.2s;
        }
        .aura-disc.visible { animation: orbit-disc-in 1.1s cubic-bezier(0.22,1,0.36,1) 0.2s both; opacity: 1; }
        .aura-disc-haze {
          position: absolute; inset: -45%; border-radius: 50%;
          background: radial-gradient(50% 50% at 50% 50%, rgba(242,160,61,0.30), rgba(217,131,36,0.10) 50%, transparent 72%);
          filter: blur(26px); animation: orbit-halo-pulse 4.5s ease-in-out infinite;
        }
        .aura-disc-surface {
          position: absolute; inset: 0; border-radius: 50%;
          background: radial-gradient(80% 160% at 50% -30%, rgba(255,220,170,0.55), rgba(217,131,36,0.75) 42%, rgba(120,62,14,0.9) 78%, rgba(48,26,6,0.98) 100%);
          box-shadow: 0 0 55px rgba(242,160,61,0.35), inset 0 0 18px rgba(0,0,0,0.45);
        }
        .aura-disc-rim {
          position: absolute; inset: 0; border-radius: 50%;
          background: linear-gradient(180deg, rgba(255,236,206,0.55) 0%, transparent 22%, transparent 74%, rgba(255,240,214,0.95) 100%);
          filter: blur(1.2px); mix-blend-mode: screen;
        }
        .aura-sparkle { position: absolute; height: 3px; width: 3px; border-radius: 50%; background-color: #ffe8c4; }
        .aura-reflection {
          position: absolute; bottom: 0; left: 50%; height: 16%; width: 44%; transform: translateX(-50%);
          border-radius: 50%; background: radial-gradient(50% 50% at 50% 0%, rgba(242,160,61,0.2), transparent 72%);
          filter: blur(18px); opacity: 0; transition: opacity 1.2s ease 0.8s;
        }
        .aura-reflection.visible { opacity: 1; }

        @media (prefers-reduced-motion: reduce) {
          .aura-section * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </section>
  );
}
